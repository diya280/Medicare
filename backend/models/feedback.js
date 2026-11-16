const mongoose = require("mongoose");

// const feedbackSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",    // customer/user who gives feedback
//       required: true,
//     },
//     medicalStoreId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",    // medical store owner user
//       required: true,
//     },
//     feedbackMessage: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       min: 1,
//       max: 5,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

const feedbackSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    feedBackDataId: {
      type: String,
      required: true,
    },
    medicalData: {
      type: {},
      required: true
    },
    feedbackMessage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("Feedback", feedbackSchema);
