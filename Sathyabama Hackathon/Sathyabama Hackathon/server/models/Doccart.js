const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    email: { type: String, required: true },
    visitCount: { type: Number, default: 1 } // Added visitCount with a default of 1
});

const cartSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, sparse: true },
    patients: { type: [PatientSchema], default: [] }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
