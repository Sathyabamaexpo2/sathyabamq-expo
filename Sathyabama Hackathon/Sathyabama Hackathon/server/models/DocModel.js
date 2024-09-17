const mongoose = require('mongoose');

const DocSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
    index: true // Index this field for faster search
   },
   age: {
    type: Number,
    required: true,
   },
   Lic_No: {
    type: String,
    required: true,
   },
   Hospital_Name: {
    type: String,
    required: true,
    index: true // Index this field
   },
   Specialized: {
    type: String,
    required: true,
    index: true // Index this field
   },
   email: {
     type: String,
     required: true,
     index: true // Index this field
   },
   password: {
    type: String,
    required: true,
   },
   image: {
    filename: String,
    path: String,
   }
});

module.exports = mongoose.model('Doc', DocSchema);
