const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Connection = () => {
    const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@e-commerce.lswq8bw.mongodb.net/Email?appName=E-COMMERCE`;
    try {
        mongoose.connect(DB_URL);
        console.log('Database connected successfully'); 
    } catch (error) {
        console.log('Error while connecting with the database', error.message);
    }
}

module.exports = Connection;