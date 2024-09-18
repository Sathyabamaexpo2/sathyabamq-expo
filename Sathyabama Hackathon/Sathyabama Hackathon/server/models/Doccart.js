const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    email: { type: String, required: true }, // Not unique here
    password: { type: String, required: true },
    // image: { filename: String, path: String }
});

const CartModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    patients: [PatientSchema] 
});

const Cart = mongoose.model("Cart", CartModel);
module.exports = Cart;
