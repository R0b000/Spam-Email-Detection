const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    name: String,
    type: String,
    url: String,
});

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subject: String,
    body: String,
    attachment: attachmentSchema,
    date: {
        type: Date,
    },
    name: {
        type: String,
    },
    starred: {
        type: Boolean,
        required: true,
        default: false
    },
    bin: {
        type: Boolean,
        required: true,
        default: false
    },
    type: {
        type: String,
    },
}, { timestamps: true });

const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;
