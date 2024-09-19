const Cartmodel = require('../models/Doccart.js');
const AddPatient = async (req, res) => {
    const { name, age, gender, bloodgroup, height, weight, email, password} = req.body;

    try {
        console.log(req.body);
        let visitCount = 0; 
        let exUser = await Cartmodel.findOne({ email: req.user.email });
        console.log("Existing User:", exUser);
        if (!exUser) {
            const profileImage = req.file ? { filename: req.file.filename, path: req.file.path } : {};
            exUser = new Cartmodel({
                email: req.user.email,
                patients: [{ name, age, gender, bloodgroup, height, weight, email, password,image:profileImage,visitCount }]
            });
        } else {
            const exPatient = exUser.patients.find(p => p.email === email);
            console.log("Existing Patient:", exPatient);
            if (exPatient) {
                exPatient.visitCount += 1; 
            } else {
                exUser.patients.push({
                    name, age, gender, bloodgroup, height, weight, email, password,image:profileImage,visitCount
                });
            }
        }

        const savedCart = await exUser.save();
        console.log("Saved Cart:", savedCart);
        res.status(200).json({
            msg: "Successfully added or updated!",
            savedCart
        });
    } catch (err) {
        console.error("Error in AddPatient:", err);
        res.status(500).json({
            msg: "Server Error",
            error: err.message
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
        if (!cart.Patients || !Array.isArray(cart.Patients)) {
            return res.status(404).json({ Msg: "No patients found" });
        }

        const patientsdata = cart.Patients.map(p => ({
            name: p.name, 
            age: p.age,
            gender: p.gender,
            bloodgroup: p.bloodgroup,
            height: p.height,
            weight: p.weight,
            email: p.email,
            password: p.password
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