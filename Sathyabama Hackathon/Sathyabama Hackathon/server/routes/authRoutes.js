const express = require('express');
const { verifyOtp } = require('../controllers/OtpController');
const { verifyLicense } = require('../controllers/AdminController.js');
const { registerUser, loginUser } = require('../controllers/authController');
const { AddDoc, LogDoc, searchDoctors } = require('../controllers/DocLog');
const userAuth = require("../middlewares/authMiddleware.js");
const { userData } = require('../controllers/userDataController.js');
const upload = require('../config/multerconfig.js');
const { AddPatient, DisPat } = require('../controllers/Doccart.js');
const {getPrescriptions,storePrescription}=require('../controllers/docPrescription.js');


const router=express.Router();

router.post('/register',upload.single('image'),registerUser);
router.get('/getdata',userAuth,userData);
router.post('/login',loginUser);
router.post('/loginDoc',LogDoc);
router.post('/RegDo',upload.single('image'),AddDoc);
router.post('/cartAdd',userAuth,AddPatient);
router.get('/showDoccart',userAuth,DisPat);
router.post('/superadmin/verify', verifyLicense);
router.post('/verifyOtp', verifyOtp);
router.post('/docprescription', upload.array('files'), storePrescription); 
router.post('/getDocprescriptions',getPrescriptions);
router.get('/searchDoctors',searchDoctors);
module.exports = router;
