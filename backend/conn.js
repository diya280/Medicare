
// const mongoose = require('mongoose');

// async function databaseConnection() {
//     try {
//         const url = process.env.MONGODB_URI;

//         if (!url) {
//             throw new Error('MONGODB_URI is missing');
//         }

//         await mongoose.connect(url);

//         console.log('MongoDB connection established');
//     } catch (err) {
//         console.error('MongoDB connection failed:', err);
//         process.exit(1);
//     }
// }

// module.exports = databaseConnection;


const mongoose = require('mongoose');

async function databaseConnection() {
    try {
        const url = process.env.MONGODB_URI;

        if (!url) {
            throw new Error('MONGODB_URI is missing in environment variables');
        }

        await mongoose.connect(url);

        console.log('MongoDB Atlas connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }
}

module.exports = databaseConnection;