const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Doc = require('../models/DocModel.js');
// const multer = require('multer');
// const path = require('path');
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });
// const upload = multer({ storage: storage });
const AddDoc = async (req, res) => {
  const { name, age, Lic_No, Hospital_Name, Specialized, email, password, confirmPassword } = req.body;
  try {
    const existingUser = await Doc.findOne({ email });
    console.log(existingUser);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    // if (password.length >=10) {
    //   return res.status(400).json({ message: "Password exceeds max length of 10 characters!" });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileImage = req.file ? { filename: req.file.filename, path: req.file.path } : {};

    const newUser = new Doc({
      "name":name,
      "age":age,
      "Lic_No":Lic_No,
      "Hospital_Name":Hospital_Name,
      "Specialized":Specialized,
      "email":email,
      "password": hashedPassword,
    //   image: profileImage,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ success: true, message: "Account created successfully" });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const LogDoc = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Doc.findOne({ email });
    if (!user) return res.status(400).json({ message: "User doesn't exist" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: Doc.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, token, user });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = {AddDoc, LogDoc };
