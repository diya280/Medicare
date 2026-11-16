const mongoose = require("mongoose");

const accountDetailsSchema = new mongoose.Schema({
    accountHolderName: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true
    },
    ifscCode: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    branchName: {
        type: {},
        required: true
    },
    accountType: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("accountDetaills", accountDetailsSchema);
