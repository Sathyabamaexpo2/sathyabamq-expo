const express = require('express');
const { bookAppointment, getAppointmentsForDoctor, updateAppointmentStatus,getAppointmentById} = require('../controllers/appointmentController');
const userAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/bookAppointment', userAuth, bookAppointment);
router.get('/appointments',userAuth , getAppointmentById);
router.get('/appointments/:doctorName/:doctorType', getAppointmentsForDoctor);
router.patch('/appointments/:username',userAuth, updateAppointmentStatus);


module.exports = router;