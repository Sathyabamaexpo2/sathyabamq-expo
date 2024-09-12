const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const {AddDoc,LogDoc}=require('../controllers/DocLog')
const router = express.Router();
<<<<<<< HEAD
const userAuth=require("../middlewares/authMiddleware.js")
const {userData} =require('../controllers/userDataController.js');
router.post('/register',registerUser);
router.get('/getdata',userAuth,userData);
router.post('/login',loginUser);

=======
router.post('/register', registerUser);
router.post('/AddDoc',AddDoc);
router.post('/LogDoc',LogDoc);
router.post('/login', loginUser);
>>>>>>> 71aa42fcf9e8afc632c7a15cdfca12f86ce255a2
module.exports = router;
