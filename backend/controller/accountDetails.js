const accountDetails = require('../models/accountDetails');



async function addAccountDetails(req, res, next) {
    try {
        const { userId, accountHolderName, accountNumber, ifscCode, bankName, branchName, accountType } = req.body;

        if (!userId || !accountHolderName || !accountNumber || !ifscCode || !bankName || !branchName || !accountType) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }

        const newAccountDetails = new accountDetails({
            userId,
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
            branchName,
            accountType
        });

        const saved = await newAccountDetails.save();

        return res.status(200).json({
            status: 'Success',
            message: "Account details submitted successfully",
            data: saved,
        });

    } catch (error) {
        console.log("Error in add account details: ", error);
        return res.status(500).json({ status: false, message: error.message });
    }
}




async function getAccountDetailsByUserId(req, res, next) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: 'Failed', message: "userId is required" });
    }
    const details = await accountDetails.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      message: "account details fetched successfully",
      data: details
    });

  } catch (error) {
    console.log("Error in getAccountDetailsByUserId:", error);
    return res.status(500).json({
      status: 'Failed',
      message: "Something went wrong",
      error: error.message
    });
  }
}

module.exports = { addAccountDetails, getAccountDetailsByUserId }
