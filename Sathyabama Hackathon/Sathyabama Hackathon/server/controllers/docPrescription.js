const Prescription = require("../models/prescriptionModel");
const fs = require('fs'); // For file system operations
const pdfParse = require('pdf-parse'); // For extracting text from PDFs
const { createWorker } = require('tesseract.js'); // For OCR

/**
 * Store prescription details along with uploaded files.
 */
const storePrescription = async (req, res) => {
    const { DoctorName, PatientName } = req.body;
    const uploadedFiles = req.files || [req.files];

    console.log('Doctor Name:', DoctorName);
    console.log('Patient Name:', PatientName);
    console.log('Uploaded files:', uploadedFiles);

    try {
        // Find existing prescription for the doctor and patient
        let userPrescription = await Prescription.findOne({
            doctorName: DoctorName,
            patientName: PatientName,
        });

        // If no prescription exists, create a new one
        if (!userPrescription) {
            userPrescription = new Prescription({
                doctorName: DoctorName,
                patientName: PatientName,
                files: [],
            });
        }

        // Add uploaded files to the prescription
        if (uploadedFiles && uploadedFiles.length > 0) {
            for (const file of uploadedFiles) {
                userPrescription.files.push({
                    filename: file.filename,
                    path: file.path,
                });
            }
        }

        // Save the prescription to the database
        await userPrescription.save();

        // Try extracting text from the uploaded files
        if (uploadedFiles && uploadedFiles.length > 0) {
            for (const file of uploadedFiles) {
                const filePath = file.path;
                
                // Extract text from PDFs if the file is a PDF
                if (filePath.endsWith('.pdf')) {
                    const fileBuffer = fs.readFileSync(filePath);
                    const pdfData = await pdfParse(fileBuffer);
                    const extractedText = pdfData.text;
                    
                    // Save the extracted text into the file metadata in the database
                    const fileIndex = userPrescription.files.findIndex(f => f.filename === file.filename);
                    if (fileIndex !== -1) {
                        userPrescription.files[fileIndex].extractedText = extractedText;
                    }
                }
                // If the file is an image, use Tesseract for OCR
                else if (filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
                    try {
                        const { data: { text } } = await tesseract.recognize(filePath, 'eng');
                        const extractedText = text;
                        
                        // Save the extracted text into the file metadata in the database
                        const fileIndex = userPrescription.files.findIndex(f => f.filename === file.filename);
                        if (fileIndex !== -1) {
                            userPrescription.files[fileIndex].extractedText = extractedText;
                        }
                    } catch (ocrError) {
                        console.error('Error during OCR:', ocrError);
                    }
                }
            }
        }

        // Save the updated prescription with extracted text
        await userPrescription.save();

        res.status(200).json({
            message: 'Prescription added and text extracted successfully',
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
        // Fetch prescriptions matching doctorName and patientName
        const prescriptions = await Prescription.find({
            doctorName,
            patientName,
        });

        // Process each prescription and extract text dynamically if necessary
        const result = await Promise.all(
            prescriptions.map(async (prescription) => {
                const filesWithExtractedText = await Promise.all(
                    prescription.files.map(async (file) => {
                        const filePath = file.path;
                        let extractedText = file.extractedText;

                        // Check if extracted text already exists in the database
                        if (!extractedText || extractedText === '') {
                            // If no text in the DB, process the file
                            if (!fs.existsSync(filePath)) {
                                console.error(`File not found: ${filePath}`);
                                extractedText = 'File not found';
                            } else {
                                try {
                                    // If it's a PDF, extract text
                                    if (filePath.endsWith('.pdf')) {
                                        const fileBuffer = fs.readFileSync(filePath);
                                        const pdfData = await pdfParse(fileBuffer);
                                        extractedText = pdfData.text;
                                    }

                                    // If text was extracted, update the file with the new extracted text in the database
                                    if (extractedText && extractedText !== '') {
                                        file.extractedText = extractedText;
                                        await prescription.save(); // Save the updated prescription with new text
                                    }
                                } catch (error) {
                                    console.error(`Error extracting text for file ${file.filename}`, error);
                                    extractedText = 'Error parsing file';
                                }
                            }
                        }

                        return {
                            filename: file.filename,
                            extractedText: extractedText,
                        };
                    })
                );

                return {
                    doctorName: prescription.doctorName,
                    patientName: prescription.patientName,
                    files: filesWithExtractedText,
                };
            })
        );

        // Respond with the results
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
    }
};

const getText = async (req, res) => {
    const { patientName, doctorName } = req.query;

    try {
        // Fetch the first prescription for the patient and doctor
        const prescription = await Prescription.findOne({ patientName, doctorName })
            .sort({ createdAt: 1 })
            .exec();

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found.' });
        }

        // Combine all extracted text into a single string
        let combinedText = prescription.files
            .map(file => file.extractedText.replace(/\n/g, ' ').trim()) // Replace newlines and trim
            .join(' ');

        console.log("Combined Text:", combinedText); // Log combined text for debugging

        // Extract tablets: Match "TAB" followed by any text until encountering a number or end of phrase
        const tabletsText = prescription.files
            .map(file => file.extractedText)
            .join(' ') // Combine extracted text from multiple files
            .match(/TAB[\s\w\.]+/g) // Match words starting with "TAB" followed by alphanumeric characters and spaces
            .join(', ') || ''; // Join the tablets with commas

        if (!tabletsText) {
            return res.status(404).json({ message: 'No tablets found in the prescription text.' });
        }


        // Extract last visit date
        const lastVisitDate = combinedText.match(/Last Vist Date:(\d{2}-\d{2}-\d{4})/);

        // Check for "MONTHLY ONCE" in the prescription text
        const monthlyOnce = combinedText.match(/MONTHLY ONCE/i) ? 'Yes' : 'No';

        // Check for "surgery" or "admitted" in the prescription text
        const surgeryAdmitted = combinedText.match(/admitted|surgery/i) ? 'Yes' : 'No';

        // Send the response
        res.status(200).json({
            tablets: tabletsText,
            lastVisitDate: lastVisitDate ? lastVisitDate[1] : 'Not Available',
            monthlyOnce,
            surgeryAdmitted,
        });
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ message: 'Error fetching prescription.' });
    }
};




module.exports = { getPrescriptions, storePrescription,getText};


