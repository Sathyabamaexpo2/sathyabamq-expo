const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doc = require('../models/DocModel.js');
const AddDoc = async (req, res) => {
  const { name, age, Lic_No, Hospital_Name, Specialized, email, password, confirmPassword } = req.body;
  console.log("Request Body:", req.body);
  console.log("File Received:", req.file);
  try {
    const existingUser = await Doc.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? { filename: req.file.filename, path: req.file.path } : {};

    const newUser = new Doc({
      name,
      age,
      Lic_No,
      Hospital_Name,
      Specialized,
      email,
      password: hashedPassword,
      image: profileImage,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Account created successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const LogDoc = async (req, res) => {
    const { email, password } = req.body;
    console.log("Request Body:", req.body);
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      const user = await Doc.findOne({ email });
      if (!user) return res.status(400).json({ message: "User does not exist" });
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({ success: true, token, user });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  


const searchDoctors = async (req, res) => {
  const { query } = req.query; 

  try {
    if (!query) {
      return res.status(400).json({ message: "No search query provided" });
    }

    const doctors = await Doc.find({
      $or: [
        { name: new RegExp(query, 'i') },
        { Hospital_Name: new RegExp(query, 'i') },
        { Specialized: new RegExp(query, 'i') }
      ]
    });

    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


module.exports = { AddDoc, LogDoc,searchDoctors};
