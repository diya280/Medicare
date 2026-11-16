
const mongoose = require('mongoose');

async function databaseConnection() {
    try {
        const url = process.env.MONGODB_URI;

        if (!url) {
            throw new Error('MONGODB_URI is missing');
        }

        await mongoose.connect(url);

        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
}

module.exports = databaseConnection;
