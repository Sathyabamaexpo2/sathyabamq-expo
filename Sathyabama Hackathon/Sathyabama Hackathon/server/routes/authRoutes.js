const express = require('express');
const { verifyOtp } = require('../controllers/OtpController');
const { verifyLicense } = require('../controllers/AdminController.js');
const { registerUser, loginUser } = require('../controllers/authController');
const { AddDoc, LogDoc, searchDoctors } = require('../controllers/DocLog');
const userAuth = require("../middlewares/authMiddleware.js");
const { userData } = require('../controllers/userDataController.js');
const upload = require('../config/multerconfig.js');

const router = express.Router();

router.post('/register', upload.single('image'), registerUser);
router.get('/getdata', userAuth, userData);
router.post('/login', loginUser);
router.post('/loginDoc', LogDoc);
router.post('/RegDo', upload.single('image'), AddDoc);
router.post('/superadmin/verify', verifyLicense);
router.post('/verifyOtp', verifyOtp);
router.get('/searchDoctors', searchDoctors);


module.exports = router;
