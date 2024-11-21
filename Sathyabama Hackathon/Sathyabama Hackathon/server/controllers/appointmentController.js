const nodemailer = require('nodemailer');
const Appointment = require('../models/AppointmentModel');
const jwt = require('jsonwebtoken');
const Cart=require('../models/Doccart');

const bookAppointment = async (req, res) => {
  const { username, doctorName, doctorType, time, date, age, gender, bloodgroup, height, weight } = req.body;

  const email = req.user?.email;
  console.log('Email from request:', email); 


  if (!email) {
      return res.status(400).json({ message:'Email is required to book an appointment.' });
  }

  try {

      let userAppointments = await Appointment.findOne({ email });
      console.log('Found user appointments:', userAppointments);


      if (!userAppointments) {
          userAppointments = new Appointment({ email, appointments: [] });
          console.log('Creating new user appointments document:', userAppointments);
      }

      const newAppointment = {
          username,
          doctorName,
          doctorType,
          time,
          date,
          age,
          gender,
          bloodgroup,
          height,
          weight,
          status: 'pending',
      };

      const existingAppointment = userAppointments.appointments.find(app => 
          app.username === username && 
          app.doctorName === doctorName && 
          app.date === date && 
          app.time === time
      );

      if (existingAppointment) {
          return res.status(400).json({ message: 'This appointment already exists.' });
      }

      userAppointments.appointments.push(newAppointment);
      console.log('Pushing appointment:', newAppointment);

      await userAppointments.save();
      console.log('Saved user appointments:', userAppointments);

      res.status(200).json({ message: 'Appointment request sent successfully' });

  } catch (error) {
      console.error('Error processing appointment request:', error);
      if (error.code === 11000) {
          return res.status(400).json({ message: 'Duplicate appointment found.' });
      }
      res.status(500).json({ message: 'Error processing appointment request', error: error.message });
  }
};


const getAppointmentById = async (req, res) => {

  const email=req.user.email;

  if (!req.user.email || typeof req.user.email !== 'string') {
    return res.status(400).json({ message: 'Invalid email parameter' });
  }

  try {
    console.log('Querying appointments with Email:', req.user.email);

    const userAppointments = await Appointment.findOne({ email })

    console.log('Query result:', userAppointments);
    
    if (!userAppointments || userAppointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found for this email' });
    }

    const userAppointmentData = userAppointments.appointments.map((appointment) => ({
      username:appointment.username,
      doctorName: appointment.doctorName,
      doctorType: appointment.doctorType,
      time: appointment.time,
      date: appointment.date,
      
      status: appointment.status
    }));
   console.log(userAppointmentData)

    res.status(200).json({ appointments: userAppointmentData });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const getAppointmentsForDoctor = async (req, res) => {
    const { doctorName, doctorType } = req.params;

    try {
        const appointments = await Appointment.find(
            {
                appointments: {
                    $elemMatch: {
                        doctorName: doctorName,
                        doctorType: doctorType,
                    },
                },
            },
            { 'appointments.$': 1, email: 1 } 
        );

        res.status(200).json({ appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};


const updateAppointmentStatus = async (req, res) => { 
    try {
        const { status, doctorName } = req.body;
        const { username } = req.params;
        
        const appointmentDoc = await Appointment.findOne({
            "appointments.username": username,
            "appointments.doctorName": doctorName
        });

        if (!appointmentDoc) {
            return res.status(404).json({ message: 'Appointment not found or invalid username/doctorName' });
        }

        const appointment = appointmentDoc.appointments.find(app => app.username === username && app.doctorName === doctorName);
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found or invalid username/doctorName' });
        }

        if (status === 'declined') {
            appointmentDoc.appointments = appointmentDoc.appointments.filter(app => app.username !== username || app.doctorName !== doctorName);
            await appointmentDoc.save();
            return res.status(201).json({ message: 'Appointment declined and removed successfully' });
        }

        if (status === 'accepted') {
            appointment.status = status;
            await appointmentDoc.save();
            return res.status(200).json({ message: 'Appointment status updated to accepted successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid status. Only "accepted" or "declined" statuses are allowed.' });
        }

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid token signature. Please log in again.' });
        }
        console.error('Error updating appointment status:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = {bookAppointment,getAppointmentById,getAppointmentsForDoctor,updateAppointmentStatus};