const mongoose = require('mongoose');

const medicalImageSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true,
        ref: 'User'
    },
    medicalName: {
        type: String,
        required: true
    },
    medicalAddress: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    images: [
        {
            filename: { type: String, required: true },
            url: { type: String, required: true } 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MedicalImages', medicalImageSchema);
