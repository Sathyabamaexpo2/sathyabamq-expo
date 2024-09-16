import React, { useState } from 'react';
import './Details.css';
import pat from '../assets/pat.png';
import { useLocation, useNavigate } from 'react-router-dom';
import back from '../assets/back.png';

const Details = () => {
    const [togglePrescription, setPrescription] = useState(false);
    const location=useLocation();
    const {state}=location;
    const {Name,Age,ID}=state||{};
    console.log(Name)
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
                    <h1 style={{fontSize:"26px"}}>
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
                    <p>Name:{Name}</p>
                    <p>Age: {Age}</p>
                    <p>Id:{ID}</p>
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
                                </select></p>
                            <p>Surgery: 
                                <select>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select></p>
                        </div>
                    </div>

                    <div className="btn-div">
                    <button className="button-31" id="view" onClick={handlePopup}>
                        View Prescription
                    </button>
                    <button className="button-31" id="remove">Remove</button>
                    <div className="Total-Payment">
                            <h2>Total:$100</h2>
                        </div>
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
