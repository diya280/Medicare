const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    buyerName: {
        type: String,
        required: true,
    },
    deliverAddress: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    medicineDetails: {
        medicineName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        medicineId: {
            type: String,
            required: true
        }
    },
    buyerData: {
        type: {},
        required: true
    },
    medicalData: {
        type: {},
        required: true
    },
    status: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: null
    },
    paymentStatus: {
        type: String,
        default: null
    },

}, { timestamps: true });

module.exports = mongoose.model("cart", cartSchema);
