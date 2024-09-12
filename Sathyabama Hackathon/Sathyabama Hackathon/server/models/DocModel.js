const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   age:{
    type:Number,
    required:true,
   },
   Lic_No:{
    type:String,
    required:true,
   },
   Hospital_Name:{
    type:String,
    required:true,
   },
   Specialized:{
    type:String,
    required:true,
   },
   email:{
     type:String,
     required:true,
   },
   password: {
    type: String,
    required: true,
    // maxlength: 10,
  },
  image:{
    filename:String,
    path:String,
}
});

module.exports = mongoose.model('Doc', DocSchema);