// server.js or app.js

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const session = require('express-session');
const Connection = require('./database/db.js');
const routes = require('./routes/routes');

const app = express();
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Serve static files from the React app build folder (Vite dist directory)
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.use('/api', routes);

// Fallback to React index.html for SPA routing
app.get('*', (req, res) => {
    // If it's a file request that doesn't exist, return 404
    if (path.extname(req.path)) {
        return res.status(404).end();
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 3001; // Allow port to be set from environment variable

app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
