const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/medicare';

async function databaseConnection() {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connection established');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }
}

databaseConnection();

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

module.exports = mongoose;

