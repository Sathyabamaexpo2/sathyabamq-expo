const Cart = require('../models/Doccart.js');
const bcrypt = require('bcrypt');

const AddPatient = async (req, res) => {
    const { name, age, gender, bloodgroup, height, weight, email, image } = req.body;


    if (!name || !age || !gender || !bloodgroup || !height || !weight || !email || !image) {
        return res.status(400).json({ msg: "All fields, including image, are required." });
    }

    try {

        let exUser = await Cart.findOne({ email: req.user.email });

        if (!exUser) {
 
            exUser = new Cart({
                email: req.user.email,
                patients: [
                    {
                        name,
                        age,
                        gender,
                        bloodgroup,
                        height,
                        weight,
                        email,
                        visitCount: 1,
                        image,
                    },
                ],
            });
        } else {
    
            const exPatient = exUser.patients.find((p) => p.email === email);

            if (exPatient) {
         
                exPatient.visitCount += 1;
            } else {
      
                exUser.patients.push({
                    name,
                    age,
                    gender,
                    bloodgroup,
                    height,
                    weight,
                    email,
                    visitCount: 1,
                    image, 
                });
            }
        }

        const savedCart = await exUser.save();
        res.status(200).json({
            msg: "Successfully added or updated!",
            savedCart,
        });
    } catch (err) {
        console.error("Error in AddPatient:", err);
        res.status(500).json({
            msg: "Server Error",
            error: err.message,
        });
    }
};


const DisPat = async (req, res) => {
    try {
        const email = req.user.email; 
        if (!email) {
            return res.status(400).json({ Msg: "User email is missing" });
        }

        const cart = await Cart.findOne({ email: email });
        if (!cart) {
            return res.status(404).json({ Msg: "User does not exist or cart is empty" });
        }
        if (!cart.patients || !Array.isArray(cart.patients)) {
            return res.status(404).json({ Msg: "No patients found" });
        }

        const patientsdata = cart.patients.map(p => ({
            name: p.name, 
            age: p.age,
            gender: p.gender,
            bloodgroup: p.bloodgroup,
            height: p.height,
            weight: p.weight,
            email: p.email,
            visitCount: p.visitCount,
            image:p.image
        }));

        return res.status(200).json({
            Msg: "Patients data retrieved successfully",
            patientsdata
        });

    } catch (err) {
        return res.status(500).json({
            Msg: "Server Error",
            Error: err.message
        });
    }
};



module.exports={AddPatient,DisPat}