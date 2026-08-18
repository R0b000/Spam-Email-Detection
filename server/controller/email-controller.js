const UserModel = require("../models/User.js");
const MessageModel = require("../models/Message.js");
const mongoose = require('mongoose');
const runPythonScript = require('./spam.js');

const emailController = {
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await emailController.authenticateUser(email, password);
            if (user) {
                res.json({
                    message: "Success",
                    user: {
                        name: user.name,
                        email: user.email,
                    },
                });
            } else {
                res.json("The email or password is incorrect");
            }
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    authenticateUser: async (email, password) => {
        const user = await UserModel.findOne({ email });
        if (user && user.password === password) {
            return user;
        }
        return null;
    },
    
    register: async (req, res) => {
        try {
            const user = await UserModel.create(req.body);
            res.json(user);
        } catch (err) {
            res.json(err);
        }
    },

    logout: (req, res) => {
        res.json({ message: 'Logout success' });
    },

    checkEmail: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ error: 'Email is required' });
            }
            const user = await UserModel.findOne({ email });
            if (user) {
                return res.status(200).json({ message: 'Email found', name: user.name });
            } else {
                return res.status(404).json({ error: 'Couldn\'t find your Email Account' });
            }
        } catch (err) {
            console.error('Error checking email:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    savesendEmails: async (req, res) => {
        try {
            console.log('Incoming POST request to /save:', req.body);
    
            let { senderId, receiverEmail, content, type, isSpam } = req.body;
    
            if (!mongoose.Types.ObjectId.isValid(senderId)) {
                const user = await UserModel.findOne({ email: senderId });
                if (!user) {
                    console.log('Sender not found for email:', senderId);
                    return res.status(404).json({ error: 'Sender not found' });
                }
                senderId = user._id;
            }
    
            let receiverEmails = [];
            if (Array.isArray(receiverEmail)) {
                receiverEmails = receiverEmail;
            } else if (typeof receiverEmail === 'string' && receiverEmail.trim()) {
                receiverEmails = receiverEmail.split(',').map(e => e.trim()).filter(Boolean);
            }

            if (type === 'draft') {
                const receiverStr = receiverEmails.join(', ');
                const message = await MessageModel.create({
                    sender: senderId,
                    receiver: null,
                    receiverEmail: receiverStr || null,
                    subject: content?.subject || null,
                    body: content?.body || null,
                    attachment: content?.attachment || null,
                    date: new Date(),
                    starred: false,
                    bin: false,
                    isSpam: isSpam || false,
                    type: 'draft',
                });
                console.log('Draft saved successfully:', message);
                return res.json({ message: 'Draft saved successfully', data: message });
            }

            if (receiverEmails.length === 0) {
                return res.status(400).json({ error: 'Receiver email is required' });
            }

            const senderUser = await UserModel.findById(senderId);
            const senderEmail = senderUser ? senderUser.email : '';

            let createdMessages = [];
            for (const rEmail of receiverEmails) {
                const receiver = await UserModel.findOne({ email: rEmail });
                if (receiver) {
                    const message = await MessageModel.create({
                        sender: senderId,
                        receiver: receiver._id,
                        receiverEmail: rEmail,
                        subject: content?.subject || null,
                        body: content?.body || null,
                        attachment: content?.attachment || null,
                        date: new Date(),
                        starred: false,
                        bin: false,
                        isSpam: isSpam || false,
                        type: type || 'sent',
                    });
                    createdMessages.push(message);
                } else {
                    // Save copy in Sent for sender visibility
                    const message = await MessageModel.create({
                        sender: senderId,
                        receiver: null,
                        receiverEmail: rEmail,
                        subject: content?.subject || null,
                        body: content?.body || null,
                        attachment: content?.attachment || null,
                        date: new Date(),
                        starred: false,
                        bin: false,
                        isSpam: isSpam || false,
                        type: type || 'sent',
                    });
                    createdMessages.push(message);

                    // Asynchronously create bounce-back notification from noreply@email.com
                    setImmediate(async () => {
                        try {
                            let daemonUser = await UserModel.findOne({ email: 'noreply@email.com' });
                            if (!daemonUser) {
                                daemonUser = await UserModel.create({
                                    name: 'noreply',
                                    email: 'noreply@email.com',
                                    password: 'system-virtual-account-no-login',
                                    role: 'user'
                                });
                            }

                            await MessageModel.create({
                                sender: daemonUser._id,
                                receiver: senderId,
                                receiverEmail: senderEmail,
                                subject: 'Delivery Status Notification (Failure)',
                                body: `Address not found. Your message to "${rEmail}" was not delivered because the address could not be found or is not registered.`,
                                date: new Date(),
                                starred: false,
                                bin: false,
                                isRead: false,
                                isSpam: false,
                                type: 'sent'
                            });
                        } catch (err) {
                            console.error('Failed to generate bounce-back email:', err);
                        }
                    });
                }
            }
    
            console.log('Messages sent successfully:', createdMessages);
            res.json({ message: 'Messages sent successfully', data: createdMessages[0] || null });
        } catch (error) {
            console.error('Error sending message:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    detectspam: async (req, res) => {
        try {
            console.log('========== SPAM DETECTION START ==========');
            console.log('[detectspam] Incoming request body:', JSON.stringify(req.body));

            const emailSubject = req.body.emailSubject;
            const emailBody = req.body.emailBody;

            console.log('[detectspam] Email Subject:', emailSubject);
            console.log('[detectspam] Email Body:', emailBody ? emailBody.substring(0, 100) + '...' : '(empty)');

            if (!emailSubject && !emailBody) {
                console.warn('[detectspam] WARNING: Both subject and body are empty!');
            }

            console.log('[detectspam] Calling Python script...');
            const startTime = Date.now();

            runPythonScript(emailSubject, emailBody)
                .then((output) => {
                    const elapsed = Date.now() - startTime;
                    console.log(`[detectspam] Python script completed in ${elapsed}ms`);
                    console.log('[detectspam] Python script raw output:', output);

                    // Check if the output contains a prediction
                    const hasPrediction = output.includes('Prediction:');
                    console.log('[detectspam] Contains prediction:', hasPrediction);

                    if (hasPrediction) {
                        const isSpam = output.includes('classified as SPAM');
                        console.log('[detectspam] Classification result:', isSpam ? 'SPAM' : 'HAM (not spam)');
                    }

                    console.log('========== SPAM DETECTION END ==========');
                    res.status(200).json({ result: output });
                })
                .catch((error) => {
                    const elapsed = Date.now() - startTime;
                    console.error(`[detectspam] Python script FAILED after ${elapsed}ms`);
                    console.error('[detectspam] Error:', error.message);
                    console.log('========== SPAM DETECTION FAILED ==========');
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        } catch (error) {
            console.error('[detectspam] Unexpected error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },                                  

    saveSpamEmails: async (req, res) => {
        try {
            console.log('Incoming POST request to /save:', req.body);
    
            let { senderId, receiverEmail, content, type } = req.body;
    
            if (!mongoose.Types.ObjectId.isValid(senderId)) {
                const user = await UserModel.findOne({ email: senderId });
                if (!user) {
                    console.log('Sender not found for email:', senderId);
                    return res.status(404).json({ error: 'Sender not found' });
                }
                senderId = user._id;
            }
    
            let receiverEmails = [];
            if (Array.isArray(receiverEmail)) {
                receiverEmails = receiverEmail;
            } else if (typeof receiverEmail === 'string' && receiverEmail.trim()) {
                receiverEmails = receiverEmail.split(',').map(e => e.trim()).filter(Boolean);
            }

            if (receiverEmails.length === 0) {
                return res.status(400).json({ error: 'Receiver email is required' });
            }

            const senderUser = await UserModel.findById(senderId);
            const senderEmail = senderUser ? senderUser.email : '';

            let createdMessages = [];
            for (const rEmail of receiverEmails) {
                const receiver = await UserModel.findOne({ email: rEmail });
                if (receiver) {
                    const message = await MessageModel.create({
                        sender: senderId,
                        receiver: receiver._id,
                        receiverEmail: rEmail,
                        subject: content?.subject || null,
                        body: content?.body || null,
                        attachment: content?.attachment || null,
                        date: new Date(),
                        starred: false,
                        bin: false,
                        isSpam: true,
                        type: 'spam',
                    });
                    createdMessages.push(message);
                } else {
                    // Save copy in Sent for sender visibility
                    const message = await MessageModel.create({
                        sender: senderId,
                        receiver: null,
                        receiverEmail: rEmail,
                        subject: content?.subject || null,
                        body: content?.body || null,
                        attachment: content?.attachment || null,
                        date: new Date(),
                        starred: false,
                        bin: false,
                        isSpam: true,
                        type: 'spam',
                    });
                    createdMessages.push(message);

                    // Asynchronously create bounce-back notification from noreply@email.com
                    setImmediate(async () => {
                        try {
                            let daemonUser = await UserModel.findOne({ email: 'noreply@email.com' });
                            if (!daemonUser) {
                                daemonUser = await UserModel.create({
                                    name: 'noreply',
                                    email: 'noreply@email.com',
                                    password: 'system-virtual-account-no-login',
                                    role: 'user'
                                });
                            }

                            await MessageModel.create({
                                sender: daemonUser._id,
                                receiver: senderId,
                                receiverEmail: senderEmail,
                                subject: 'Delivery Status Notification (Failure)',
                                body: `Address not found. Your message to "${rEmail}" was not delivered because the address could not be found or is not registered.`,
                                date: new Date(),
                                starred: false,
                                bin: false,
                                isRead: false,
                                isSpam: false,
                                type: 'sent'
                            });
                        } catch (err) {
                            console.error('Failed to generate bounce-back email:', err);
                        }
                    });
                }
            }
    
            console.log('Messages sent successfully:', createdMessages);
            res.json({ message: 'Messages sent successfully', data: createdMessages[0] || null });
        } catch (error) {
            console.error('Error sending message:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },        

    getEmails: async (request, response) => {
        try {
            const { userEmail } = request.query;
            const { type } = request.params;
    
            if (!userEmail) {
                return response.status(400).json({ error: 'User email is not provided' });
            }
    
            // Find the user document based on the provided email
            const user = await UserModel.findOne({ email: userEmail });
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }
    
            let messages;
    
            if (type === 'inbox') {
                // Retrieve messages where the receiver is the user
                messages = await MessageModel.find({ receiver: user._id, type: 'sent', starred: false, bin: false });
            } else if (type === 'allmail') {
                // Retrieve all messages where the user is either the sender or receiver, excluding drafts sent by other users
                messages = await MessageModel.find({
                    $or: [
                        { sender: user._id, type: { $nin: ['spam'] } }, // Find messages sent by the user excluding spam messages
                        { receiver: user._id, type: { $nin: ['draft', 'spam'] } } // Find messages received by the user excluding drafts and spam messages
                    ],
                    bin: false // Exclude messages that are in the bin (trash)
                });
            } else if (type === 'starred') {
                // Retrieve starred messages where the receiver or sender is the user
                messages = await MessageModel.find({ $or: [{ sender: user._id }, { receiver: user._id }], starred: true, bin: false });
            } else if (type === 'sent') {
                // Retrieve messages where the sender is the user and type is either 'sent' or 'spam'
                messages = await MessageModel.find({ sender: user._id, type: { $in: ['sent', 'spam'] }, starred: false, bin: false });
            } else if (type === 'draft') {
                // Retrieve draft messages where the sender is the user
                messages = await MessageModel.find({ sender: user._id, type: 'draft', starred: false, bin: false });
            } else if (type === 'spam') {
                // Retrieve messages marked as spam for the user
                messages = await MessageModel.find({ receiver: user._id, type: 'spam' });
            } else {            
                // Retrieve messages where the sender is the user and type matches
                messages = await MessageModel.find({ sender: user._id, type: type });
            }
    
            if (messages.length === 0) {
                return response.status(200).json({ message: 'No messages found', data: [] });
            }
    
            // Retrieve the email of the receiver for each message
            const messagesWithEmails = await Promise.all(messages.map(async (message) => {
                let receiverEmail = ''; // Initialize receiverEmail
                let senderName = '';
                let receiverName = '';
    
                const sender = await UserModel.findById(message.sender);
                const receiver = message.receiver ? await UserModel.findById(message.receiver) : null;
                
                if (sender) senderName = sender.name;
                if (receiver) receiverName = receiver.name;
    
                if (type === 'inbox' || type === 'spam') {
                    receiverEmail = sender ? sender.email : '';
                } else if (type === 'starred' || type === 'allmail' || type === 'bin') {
                    // Use sender email if session user email matches receiver, else use receiver email
                    if (message.receiver && userEmail !== message.receiver.toString() && userEmail !== (sender ? sender.email : '')) {
                        receiverEmail = sender ? sender.email : '';
                    } else { 
                        receiverEmail = message.receiverEmail || (receiver ? receiver.email : '');
                    }
                } else if (type === 'sent' || type === 'draft') {
                    if (message.receiverEmail) {
                        receiverEmail = message.receiverEmail;
                    } else {
                        receiverEmail = receiver ? receiver.email : '';
                    }
                } 
                return { ...message.toObject(), receiverEmail, senderName, receiverName };
            }));
    
            response.status(200).json({ message: 'Messages retrieved successfully', data: messagesWithEmails });
    
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    },                                                                

    updatedeleteEmails: async (request, response) => {
        try {
            const { messageIds, type: updatedType, value } = request.body; // Destructure `type` as `updatedType`
    
            if (!Array.isArray(messageIds)) {
                return response.status(400).json({ error: 'messageIds must be an array' });
            }
    
            const messageObjectIds = messageIds.map(id => {
                // Check if the id is a valid ObjectId
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return null; // Or handle the invalid id in a different way
                }
                return new mongoose.Types.ObjectId(id);
            }).filter(id => id !== null); // Filter out invalid ObjectIds
    
            // Update the emails with the provided type
            // Modify this according to your requirements
            await MessageModel.updateMany(
                { _id: { $in: messageObjectIds }},
                { $set: { type: updatedType,
                        bin: value } },
            );
            
            response.status(200).json({ message: 'Emails updated successfully' });
        } catch (error) {
            console.error('Error updating emails:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    toggleStarredEmail: async (request, response) => {
        try {
            const { id, value } = request.body;
    
            // Update the starred status of the email
            await MessageModel.updateOne({ _id: id }, { $set: { starred: value }});
    
            console.log('Starred status updated successfully');
            response.status(201).json({ message: 'Starred status updated successfully' });
        } catch (error) {
            console.error('Error updating starred status:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },
    
    toggleReadEmail: async (request, response) => {
        try {
            const { id, value } = request.body;
    
            // Update the isRead status of the email
            await MessageModel.updateOne({ _id: id }, { $set: { isRead: value }});
    
            console.log('Read status updated successfully');
            response.status(201).json({ message: 'Read status updated successfully' });
        } catch (error) {
            console.error('Error updating read status:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    updateEmail: async (request, response) => {
        try {
            const { id } = request.params;
            const { content, receiverEmail, senderId, name, type } = request.body;

            const updateFields = {
                date: new Date(),
            };

            // Destructure content into top-level schema fields
            if (content) {
                if (content.subject !== undefined) updateFields.subject = content.subject;
                if (content.body !== undefined) updateFields.body = content.body;
                if (content.attachment !== undefined) updateFields.attachment = content.attachment;
            }

            if (receiverEmail !== undefined) updateFields.receiverEmail = receiverEmail;
            if (name !== undefined) updateFields.name = name;
            if (type !== undefined) updateFields.type = type;

            // Resolve receiver ObjectId if receiverEmail is provided
            if (receiverEmail) {
                const receiver = await UserModel.findOne({ email: receiverEmail });
                if (receiver) {
                    updateFields.receiver = receiver._id;
                }
            }

            await MessageModel.updateOne({ _id: id }, { $set: updateFields });
            response.status(200).json({ message: 'Email updated successfully' });
        } catch (error) {
            console.error('Error updating email:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteEmail: async (request, response) => {
        try {
            const { id } = request.params;
            await MessageModel.deleteOne({ _id: id });
            response.status(200).json({ message: 'Email deleted successfully' });
        } catch (error) {
            console.error('Error deleting email:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        }
    },

    getUnreadCount: async (request, response) => {
        try {
            const { userEmail } = request.query;
            if (!userEmail) {
                return response.status(400).json({ error: 'User email is not provided' });
            }
            const user = await UserModel.findOne({ email: userEmail });
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            let query = {};
            if (user.role === 'admin') {
                query = {
                    isRead: false,
                    bin: false,
                    type: 'sent'
                };
            } else {
                query = {
                    receiver: user._id,
                    isRead: false,
                    bin: false,
                    type: 'sent'
                };
            }

            const count = await MessageModel.countDocuments(query);
            response.status(200).json({ count, role: user.role });
        } catch (error) {
            console.error('Error fetching unread count:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    searchEmails: async (request, response) => {
        try {
            const { userEmail, query } = request.query;
            if (!userEmail) {
                return response.status(400).json({ error: 'User email is not provided' });
            }
            const user = await UserModel.findOne({ email: userEmail });
            if (!user) {
                return response.status(404).json({ error: 'User not found' });
            }

            if (!query) {
                return response.status(200).json({ data: [] });
            }

            let filter = {};
            if (query.startsWith('from:')) {
                const fromEmail = query.substring(5).trim();
                const fromUser = await UserModel.findOne({ email: new RegExp(fromEmail, 'i') });
                if (fromUser) {
                    filter = { sender: fromUser._id };
                } else {
                    filter = { receiverEmail: new RegExp(fromEmail, 'i') };
                }
            } else if (query.startsWith('to:')) {
                const toEmail = query.substring(3).trim();
                const toUser = await UserModel.findOne({ email: new RegExp(toEmail, 'i') });
                if (toUser) {
                    filter = { receiver: toUser._id };
                } else {
                    filter = { receiverEmail: new RegExp(toEmail, 'i') };
                }
            } else if (query.startsWith('subject:')) {
                const subjectVal = query.substring(8).trim();
                filter = { subject: new RegExp(subjectVal, 'i') };
            } else {
                const regex = new RegExp(query, 'i');
                filter = {
                    $or: [
                        { subject: regex },
                        { body: regex },
                        { receiverEmail: regex },
                        { name: regex }
                    ]
                };
            }

            // Apply strict user ownership constraints in all cases
            const finalFilter = {
                $and: [
                    {
                        $or: [
                            { sender: user._id },
                            { receiver: user._id },
                            { receiverEmail: user.email }
                        ]
                    },
                    filter
                ]
            };

            const messages = await MessageModel.find(finalFilter);

            const mappedMessages = await Promise.all(messages.map(async (message) => {
                let receiverEmail = '';
                let senderName = '';
                let receiverName = '';
    
                const sender = await UserModel.findById(message.sender);
                const receiver = message.receiver ? await UserModel.findById(message.receiver) : null;
                
                if (sender) senderName = sender.name;
                if (receiver) receiverName = receiver.name;
    
                if (message.receiverEmail) {
                    receiverEmail = message.receiverEmail;
                } else {
                    receiverEmail = receiver ? receiver.email : '';
                }
                return { ...message.toObject(), receiverEmail, senderName, receiverName };
            }));

            response.status(200).json({ data: mappedMessages });
        } catch (error) {
            console.error('Error searching emails:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    getUsers: async (request, response) => {
        try {
            const { query, excludeEmail } = request.query;
            let filter = {};
            
            if (query) {
                const regex = new RegExp(query, 'i');
                filter = {
                    $or: [
                        { name: regex },
                        { email: regex }
                    ]
                };
            }

            if (excludeEmail) {
                if (filter.$or) {
                    filter = {
                        $and: [
                            { email: { $ne: excludeEmail } },
                            { $or: filter.$or }
                        ]
                    };
                } else {
                    filter.email = { $ne: excludeEmail };
                }
            }

            const users = await UserModel.find(filter).limit(10).select('name email');
            response.status(200).json({ data: users });
        } catch (error) {
            console.error('Error fetching users:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    },

    verifyRecipients: async (request, response) => {
        try {
            const { emails } = request.body;
            if (!Array.isArray(emails)) {
                return response.status(400).json({ error: 'emails must be an array' });
            }
            const valid = [];
            const invalid = [];
            for (const email of emails) {
                const user = await UserModel.findOne({ email });
                if (user) {
                    valid.push(email);
                } else {
                    invalid.push(email);
                }
            }
            response.status(200).json({ valid, invalid });
        } catch (error) {
            console.error('Error verifying recipients:', error);
            response.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    }
};

module.exports = emailController;
