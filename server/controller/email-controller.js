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

        savesendEmails: async (req, res) => {
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
        
                const receiver = await UserModel.findOne({ email: receiverEmail });
                if (!receiver) {
                    console.log('Receiver not found for email:', receiverEmail);
                    return res.status(404).json({ error: 'Receiver not found' });
                }
        
                const message = await MessageModel.create({
                    sender: senderId,
                    receiver: receiver._id,
                    subject: content?.subject || null,
                    body: content?.body || null,
                    attachment: content?.attachment || null,
                    date: new Date(),
                    starred: false,
                    bin: false,
                    type: type || 'sent', // Use the type parameter from the payload or default to 'sent'
                });
        
                console.log('Message sent successfully:', message);
                res.json({ message: 'Message sent successfully', data: message });
            } catch (error) {
                console.error('Error sending message:', error.message);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        },

        detectspam: async (req, res) => {
            try {
                console.log('Incoming POST request to /detectspam:', req.body);
        
                const emailSubject = req.body.emailSubject; // Extract email subject from request body
                const emailBody = req.body.emailBody; // Extract email body from request body
        
                runPythonScript(emailSubject, emailBody)
                    .then((output) => {
                        console.log('Python script output:', output);
                        // Send response back to client with the result
                        res.status(200).json({ result: output });
                    })
                    .catch((error) => {
                        console.error('Error running Python script:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    });
            } catch (error) {
                console.error('Error detecting spam:', error.message);
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
        
                const receiver = await UserModel.findOne({ email: receiverEmail });
                if (!receiver) {
                    console.log('Receiver not found for email:', receiverEmail);
                    return res.status(404).json({ error: 'Receiver not found' });
                }
        
                const message = await MessageModel.create({
                    sender: senderId,
                    receiver: receiver._id,
                    subject: content?.subject || null,
                    body: content?.body || null,
                    attachment: content?.attachment || null,
                    date: new Date(),
                    starred: false,
                    bin: false,
                    type: 'spam', // Use the type parameter from the payload or default to 'sent'
                });
        
                console.log('Message sent successfully:', message);
                res.json({ message: 'Message sent successfully', data: message });
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
        
                    if (type === 'inbox' || type === 'spam') {
                        // Find the user document based on the sender ObjectId
                        const sender = await UserModel.findById(message.sender);
                        // Use the sender's email as receiverEmail for inbox
                        receiverEmail = sender.email;
                    } else if (type === 'starred' || type === 'allmail' || type === 'bin') {
                        const sender = await UserModel.findById(message.sender);
                        const receiver = await UserModel.findById(message.receiver);
                        // Use sender email if session user email matches receiver, else use receiver email
                        if (userEmail !== message.receiver && userEmail !== sender.email) {
                            receiverEmail = sender.email;
                        } else { 
                            receiverEmail = receiver.email;
                        }
                    } else if (type === 'sent' || type === 'draft') {
                        // Find the user document based on the receiver ObjectId
                        const receiver = await UserModel.findById(message.receiver);
                        // Use the receiver's email as receiverEmail for spam and sent messages
                        receiverEmail = receiver.email;
                    } 
                    return { ...message.toObject(), receiverEmail };
                }));
        
                response.status(200).json(messagesWithEmails);
        
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
        }

    };

    module.exports = emailController;
