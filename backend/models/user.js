const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        streetAddress: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        state: {
            type: String,
            required: true,
        }
    },
    contact: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        required: true,
    },
    medicalName: {
        type: String,
    },
    medicalAddress: {
        type: String,
    },
    canDeliver: {
        type: Boolean
    },
    status:{
        type: String,
        required: true
    },
    uId: {
        type: String
    }
})


const user = mongoose.model('user', userSchema);
module.exports = user

