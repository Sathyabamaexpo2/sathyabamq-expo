const Prescription = require("../models/prescriptionModel");
const fs = require("fs"); // For file system operations
const pdfParse = require("pdf-parse"); // For extracting text from PDFs
const { createWorker } = require("tesseract.js"); // For OCR
const Report = require("../models/ReportModel");
const ExtractedText = require('../models/ExtractedText');


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

const getReports = async (req, res) => {
    const { doctorName, patientName } = req.query;

    try {
        const reports = await Report.find({
            doctorName,
            patientName,
        });

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: "No reports found." });
        }

        const result = reports.map((report) => ({
            doctorName: report.doctorName,
            patientName: report.patientName,
            files: report.files.map((file) => ({
                filename: file.filename,
                extractedText: file.extractedText || "No text extracted",
            })),
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Error fetching reports", error: error.message });
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
        const lastVisitDate = combinedText.match(/Last Vist Date:(\d{2}-\d{2}-\d{4})/)?.[1] || "Not Available";

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
 

const storeReport = async (req, res) => {
    const { DoctorName, PatientName } = req.body;
    const uploadedFiles = Array.isArray(req.files) ? req.files : [req.files];

    console.log("Doctor Name:", DoctorName);
    console.log("Patient Name:", PatientName);
    console.log("Uploaded files:", uploadedFiles);

    try {
        let userReport = await Report.findOne({
            doctorName: DoctorName,
            patientName: PatientName,
        });

        if (!userReport) {
            userReport = new Report({
                doctorName: DoctorName,
                patientName: PatientName,
                files: [],
            });
        }

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file) => {
                userReport.files.push({
                    filename: file.filename,
                    path: file.path,
                });
            });
        }

        await userReport.save();

        let combinedText = "";

        for (const file of uploadedFiles) {
            const filePath = file.path.toLowerCase();

            try {
                let extractedText = "";

                if (filePath.endsWith(".pdf")) {
                    const fileBuffer = fs.readFileSync(filePath);
                    const pdfData = await pdfParse(fileBuffer);
                    extractedText = pdfData.text;
                } else if (filePath.endsWith(".png") || filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
                    extractedText = await performOCR(filePath);
                }

                combinedText += extractedText;

                const fileIndex = userReport.files.findIndex(
                    (f) => f.filename === file.filename
                );
                if (fileIndex !== -1) {
                    userReport.files[fileIndex].extractedText = extractedText;
                }

            } catch (error) {
                console.error(`Error processing file ${file.filename}:`, error);
            }
        }

        if (!combinedText) {
            return res.status(404).json({ message: "No extracted text found in the report." });
        }

        // Extract specific fields with cleaned text
        const date = combinedText.match(/Date:\s*([\d\-\/]+)/)?.[1] || "Not Available";
        const bloodSugarF = combinedText.match(/Blood Sugar\(F\):\s*([\d.]+)/)?.[1] || "Not Available";
        const bloodSugarPP = combinedText.match(/Blood Sugar\(PP\):\s*([\d.]+)/)?.[1] || "Not Available";
        const bloodUrea = combinedText.match(/Blood Urea:\s*([\d.]+)/)?.[1] || "Not Available";
        const serumCreatine = combinedText.match(/Serum Creatine:\s*([\d.]+)/)?.[1] || "Not Available";

        // Store extracted data in the ExtractedText model
        const extractedTextData = new ExtractedText({
            doctorName: DoctorName,
            patientName: PatientName,
            extractedText: combinedText,
            date,
            bloodSugarF,
            bloodSugarPP,
            bloodUrea,
            serumCreatine,
        });

        await extractedTextData.save(); // Save to ExtractedText model

        // Update userReport with matched data (optional, depending on your requirements)
        userReport.extractedText = {
            date,
            bloodSugarF,
            bloodSugarPP,
            bloodUrea,
            serumCreatine,
        };
        await userReport.save();

        res.status(200).json({
            message: "Report stored successfully with extracted data",
            date,
            bloodSugarF,
            bloodSugarPP,
            bloodUrea,
            serumCreatine,
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
};




module.exports = { storePrescription, getPrescriptions, getText,storeReport, getReports};