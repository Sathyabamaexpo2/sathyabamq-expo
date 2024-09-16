const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  bloodgroup: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:{filename:String,path:String}
});

module.exports = mongoose.model('User', userSchema);
