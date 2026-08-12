const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Connection = () => {
    const DB_URL = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ac-zmibxfq-shard-00-00.6gggddu.mongodb.net:27017,ac-zmibxfq-shard-00-01.6gggddu.mongodb.net:27017,ac-zmibxfq-shard-00-02.6gggddu.mongodb.net:27017/?ssl=true&replicaSet=atlas-ojn4b2-shard-0&authSource=admin&retryWrites=true&w=majority`;
    try {
        mongoose.connect(DB_URL, { useNewUrlParser: true});
        console.log('Database connected successfully'); 
    } catch (erro) {
        console.log('Error while connecting with the database', error.message);
    }
}

module.exports = Connection;