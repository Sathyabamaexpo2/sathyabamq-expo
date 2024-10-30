const Prescription = require("../models/prescriptionModel");
const storePrescription = async (req, res) => {
    const { DoctorName, PatientName } = req.body; 
    const uploadedFiles = req.files || [req.files]; 
    console.log('Doctor Name:', DoctorName);
    console.log('Patient Name:', PatientName);
    console.log('Uploaded files:', uploadedFiles); 

    try {
        let userPrescription = await Prescription.findOne({ doctorName: DoctorName, patientName: PatientName });
        if (!userPrescription) {
            userPrescription = new Prescription({ doctorName: DoctorName, patientName: PatientName, files: [] });
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
    const { doctorName, patientName } = req.query;

    try {
        const prescriptions = await Prescription.find({
            doctorName: doctorName,
            patientName: patientName
        });

        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = { getPrescriptions, storePrescription };
