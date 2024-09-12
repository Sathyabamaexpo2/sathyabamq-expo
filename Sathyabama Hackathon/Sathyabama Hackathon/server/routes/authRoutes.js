const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const {AddDoc,LogDoc}=require('../controllers/DocLog')
const router = express.Router();
router.post('/register', registerUser);
router.post('/AddDoc',AddDoc);
router.post('/LogDoc',LogDoc);
router.post('/login', loginUser);
module.exports = router;
