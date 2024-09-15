const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const {AddDoc,LogDoc}=require('../controllers/DocLog')
const router = express.Router();
const userAuth=require("../middlewares/authMiddleware.js")
const {userData} =require('../controllers/userDataController.js');
const upload = require('../config/multerconfig.js');
router.post('/register',registerUser);
router.get('/getdata',userAuth,userData);
router.post('/login',loginUser);
router.post('/loginDoc',LogDoc);
router.post('/RegDo',upload.single('image'),AddDoc);
module.exports = router;
