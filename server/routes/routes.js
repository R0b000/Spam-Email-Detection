const express = require('express');
const emailController = require('../controller/email-controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const routes = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

routes.post('/register', emailController.register);
routes.post('/login', emailController.login);
routes.post('/logout', emailController.logout);
routes.post('/check-email', emailController.checkEmail);
routes.get('/emails/:type', emailController.getEmails);
routes.post('/save', emailController.savesendEmails);
routes.post('/save-draft', emailController.savesendEmails);
routes.put('/bin', emailController.updatedeleteEmails);
routes.put('/starred', emailController.toggleStarredEmail);
routes.put('/read', emailController.toggleReadEmail);
routes.put('/emails/:id', emailController.updateEmail);
routes.delete('/emails/:id', emailController.deleteEmail);
routes.post('/spam', emailController.saveSpamEmails);
routes.post('/process-message', emailController.detectspam);
routes.get('/unread-count', emailController.getUnreadCount);
routes.get('/search-emails', emailController.searchEmails);
routes.get('/users', emailController.getUsers);
routes.get('/health', (req, res) => {
    res.status(200).send('OK');
});

routes.post('/verify-recipients', emailController.verifyRecipients);

routes.post('/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(200).json({
            name: req.file.originalname,
            path: fileUrl,
            size: req.file.size,
            type: req.file.mimetype
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.get('/download', (req, res) => {
    try {
        const { file, name } = req.query;
        if (!file) {
            return res.status(400).json({ error: 'file is required' });
        }
        const filename = path.basename(file);
        const absolutePath = path.join(__dirname, '../uploads', filename);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        const downloadName = (name && path.basename(name)) || filename;
        res.download(absolutePath, downloadName);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

routes.delete('/delete-file', (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: 'filePath is required' });
        }
        const filename = path.basename(filePath);
        const absolutePath = path.join(__dirname, '../uploads', filename);
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            res.status(200).json({ message: 'File deleted successfully' });
        } else {
            res.status(404).json({ error: 'File not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = routes;
