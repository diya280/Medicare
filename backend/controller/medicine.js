const Medicine = require('../models/medicine.js');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const medical = require('../models/user.js');
const medicalImg = require('../models/medicalUpload.js');
const medicine = require('../models/medicine.js');



async function addMedicine(req, res) {
  try {
    const {
      city,
      photo,
      name,
      userId,
      price,
      description,
      quantityInStock,
      availableToDispatch
    } = req.body;

    
    if (!name || !userId) {
      return res.status(400).json({ message: "Name and userId are required" });
    }

    if (!photo || !Array.isArray(photo) || photo.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    const uploadDir = path.join(__dirname, "../public/images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedFiles = photo.map((base64Str, index) => {
      if (!base64Str.includes("base64")) {
        throw new Error("Invalid base64 image format");
      }

      const base64Data = base64Str.split(",")[1];
      const filename = `${Date.now()}_${index}.png`;
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, base64Data, "base64");
      return {
        filename,
        url: `/public/images/${filename}`
      };
    });


    const newMedicine = new Medicine({
      city,
      name,
      userId,
      price,
      description,
      quantityInStock,
      availableToDispatch,
      photos: savedFiles
    });

    const saved = await newMedicine.save();

    return res.status(201).json({
      status: "Success",
      message: "Medicine Added Successfully",
      data: saved
    });
  } catch (error) {
    console.error("Error in addMedicine:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
}



async function getMedicineDataByUserId(req, res, next) {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const records = await Medicine.find({ userId: userId });
    if (!records || records.length === 0) {
      return res.status(200).json({ status: 'Success', message: "No medical records found for this user", data: [] });
    }
    res.status(200).json({
      status: 'Success',
      message: "Medical records fetched successfully",
      data: records || [],
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ status: 'error', message: "Server error", error });
  }
}


async function updateMedicineStock(req, res, next) {
  try {
    const { medicineId, stockChange, availableToDispatch } = req.body;

    if (!medicineId) {
      return res.status(400).json({
        status: false,
        message: "medicineId is required",
      });
    }

    if (stockChange === undefined) {
      return res.status(400).json({
        status: false,
        message: "stockChange is required",
      });
    }

    const medicine = await Medicine.findById(medicineId);

    if (!medicine) {
      return res.status(404).json({
        status: false,
        message: "Medicine not found",
      });
    }

    const previousStock = medicine.quantityInStock;
    const newStock = previousStock + stockChange;

    if (newStock < 0) {
      return res.status(400).json({
        status: false,
        message: `Insufficient stock. Available: ${previousStock}`,
      });
    }

    const updateData = {
      quantityInStock: newStock,
    };

    if (availableToDispatch !== undefined) {
      updateData.availableToDispatch = availableToDispatch;
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      medicineId,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      status: 'Success',
      message: "Medicine stock updated successfully",
      previousStock,
      updatedStock: updatedMedicine.quantityInStock,
      data: updatedMedicine,
    });

  } catch (error) {
    console.log("this is error at the function updateMedicineStock: ", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}




async function fetchMedicals(params) {
  try {
    const { userId } = params;
    const medicines = await Medicine.find({
      userId: { $ne: userId }
    });

    return medicines;

  } catch (error) {
    console.log("this is error at function fetchMedicals: ", error)
    return error
  }
}



async function getMedicalByCity(req, res) {
  try {
    let { city } = req.body;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required."
      });
    }

    city = city.toLowerCase();

    const medicals = await medical.find({
      role: "medical",
      status: 'Active',
      "address.city": { $regex: new RegExp(`^${city}$`, "i") }
    });

    return res.status(200).json({
      status: 'Success',
      total: medicals.length,
      data: medicals
    });

  } catch (error) {
    console.log("Error at getMedicalByCity:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}


async function getAllMedical(req, res) {
  try {
    const allMedicals = await medical.find({
      role: 'medical',
      status: 'Active',
    });

    return res.status(200).json({
      status: 'Success',
      total: allMedicals.length,
      data: allMedicals
    });

  } catch (error) {
    console.log("Error at getAllMedical:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}



async function getAllUsers(req, res) {
  try {
    const users = await medical.find({
      role: 'user',
      status: 'Active',
    })
    return res.status(200).json({
      status: 'Success',
      total: users.length,
      data: users
    })

  } catch (error) {
    console.log("Error at getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}



async function getMedicalImagesByIdArray(req, res) {
  try {
    const { userId } = req.body;

    if (!userId || !Array.isArray(userId) || userId.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Medical id's are required"
      });
    }

    const result = await medicalImg.find({
      userId: { $in: userId },
      status: 'Active'
    });

    return res.status(200).json({
      status: 'Success',
      count: result.length,
      data: result
    });

  } catch (error) {
    console.log("Error at getMedicalImagesByIdArray:", error);
    return res.status(500).json({
      status: 'error',
      message: "Internal server error",
      error: error.message
    });
  }
}



async function getAllMedicineDataByCity(req, res) {
  try{
    const {city} = req.body;
        if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required."
      });
    }

   const cityLowerCase = city.toLowerCase();

    const medicals = await medicine.find({
      
      city: { $regex: new RegExp(`^${cityLowerCase}$`, "i") }
    });

    return res.status(200).json({
      status: 'Success',
      total: medicals.length,
      data: medicals
    });


  }catch (error) {
    console.log("Error at getAllMedicineDataByCity:", error);
    return res.status(500).json({
      status: 'error',
      message: "Internal server error",
      error: error.message
    });
  }
}



module.exports = { addMedicine, getMedicineDataByUserId, updateMedicineStock, fetchMedicals, getMedicalByCity, 
  getAllMedical, getAllUsers, getMedicalImagesByIdArray, getAllMedicineDataByCity
};
