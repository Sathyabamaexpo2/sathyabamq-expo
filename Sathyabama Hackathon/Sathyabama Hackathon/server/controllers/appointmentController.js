const nodemailer = require('nodemailer');
const Appointment = require('../models/AppointmentModel');

const bookAppointment = async (req, res) => {
  const { username, doctorName, doctorType, time, date ,age,gender,bloodgroup,height,weight} = req.body;
  const email = req.user?.email;

  console.log('Email:', email); 

  if (!email) {
    return res.status(400).json({ message: 'Email is required to book an appointment.' });
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
      app.username === username && app.doctorName === doctorName &&
      app.date === date && app.time === time
    );

    if (existingAppointment) {
      return res.status(400).json({ message: 'This appointment already exists.' });
    }

    userAppointments.appointments.push(newAppointment);
    console.log('Pushing appointment:', newAppointment);

    console.log('Before saving:', userAppointments);

    await userAppointments.save();
    console.log('Saved user appointments:', userAppointments);

    // Create the transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Set up the email options
    const mailOptions = {
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: 'Appointment Confirmation',
      text: `Hello ${username},\n\nYour appointment with Dr. ${doctorName} has been booked for ${date} at ${time}.\n\nThank you!`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Appointment request sent successfully' });

  } catch (error) {
    console.error('Error processing appointment request:', error);
    res.status(500).json({ message: 'Error processing appointment request', error: error.message });
  }
};

const getAppointmentById = async (req, res) => {

  const email=req.user.email

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
      const appointments = await Appointment.find({
          'appointments.doctorName': doctorName,
          'appointments.doctorType': doctorType,
      });

      res.status(200).json({ appointments });
  } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { username } = req.params;
  const { status } = req.body;

  try {
      const userAppointments = await Appointment.findOne({ 'appointments.username': username });
      
      if (!userAppointments) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      const appointment = userAppointments.appointments.find(app => app.username === username);
      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      appointment.status = status;
      await userAppointments.save();

      res.status(200).json({ message: 'Appointment status updated', userAppointments });
  } catch (error) {
      res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};


module.exports = { bookAppointment,getAppointmentById,getAppointmentsForDoctor,updateAppointmentStatus};