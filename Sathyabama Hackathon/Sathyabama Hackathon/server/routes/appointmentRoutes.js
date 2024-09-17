const express = require('express');
const { bookAppointment, getAppointmentsForDoctor, updateAppointmentStatus,getAppointmentById} = require('../controllers/appointmentController');
const userAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/bookAppointment', userAuth, bookAppointment);
router.get('/appointments',userAuth , getAppointmentById);


module.exports = router;