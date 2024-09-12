import React, { useState } from 'react';
import './Details.css';
import pat from '../assets/pat.png';
import { useNavigate } from 'react-router-dom';
import back from '../assets/back.png';

const Details = () => {
    const [togglePrescription, setPrescription] = useState(false);
    const Navigate=useNavigate();
    const HandleRedirection=()=>{
       Navigate('/doctor');
    }
    const handlePopup = () => {
        setPrescription(!togglePrescription);
    };

    return (
        <>
            <div className="details-container">
                <nav className="navbar">
                    <h1>
                        <button className="back" onClick={HandleRedirection}>
                            <img src={back} alt="Back" width={40} />
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
                    <p>Name: Lijo</p>
                    <p>Age: 20</p>
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
                            <h2>Treatment & Tablets</h2>
                            <h3>Diagnosis: Fever</h3>
                            <h3>Treatment Duration: 2 days</h3>
                            <h3>Treatments Taken: Blood test, General Medication</h3>
                            <h3>Next Visit: None</h3>
                        </div>
                        <div className="sep-div"></div>
                        <div className="Tabet">
                            <h3>Medicines: Paracetamol, Aspirin</h3>
                            <h3>Injections: Paracetamol</h3>
                            <h3>Admitted: 
                                <select>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </h3>
                            <h3>Surgery: 
                                <select>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </h3>
                        </div>
                    </div>
                    <div className="Total-Payment">
                            <h2>Total:$100</h2>
                        </div>
                    <div className="btn-div">
                    <button className="button-31" id="view" onClick={handlePopup}>
                        View Prescription
                    </button>
                    <button className="button-31">Remove</button>
                    </div>
                </div>

                {togglePrescription && (
                    <div className="popup-prescription">
                        <div className="content-pres">
                            <h2>Prescription:</h2>
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
