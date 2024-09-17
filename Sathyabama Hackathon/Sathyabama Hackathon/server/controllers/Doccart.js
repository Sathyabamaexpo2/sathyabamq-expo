const Cartmodel = require('../models/Doccart.js');
const AddPatient = async (req, res) => {
    const { name, age, gender, bloodgroup, height, weight, email, password } = req.body;
    try {
        console.log(req.body);
        let Visit = 0;
        let ExUser = await Cartmodel.findOne({ email:req.user.email });
        console.log("ExUser", ExUser);
        if (!ExUser) {
            ExUser = new Cartmodel({
                email: req.user.email, 
                Patients: [{
                    name, age, gender, bloodgroup, height, weight, email, password,image, Visit
                }]
            });
        } else {
            const ExPat = ExUser.Patients.find(p => p.email === email);
            console.log(ExPat);
            if (ExPat) {
                ExPat.Visit += 1; 
            } else {
                ExUser.Patients.push({
                    name, age, gender, bloodgroup, height, weight, email, password,image,Visit
                }); 
            }
        }

        const savedCart = await ExUser.save(); 
        console.log("Saved Cart:", savedCart);
        res.status(200).json({
            Msg: "Successfully added or updated!",
            savedCart
        });
    } catch (err) {
        res.status(500).json({
            Msg: "Server Error",
            Error: err.message
        });
    }
};


const DisPat = async (req, res) => {
    try {
        const email = req.user.email;
        if (!email) {
            return res.status(400).json({ Msg: "User email is missing" });
        }

        const cart = await Cartmodel.findOne({ email: email }); 
        if (!cart) {
            return res.status(404).json({ Msg: "User does not exist or cart is empty" });
        }
        const patientsdata = cart.Patients.map(p => ({
            name: p.name,
            age: p.age,
            gender: p.gender,
            bloodgroup: p.bloodgroup,
            height: p.height,
            weight: p.weight,
            email: p.email,
            // Consider excluding sensitive data like password
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