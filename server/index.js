// server.js or app.js

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const Connection = require('./database/db.js');
const routes = require('./routes/routes');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(cors());

// Initialize express-session middleware
app.use(session({
    secret: 'admin',
    resave: false,
    saveUninitialized: true
}));

Connection();

app.use('/', routes);

const PORT = process.env.PORT || 3001; // Allow port to be set from environment variable

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
