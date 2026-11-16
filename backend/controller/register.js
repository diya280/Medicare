const register = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const MedicalImages = require('../models/medicalUpload');
const uploadBase64Image = require("../utils/cloudinaryUpload");


async function addUser(req, res, next) {
  try {
    const {
      fullName, streetAddress, district, city,
      pincode, state, email, contact, password,
      role, medicalName, medicalAddress, canDeliver } = req.body;

    if (
      !fullName || !streetAddress || !district ||
      !role || !pincode || !state || !email || !city ||
      !contact || !password) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'All fields are required.',
      });
    }
    let existingUser;

    existingUser = await register.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Email is already registered.',
      });
    }

    existingUser = await register.findOne({ contact });
    if (existingUser) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Contact is already registered.',
      });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new register({
      fullName, email, contact, role, medicalName, medicalAddress, canDeliver,
      address: {
        streetAddress, district, pincode, state, city
      },
      uId: userId, password: hashedPassword,
      status: 'Active',
    });

    const addUser = await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'Success',
      language: 'en-US',
      data: addUser,
      token: token,
      message: 'Organization registered successfully.',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 'Error',
      language: 'en-US',
      message: 'Erron in signup, try after sometime',
    });
  }
}




async function userLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
        statusCode: 400
      });
    }

    const user = await register.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'User not found.',
        statusCode: 404,
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials.',
        statusCode: 401,
        message: 'Incorrect password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );
    res.status(200).json({
      status: "Success",
      language: 'en-US',
      message: 'Login successful',
      token: token,
      user: user,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: "Error",
      language: 'en-US',
      error: error.message,
      message: 'Error in organisation login'
    });
  }
}




async function getLoginUser(req, res, next) {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Id is required.',
      });
    }
    const loginUser = await register.findOne({ _id: userId })
    res.status(200).json({
      status: "Success",
      language: 'en-US',
      message: 'get login user succesfully !!',
      data: loginUser
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: "Error",
      language: 'en-US',
      error: err.message,
    });
  }

}













async function createCamp(req, res, next) {
  try {
    const {
      date, title, streetAddress,
      city, district, block, zipCode,
      state, contact } = req.body;

    if (!date || !title || !streetAddress || !city ||
      !district || !block || !zipCode || !state || !contact) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'All fields are required.',
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 'Error',
        language: 'en-US',
        message: 'Unauthorized: User ID not found.',
      });
    }

    const campId = req.user.id;

    const orgCamp = new camp({
      date,
      title,
      address: {
        streetAddress,
        city,
        district,
        block,
        zipCode,
        state,
      },
      contact,
      createdId: campId,
    });

    const addCamp = await orgCamp.save();

    res.status(201).json({
      status: 'Success',
      language: 'en-US',
      data: addCamp,
      message: 'Camp added successfully!',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: "Error",
      language: 'en-US',
      error: err.message,
    });
  }
}

async function getCampById(req, res, next) {
  try {
    const campId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 4;

    if (!campId) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Id is required.',
      });
    }

    const skip = (page - 1) * size;
    const camps = await camp.find({ createdId: campId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size);

    const total = await camp.countDocuments({ createdId: campId });

    res.status(200).json({
      status: 'Success',
      language: 'en-US',
      data: camps,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
      message: 'Get camp by ID successfully!',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: "Error",
      language: 'en-US',
      error: err.message,
    });
  }
}

async function getAllCamps(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'User ID is required.',
      });
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 6;
    const skip = (page - 1) * size;

    const totalCamps = await camp.countDocuments({ createdId: { $ne: userId } });
    const campData = await camp
      .find({ createdId: { $ne: userId } })
      .skip(skip)
      .limit(size);

    res.status(200).json({
      status: 'Success',
      language: 'en-US',
      data: campData,
      totalItems: totalCamps,
      currentPage: page,
      totalPages: Math.ceil(totalCamps / size),
      message: 'Get all camps successfully!',
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      status: 'Error',
      language: 'en-US',
      error: err.message,
    });
  }
}

async function addMember(req, res, next) {
  try {
    const {
      userData: { firstName, lastName, bloodGroup, streetAddress, city, district, contact, quantity },
      id: campId
    } = req.body;

    if (!firstName || !lastName || !bloodGroup || !streetAddress || !city || !district || !contact || !quantity || !campId) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'All fields are required.',
      });
    }

    const newAttendee = new attendees({
      firstname: firstName,
      lastname: lastName,
      bloodGroup,
      quantity,
      address: {
        streetAddress,
        city,
        district,
      },
      contact,
      campId,
    });

    const savedAttendee = await newAttendee.save();

    return res.status(201).json({
      status: 'Success',
      language: 'en-US',
      data: savedAttendee,
      message: 'Member added successfully',
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: 'Error',
      language: 'en-US',
      error: err.message,
      message: 'Error adding member',
    });
  }
}

async function getAttendeesById(req, res, next) {
  try {
    const id = req.query.id;
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    if (!id) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Id is required.',
      });
    }
    const skip = (page - 1) * size;
    const members = await attendees.find({ campId: id }).populate({ path: 'campId', model: 'camp' }).skip(skip).limit(parseInt(size)).exec();
    const total = await attendees.countDocuments({ campId: id });
    return res.status(200).json({
      status: 'Success',
      language: 'en-US',
      data: members,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / size),
        totalItems: total,
      },
      message: 'Members retrieved successfully by campId',
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: 'Error',
      language: 'en-US',
      error: err.message,
      message: 'Error in getting members',
    });
  }
}

async function filterByAddress(req, res, next) {
  try {
    const keyword = req.query.city;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;


    if (!keyword) {
      return res.status(400).json({
        status: 'Error',
        language: 'en-US',
        message: 'Did not get keyword for search',
      });
    }

    const query = {
      $or: [
        { 'address.streetAddress': { $regex: keyword, $options: 'i' } },
        { 'address.city': { $regex: keyword, $options: 'i' } },
        { 'address.district': { $regex: keyword, $options: 'i' } },
        { 'address.block': { $regex: keyword, $options: 'i' } },
        { 'address.state': { $regex: keyword, $options: 'i' } },
      ],
    };

    const totalItems = await camp.countDocuments(query);
    const filteredData = await camp.find(query)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      status: 'Success',
      language: 'en-US',
      data: filteredData,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        itemsPerPage: limit,
      },
      message: 'Search successfully by address with pagination',
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({
      status: 'Error',
      language: 'en-US',
      error: err.message,
      message: 'Error in searching address',
    });
  }
}













async function getDetailById(req, res) {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const records = await register.find({ _id: userId, role: 'medical' });
    if (!records || records.length === 0) {
      return res.status(200).json({ status: 'Success', message: "No medical records found for this user", data: [] });
    }
    res.status(200).json({
      status: 'Success',
      message: "Medical records fetched successfully",
      data: records || [],
    });
  } catch (error) {
    console.error("Error in getting getDetailById:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}


async function updateUserDetails(req, res) {
  try {
    const { userId, email, contact, streetAddress, city, district, pincode, state } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const updateData = {};
    if (email) updateData.email = email;
    if (contact) updateData.contact = contact;

    if (streetAddress || district || city || pincode || state) {
      for (let key of ["streetAddress", "district", "city", "pincode", "state"]) {
        if (req.body[key]) {
          updateData[`address.${key}`] = req.body[key];
        }
      }
    }
    const updatedUser = await register.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // return res.status(200).json(updatedUser);
    return res.status(200).json({
      status: 'Success',
      language: 'en-US',
      data: updatedUser,
      message: 'Update details successfully!',
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
}


// async function uploadMedicalImages(req, res, next) {
//   try {
//     const { images, medicalName, medicalAddress, userId } = req.body;

//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ message: "No images provided" });
//     }

//     const uploadDir = path.join(__dirname, '../public/images');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     let savedRecords = [];

//     for (let i = 0; i < images.length; i++) {
//       const base64Str = images[i];
//       const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");

//       const filename = `${Date.now()}_${i}.png`;
//       const filePath = path.join(uploadDir, filename);

//       fs.writeFileSync(filePath, base64Data, 'base64');

//       const newRecord = new MedicalImages({
//         userId,
//         medicalName,
//         medicalAddress,
//         images: [{
//           filename,
//           url: `/public/images/${filename}`
//         }],
//         status: "Active"
//       });

//       const saved = await newRecord.save();
//       savedRecords.push(saved);
//     }

//     res.status(200).json({
//       status: "Success",
//       message: "Images uploaded separately and saved successfully",
//       data: savedRecords
//     });

//   } catch (error) {
//     console.error("Error uploading images:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// }





async function uploadMedicalImages(req, res, next) {
    try {
        const { images, medicalName, medicalAddress, userId } = req.body;

        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                status: "Error",
                message: "No images provided"
            });
        }

        const uploadedImages = await Promise.all(
            images.map(image =>
                uploadBase64Image(image, "medicare/medical-images")
            )
        );

        const savedRecords = [];

        for (const image of uploadedImages) {
            const newRecord = new MedicalImages({
                userId,
                medicalName,
                medicalAddress,
                photos: [image],
                status: "Active"
            });

            const saved = await newRecord.save();
            savedRecords.push(saved);
        }

        return res.status(200).json({
            status: "Success",
            message: "Images uploaded successfully",
            data: savedRecords
        });

    } catch (error) {
        console.error("Error uploading medical images:", error);

        return res.status(500).json({
            status: "Error",
            message: "Medical image upload failed",
            error: error.message
        });
    }
}




async function getMedicalImagesByUserId(req, res, next) {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const records = await MedicalImages.find({ userId: userId, status: 'Active' });
    if (!records || records.length === 0) {
      return res.status(200).json({ status: 'Success', message: "No medical records found for this user" });
    }
    res.status(200).json({
      status: 'Success',
      message: "Medical records fetched successfully",
      data: records
    });
  } catch (error) {
    console.error("Error fetching medical records:", error);
    res.status(500).json({ status: 'error', message: "Server error", error: error });
  }
}


async function deleteMedicalImagebyUserId(req, res) {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      return res.status(400).json({
        message: "_id and status are required"
      });
    }

    const updatedRecord = await MedicalImages.findByIdAndUpdate(
      _id,
      { status: status },
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(200).json({
        message: "Record not found"
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Status updated successfully",
      data: updatedRecord
    });

  } catch (error) {
    console.log("Error updating status:", error);
    res.status(500).json({
      message: "Internal server error",
      error
    });
  }
}








async function getDataByRole(req, res, next) {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Role is required'
      })
    }


    const data = await register.find({ role: role })

    res.status(200).json({
      status: 'Success',
      message: 'Successfully data get by the role',
      data: data || []
    })


  } catch (err) {
    console.error('Error at getDataByRole', err);
    return res.status(500).json({
      status: 'Failed',
      message: 'Internal server error',
      error: err
    })
  }
}







module.exports = {
  addUser, userLogin, updateUserDetails, uploadMedicalImages, getMedicalImagesByUserId, deleteMedicalImagebyUserId, getLoginUser,
  getDetailById,
  createCamp, getCampById, getAllCamps, addMember, getAttendeesById, filterByAddress, getDataByRole,

};


