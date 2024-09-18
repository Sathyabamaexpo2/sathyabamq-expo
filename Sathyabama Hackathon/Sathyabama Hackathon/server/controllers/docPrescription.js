const Prescription = require("../models/prescriptionModel");
const storePrescription = async (req, res) => {
    const { email } = req.body;
    const uploadedFiles = req.files || [req.files]; 
    console.log('Email:', email);
    console.log('Uploaded files:', uploadedFiles); 

    try {
        let userPrescription = await Prescription.findOne({ email });
        if (!userPrescription) {
            userPrescription = new Prescription({ email, files: [] });
        }

        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach(file => {
                userPrescription.files.push({
                    filename: file.filename, 
                    path: file.path, 
                });
            });
        }

        await userPrescription.save();

        res.status(200).json({
            message: 'Prescription added successfully',
            prescription: userPrescription,
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
};


const getPrescriptions = async (req, res) => {
    const { email } = req.body;

    try {
        const prescriptions = await Prescription.find({ email });
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPrescriptions, storePrescription };
