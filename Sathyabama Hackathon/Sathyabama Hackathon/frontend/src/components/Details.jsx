import React, { useState, useEffect } from 'react';
import './Details.css';
import pat from '../assets/pat.png';
import { useLocation, useNavigate } from 'react-router-dom';
import back from '../assets/back.png';
import axios from 'axios';

const Details = () => {
    const [togglePrescription, setPrescription] = useState(false);
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState('');
    const location = useLocation();
    const { state } = location;
    const { Name, Age, ID, email } = state || {};
    const Navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);

    const HandleRedirection = () => {
        Navigate('/doctor');
    };

    const handlePopup = () => {
        setPrescription(!togglePrescription);
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setFileName('');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('files', file);

        try {
            await axios.post('http://localhost:5000/api/user/docprescription', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Corrected content type
                },
            });
            alert('Prescription uploaded successfully!');
            setFile(null);
            setFileName('');
            handlePopup();
        } catch (error) {
            alert('Error uploading prescription: ' + error.message);
        }
    };

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/user/getDocprescriptions", {
                    email: email
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Error fetching prescriptions:', error);
            }
        };
        fetchPrescriptions();
    }, [email]);


    const normalizePath = (filePath) => {
        return filePath ? filePath.replace(/\\/g, '/') : '';
      };
    

      const getDownloadUrl = (filename) => {
        return `http://localhost:5000/api/user/uploads/${normalizePath(filename)}`;
    };
    

    const handleDownload = (file) => {  
        const link = document.createElement('a');
        link.href = getDownloadUrl(file.filename);
        link.download = file.filename; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <>
            <div className="details-container">
                <nav className="navbar">
                    <h1 style={{ fontSize: "26px" }}>
                        <button className="back" onClick={HandleRedirection}>
                            <img src={back} alt="Back" width={20} height={20} />
                        </button>
                        MedX
                    </h1>
                </nav>
                <div className="left-container2">
                    <div className="Det-prof">
                        <img src={pat} alt="Profile" />
                    </div>
                    <div className="det-user">
                        <div className="det-column">
                            <p>Name: {Name}</p>
                            <p>Age: {Age}</p>
                            <p>Id: {ID}</p>
                            <p>DOB: 1/1/2004</p>
                            <p>Sex: Male</p>
                            <p>Height: 165 cm</p>
                        </div>
                        <div className="det-column">
                            <p>Weight: 75 kg</p>
                            <p>Hemoglobin: 10 g/dl</p>
                            <p>Sugar: 30 mmol/l</p>
                            <p>Blood Pressure: 100 mmHg</p>
                            <p>Address: 10, Lijo St, Sundarapuram, Coimbatore-4</p>
                        </div>
                    </div>
                </div>

                <div className="right-container2">
                    <div className="Treatment-det">
                        <div className="Tret">
                            <h2>Treatment</h2>
                            <p>Diagnosis: Fever</p>
                            <p>Treatment Duration: 2 days</p>
                            <p>Treatments Taken: Blood test, General Medication</p>
                            <p>Next Visit: None</p>
                        </div>
                        <div className="sep-div"></div>
                        <div className="Tabet">
                            <h2>Tablets</h2>
                            <p>Medicines: Paracetamol, Aspirin</p>
                            <p>Injections: Paracetamol</p>
                            <p>Admitted: 
                                <select>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </p>
                            <p>Surgery: 
                                <select>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </p>
                        </div>
                    </div>

                    <div className="btn-div">
                        <button className="button-31" id="view" onClick={handlePopup}>
                            View Prescription
                        </button>
                        <button className="button-31" id="remove">Remove</button>
                        <div className="Total-Payment">
                            <h2>Total: $100</h2>
                        </div>
                    </div>
                </div>

                {togglePrescription && (
                    <div className="popup-prescription">
                        <div className="content-pres">
                            <h2>Prescription:</h2>
                            <div className="fetched-files">
                                <h3>Uploaded Files:</h3>
                                {prescriptions.map((prescription, index) => (
                                    <div key={index}>
                                        {prescription.files.map((file, fileIndex) => (
                                            <div key={fileIndex}>
                                                <a onClick={() => handleDownload(file)} style={{ cursor: 'pointer', textDecoration: 'underline', color: "blueviolet" }}>
                                                    {file.filename} {/* This displays the original filename */}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="details-file-input-container">
                                <label htmlFor="prescription-upload" className="custom-file-upload">
                                    Upload prescription
                                </label>
                                <input
                                    id="prescription-upload"
                                    type="file"
                                    accept=".png,.jpeg,.jpg,.pdf"
                                    onChange={handleFileChange}
                                    style={{ display: "none" }}
                                    required
                                />
                                <button onClick={handleUpload} disabled={!file}>
                                    Upload File
                                </button>
                                <span>{fileName || "No file chosen"}</span>
                            </div>
                            <button className="button-31" id="pres-btn" onClick={handlePopup}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Details;
