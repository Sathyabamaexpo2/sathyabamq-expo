const express = require('express');
const { bookAppointment, getAppointmentsForDoctor, updateAppointmentStatus,getAppointmentById, deleteAppoinment} = require('../controllers/appointmentController');
const userAuth = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/bookAppointment', userAuth, bookAppointment);
router.get('/appointments',userAuth , getAppointmentById);
router.get('/appointments/:doctorName/:doctorType', getAppointmentsForDoctor);
router.delete('/delAppointment',deleteAppoinment);
router.patch('/appointments/:username',userAuth, updateAppointmentStatus);


module.exports = router;