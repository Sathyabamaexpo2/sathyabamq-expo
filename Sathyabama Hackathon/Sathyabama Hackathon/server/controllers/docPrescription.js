const Prescription = require("../models/prescriptionModel");
const fs = require("fs"); // For file system operations
const pdfParse = require("pdf-parse"); // For extracting text from PDFs
const { createWorker } = require("tesseract.js"); // For OCR

/**
 * Perform OCR using Tesseract.js
 */
const performOCR = async (filePath) => {
    const worker = createWorker();
    try {
        await worker.load(); // Load the worker
        await worker.loadLanguage("eng"); // Load the language data
        await worker.initialize("eng"); // Initialize with the language

        const { data: { text } } = await worker.recognize(filePath); // Perform OCR
        return text; // Return extracted text
    } catch (error) {
        console.error("OCR Error:", error);
        throw error;
    } finally {
        await worker.terminate(); // Terminate worker to free resources
    }
};

/**
 * Store prescription details along with uploaded files.
 */
const storePrescription = async (req, res) => {
    const { DoctorName, PatientName } = req.body;
    const uploadedFiles = req.files || [req.files];

    console.log("Doctor Name:", DoctorName);
    console.log("Patient Name:", PatientName);
    console.log("Uploaded files:", uploadedFiles);

    try {
        // Find or create a prescription
        let userPrescription = await Prescription.findOne({
            doctorName: DoctorName,
            patientName: PatientName,
        });

        if (!userPrescription) {
            userPrescription = new Prescription({
                doctorName: DoctorName,
                patientName: PatientName,
                files: [],
            });
        }

        // Add uploaded files
        if (uploadedFiles && uploadedFiles.length > 0) {
            for (const file of uploadedFiles) {
                userPrescription.files.push({
                    filename: file.filename,
                    path: file.path,
                });
            }
        }

        await userPrescription.save();

        // Process uploaded files
        for (const file of uploadedFiles) {
            const filePath = file.path;

            // Extract text from PDFs
            if (filePath.endsWith(".pdf")) {
                const fileBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(fileBuffer);
                const extractedText = pdfData.text;

                const fileIndex = userPrescription.files.findIndex(
                    (f) => f.filename === file.filename
                );
                if (fileIndex !== -1) {
                    userPrescription.files[fileIndex].extractedText = extractedText;
                }
            }
            // Extract text from images using OCR
            else if (filePath.endsWith(".png") || filePath.endsWith(".jpg")) {
                try {
                    const extractedText = await performOCR(filePath);

                    const fileIndex = userPrescription.files.findIndex(
                        (f) => f.filename === file.filename
                    );
                    if (fileIndex !== -1) {
                        userPrescription.files[fileIndex].extractedText = extractedText;
                    }
                } catch (ocrError) {
                    console.error("Error during OCR:", ocrError);
                }
            }
        }

        // Save updated prescription
        await userPrescription.save();

        res.status(200).json({
            message: "Prescription added and text extracted successfully",
            prescription: userPrescription,
        });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};

/**
 * Get prescriptions for a specific doctor and patient.
 */
const getPrescriptions = async (req, res) => {
    const { doctorName, patientName } = req.query;

    try {
        const prescriptions = await Prescription.find({
            doctorName,
            patientName,
        });

        if (!prescriptions || prescriptions.length === 0) {
            return res.status(404).json({ message: "No prescriptions found." });
        }

        const result = prescriptions.map((prescription) => ({
            doctorName: prescription.doctorName,
            patientName: prescription.patientName,
            files: prescription.files.map((file) => ({
                filename: file.filename,
                extractedText: file.extractedText || "No text extracted",
            })),
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching prescriptions:", error);
        res.status(500).json({ message: "Error fetching prescriptions", error: error.message });
    }
};

/**
 * Get extracted text and analysis from prescriptions.
 */
const getText = async (req, res) => {
    const { patientName, doctorName } = req.query;

    try {
        const prescription = await Prescription.findOne({ patientName, doctorName });

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found." });
        }

        const combinedText = prescription.files
            .map((file) => file.extractedText || "")
            .join(" ");

        if (!combinedText) {
            return res.status(404).json({ message: "No extracted text found in the prescription." });
        }

        const tablets = combinedText.match(/TAB[\s\w.]+/g)?.join(", ") || "No tablets found";

        // Extract last visit date
        const lastVisitDate = combinedText.match(/Last Visit Date:(\d{2}-\d{2}-\d{4})/)?.[1] || "Not Available";

        // Check for keywords
        const monthlyOnce = combinedText.includes("MONTHLY ONCE") ? "Yes" : "No";
        const surgeryAdmitted = /admitted|surgery/i.test(combinedText) ? "Yes" : "No";

        res.status(200).json({
            tablets,
            lastVisitDate,
            monthlyOnce,
            surgeryAdmitted,
        });
    } catch (error) {
        console.error("Error fetching prescription:", error);
        res.status(500).json({ message: "Error fetching prescription.", error: error.message });
    }
};

module.exports = { storePrescription, getPrescriptions, getText };
