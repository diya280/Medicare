const authMiddleware = require('../controller/accessCode'); 
const express = require("express");
const router = express.Router();
const { userUploads } = require('../multer/multer'); 





// ==================== PAYMENT FLOW AREA   =================

const payment_route = express();

const bodyParser = require('body-parser');
payment_route.use(bodyParser.json());
payment_route.use(bodyParser.urlencoded({extended:false}));

const path = require('path');
payment_route.set('view engine', 'ejs');
payment_route.set('views', path.join(__dirname, '../v'));





// =====================================================

const { createOrder, verifyPayment } = require('../controller/payment.js')




const { addUser, userLogin, getLoginUser,updateUserDetails, getDetailById,
    uploadMedicalImages, getMedicalImagesByUserId, deleteMedicalImagebyUserId,
     getDataByRole,       } = require('../controller/register');   
     
     //// createCamp, getCampById, getAllCamps, addMember, getAttendeesById, filterByAddress


     
const { addMedicine,getMedicineDataByUserId, updateMedicineStock,fetchMedicals, getMedicalByCity,
    getAllMedical, getAllUsers, getMedicalImagesByIdArray, getAllMedicineDataByCity,
 } = require('../controller/medicine.js');
const { addFeedbackForUser, getAllFeedbacks, getFeedbackByUserId, getFeedbackByMedicineId,
     updateStatusByAdmin, getFeedbackByMedicalId } = require('../controller/feedback.js');

const { addCartDetails, getCartDetailsById, updateCartStatus, updateCartWithPayment} = require('../controller/cart.js')





const {  addAccountDetails, getAccountDetailsByUserId  } = require('../controller/accountDetails.js')












router.post('/add/user', userUploads.none(), addUser);
router.post('/updateuserdetails', updateUserDetails);
router.post('/login/user', userLogin);
router.get('/get/login/user', authMiddleware, getLoginUser);  


router.post('/addmedicinedetails', userUploads.none(), addMedicine);
router.post('/getMedicineDataByUserId', getMedicineDataByUserId);
router.post('/updatemedicinestockdetails', updateMedicineStock);


router.post('/uploadmedicalimages', userUploads.none(), uploadMedicalImages);
router.post('/getmedicalimagebyuserId', userUploads.none(), getMedicalImagesByUserId);
router.post('/deletemedicalimagebyuserid', deleteMedicalImagebyUserId )


router.post('/fetchmedicaldetails', fetchMedicals);

//-----------------------------------------------------------

router.post('/addfeedbackforuser', addFeedbackForUser);
router.get('/getallfeedback', getAllFeedbacks);
router.post('/fetchfeedbackviauserid', getFeedbackByUserId);
router.post('/getFeedbackByMedicineId', getFeedbackByMedicineId);


router.post('/getmedicalbycity', getMedicalByCity);
router.get('/getallmedicallist', getAllMedical);
router.get('/getalluserlist', getAllUsers);
router.post('/getmedicalimagesbyidarray', getMedicalImagesByIdArray);


router.post('/getallmedicinedatabycity', getAllMedicineDataByCity);
router.post('/getdetailsbyuserid', getDetailById);



router.post('/addcartdetails', addCartDetails);
router.post('/getcartdetailsbyid',getCartDetailsById );
router.post('/updateCartStatus', updateCartStatus);
router.post('/updateCartWithPayment', updateCartWithPayment);



router.post('/getDataByRole', getDataByRole)


router.post('/updateStatusByAdmin', updateStatusByAdmin);
router.post('/getFeedbackByMedicalId', getFeedbackByMedicalId)


// -------------------------------------

router.post('/addAccountDetails', addAccountDetails);
router.post('/getAccountDetailsByUserId', getAccountDetailsByUserId)






router.post('/createOrder', createOrder);
router.post('/verifyPayment', verifyPayment);





// router.post('/create/camp', authMiddleware, createCamp);
// router.get('/get/camp/id', authMiddleware, getCampById);
// router.get('/get/camp', authMiddleware, getAllCamps);  
// router.post('/add/members', addMember);
// router.get('/get/attendees', getAttendeesById);
// router.get('/get/filterKeywords', filterByAddress);



module.exports = router;
