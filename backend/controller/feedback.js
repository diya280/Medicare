const feedback = require('../models/feedback.js');



async function addFeedbackForUser(req, res, next) {
  try {
    const { userId, feedBackDataId, feedbackMessage, rating, medicalData } = req.body;

    if (!userId || !feedBackDataId || !feedbackMessage || !rating || !medicalData) {
      return res.status(400).json({
        status: false,
        message: "userId, feedBackDataId, feedbackMessage, rating & medicalData are required",
      });
    }

    const newFeedback = new feedback({
      userId,
      feedBackDataId,
      feedbackMessage,
      rating,
      medicalData,
      status: 'Active'
    });

    const saved = await newFeedback.save();

    return res.status(200).json({
      status: 'Success',
      message: "Feedback submitted successfully",
      data: saved,
    });

  } catch (error) {
    console.log("Error in addFeedback: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}

async function getAllFeedbacks(req, res) {
  try {
    const feedbacks = await feedback.find({ status: 'Active' }).sort({ createdAt: -1 });
    // .populate({ path: "userId", select: "fullName email contact" })
    // .populate({ path: "medicalStoreId", select: "fullName medicalName medicalAddress" })
    // .sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'Success',
      message: "All feedbacks fetched successfully",
      data: feedbacks,
    });

  } catch (error) {
    console.log("Error in getAllFeedbacks: ", error);
    return res.status(500).json({ message: error.message });
  }
}


async function getFeedbackByUserId(req, res, next) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: 'Failed', message: "userId is required" });
    }
    const feedbacks = await feedback.find({ userId, status: 'Active' }).sort({ createdAt: -1 });

    // .populate({
    //   path: "medicalStoreId",
    //   select: "fullName medicalName medicalAddress"
    // })

    return res.status(200).json({
      status: "Success",
      message: "Feedbacks fetched successfully",
      data: feedbacks
    });

  } catch (error) {
    console.log("Error in getFeedbackByUserId:", error);
    return res.status(500).json({
      status: 'Failed',
      message: "Something went wrong",
      error: error.message
    });
  }
}


async function getFeedbackByMedicineId(req, res, next) {
  try {
    const { feedBackDataId } = req.body;

    if (!feedBackDataId) {
      return res.status(400).json({
        status: 'Failed',
        message: 'UserId not found'
      })
    }

    const feedbackData = await feedback.find({ feedBackDataId, status: 'Active' })

    if (!feedbackData && feedbackData.length === 0) {
      return res.status(200).json({
        status: "Success",
        message: "No data found for this feedback data id",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Feedbacks fetched successfully",
      data: feedbackData || []
    });

  } catch (error) {
    console.log("Error in getFeedbackByMedicineId:", error);
    return res.status(500).json({
      status: 'Failed',
      message: "Something went wrong",
      error: error.message
    });
  }
}


async function updateStatusByAdmin(req, res, next) {
  try {
    const { _id, status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Status is required'
      })
    }

    const updatedCart = await feedback.findOneAndUpdate(
      { _id: _id },
      { status: status },
      { new: true }
    );

    return res.status(200).json({
      status: 'Success',
      message: 'Feedback status updated successfully!',
      data: updatedCart
    })

  } catch (err) {
    console.error('Error at updateStatusByAdmin', err)
    return res.status(500).json({
      status: 'Failed',
      message: 'Internal server error',
      error: err
    })
  }
}



async function getFeedbackByMedicalId(req, res, next) {
  try {

    const { medicalId } = req.body;

    if (!medicalId) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Medical id is required',
      })
    }

    const records = await feedback.find({
      'medicalData._id': medicalId
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Successfully fetch records of feedback by medical id',
      data: records || []
    })
  } catch (error) {
    console.error('Error at getFeedbackByMedicalId', err);
    return res.status(500).json({
      status: 'Failed',
      message: 'Internal server error',
      error: err
    })
  }

}

module.exports = { addFeedbackForUser, getAllFeedbacks, getFeedbackByUserId, getFeedbackByMedicineId, updateStatusByAdmin, getFeedbackByMedicalId, }
