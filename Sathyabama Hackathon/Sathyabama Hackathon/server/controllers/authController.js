const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET_KEY = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const { name, age, gender, bloodgroup, height, weight, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success:false,message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({success:false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? { filename: req.file.filename, path: req.file.path } : {};
    const newUser = new User({
      name, age, gender, bloodgroup, height, weight, email, password: hashedPassword,image:profileImage
    });
    console.log(newUser.image)
    await newUser.save();
    res.status(201).json({ success: true, message: "Account created successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success:false,message: "Something went wrong", error: error.message });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ success: true, token,user});
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { registerUser, loginUser };