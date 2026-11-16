const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
    availableToDispatch: {
        type: Boolean,
        default: false,
    },
    city: {
        type: String,
        required: true
    },
    photos:[
    {
        filename: { type: String, required: true },
        url: { type: String, required: true }
    }
],
    userId: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
