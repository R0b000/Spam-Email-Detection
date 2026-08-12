const express = require('express');
const axios = require('axios');
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
routes.post('/spam', emailController.saveSpamEmails);
routes.post('/detect', emailController.detectspam);

module.exports = routes;
