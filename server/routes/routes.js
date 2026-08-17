const express = require('express');
const emailController = require('../controller/email-controller');

const routes = express.Router();

routes.post('/register', emailController.register);
routes.post('/login', emailController.login);
routes.post('/logout', emailController.logout);
routes.get('/emails/:type', emailController.getEmails);
routes.post('/save', emailController.savesendEmails);
routes.post('/save-draft', emailController.savesendEmails);
routes.put('/bin', emailController.updatedeleteEmails);
routes.put('/starred', emailController.toggleStarredEmail);
routes.put('/read', emailController.toggleReadEmail);
routes.put('/emails/:id', emailController.updateEmail);
routes.delete('/emails/:id', emailController.deleteEmail);
routes.post('/spam', emailController.saveSpamEmails);
routes.post('/detect', emailController.detectspam);

module.exports = routes;
