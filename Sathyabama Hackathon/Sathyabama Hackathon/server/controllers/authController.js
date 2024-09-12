const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { name, age, gender, bloodgroup, height, weight, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, age, gender, bloodgroup, height, weight, email, password: hashedPassword,
    });
    
    await newUser.save();
    res.status(201).json({ success: true, message: "Account created successfully" });    
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: user.email}, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error); 
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { registerUser, loginUser };