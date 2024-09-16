// const Doc = require('../models/DocModel.js');
const nodemailer = require('nodemailer');

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};


let otpStore = {}; 

const verifyLicense = async (req, res) => {
  const {Lic_No,email,name} = req.body;

  try { 
    // const doctor = await Doc.findOne({ Lic_No });
    // if (!doctor) {
    //   return res.status(404).json({ message: "License number not found" });
    // }

    if(!Lic_No){
        return res.status(404).json({ message: "License number not valid" });
    }


    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = otp;


    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: process.env.EMAIL_ADMIN,  
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: 'Your OTP for License Verification',
      text: `Hello ${name},\n\nYour OTP for verification is: ${otp}\n\nThank you!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email sent to super admin", email: email });
  } catch (error) {
    console.error("License Verification Error:", error);
    res.status(500).json({ message: "Error verifying license", error: error.message });
  }
};

module.exports = { verifyLicense,otpStore};
