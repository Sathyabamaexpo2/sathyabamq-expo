import React, { useState, useEffect } from "react";
import "./Details.css";
import pat from "../assets/pat.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import power from "../assets/power-button.png";

const Details = () => {
  const [togglePrescription, setPrescription] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState("");
  const location = useLocation();
  const { name, cart, userData, doctorName } = location.state || {};

  const [extractedText, setextractedText] = useState({});

  const navigate = useNavigate();

  const isFromUserPage = Boolean(userData);
  const isFromDocPage = Boolean(cart);

  console.log("User Data:", userData);
  console.log("Appointment Data:", cart);

  const image = "";

  const imageUrl = image
    ? `http://localhost:5000/api/user/${normalizePath(image)}`
    : "";

  const displayName = isFromUserPage ? userData.name : cart.name || "N/A";
  const displayAge = isFromUserPage ? userData.age : cart.age || "N/A";
  const displayEmail = isFromUserPage ? userData.email : cart.email || "N/A";
  const displayGender = isFromUserPage ? userData.gender : cart.gender || "N/A";
  const displayHeight = isFromUserPage ? userData.height : cart.height || "N/A";
  const displayWeight = isFromUserPage ? userData.weight : cart.weight || "N/A";
  const displayBloodGroup = isFromUserPage
    ? userData.bloodgroup
    : cart.bloodgroup || "N/A";
  const displayDoctorName = doctorName || name || "N/A";

  const Navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);

  const HandleRedirection = () => {
    Navigate("/doctor");
  };

  const handlePopup = () => {
    setPrescription(!togglePrescription);
    fetchPrescriptions();
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFileName("");
    }
  };

  console.log(displayEmail);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("DoctorName", displayDoctorName);
    formData.append("PatientName", displayName);
    formData.append("files", file);

    try {
      await axios.post(
        "http://localhost:5000/api/user/docprescription",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Prescription uploaded successfully!");
      setFile(null);
      setFileName("");
      handlePopup();

      // Trigger functions after upload
      fetchPrescriptions(); // Extract text from the uploaded prescription
    } catch (error) {
      alert("Error uploading prescription: " + error.message);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user/getDocprescriptions",
        {
          params: {
            doctorName: displayDoctorName,
            patientName: displayName,
          },
        }
      );
      setPrescriptions(response.data);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
    }
  };

  useEffect(() => {
    const fetchExtractedText = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/get-Text",
          {
            params: {
              doctorName: displayDoctorName,
              patientName: displayName,
            },
          }
        );

        console.log("API Response:", response.data);

        const rawText = response.data.tablets || "";

        // Split the text by "TAB", "TAB.", or "TAB " to isolate tablet names
        const tabletNames = rawText
          .split(/TAB[\.\s]/i) // Split by "TAB", "TAB.", or "TAB "
          .map((text) => text.trim()) // Trim any leading/trailing spaces
          .filter(
            (text) =>
              text.length > 0 && // Remove empty strings
              /^[A-Za-z0-9\s\-]+$/.test(text) // Ensure it's valid tablet name
          )
          .join(", ");

        // Define patterns for unwanted terms: Generic age, sex, frequency, etc.
        const unwantedPatterns = [
          /\b\d{2}Yrs\b/i, // Matches ages like 50Yrs, 40Yrs
          /\bSex\b/i, // Matches "Sex"
          /\bMONTHLY ONCE\b/i, // Matches "MONTHLY ONCE"
          /GIT606U/i, // Matches specific terms like "GIT606U"
          /[A-Za-z0-9]{4,}\s\d+\s\d+/i, // Matches numbers that are not valid tablet names (e.g., dosage instructions)
        ];

        // Remove unwanted words using the above patterns
        const cleanedTabletNames = tabletNames
          .split(",")
          .map((name) => name.trim()) // Remove extra spaces
          .filter((name) => {
            // Exclude names that match any unwanted pattern
            return !unwantedPatterns.some((pattern) => pattern.test(name));
          })
          .join(", ");

        // Set the cleaned tablet names
        setextractedText({
          ...response.data,
          tablets: cleanedTabletNames || "No medicines prescribed", // Fallback if empty
        });
      } catch (error) {
        console.error("Error extracting text:", error);
      }
    };

    fetchExtractedText();
  }, []);

  const normalizePath = (filePath) => {
    return filePath ? filePath.replace(/\\/g, "/") : "";
  };

  const getDownloadUrl = (filename) => {
    return `http://localhost:5000/api/user/uploads/${normalizePath(filename)}`;
  };

  const handleDownload = (file) => {
    const link = document.createElement("a");
    link.href = getDownloadUrl(file.filename);
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log(extractedText);

  return (
    <>
      <div className="details-container">
        <div className="header-div">
          <header>
            <nav>
              <div className="doc-nav-Lcont">
                <div className="doc-title">
                  <h2>MedX</h2>
                </div>
                <div className="doc-nav-Rcont">
                  <button
                    id="doc-prof-btn"
                    onClick={() => setToggleProfile((prev) => !prev)}
                  >
                    <img
                      src={imageUrl}
                      alt="Profile"
                      width={60}
                      height={60}
                      className="profile-img"
                    />
                  </button>

                  <div className="logout-btn-div">
                    <img src={power} alt="Logout" width={40} height={40} />
                    <button
                      className="button-31"
                      id="lout"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </div>
        <div className="left-container2">
          <div className="Det-prof">
            <img src={pat} alt="Profile" />
          </div>
          <div className="det-user">
            <div className="det-column">
              <p>Name: {displayName}</p>
              <p>Age: {displayAge}</p>
              <p>Sex: {displayGender}</p>
            </div>
            <div className="det-column">
              <p>Blood-Group:{displayBloodGroup}</p>
              <p>Height:{displayHeight}</p>
              <p>Weight: {displayWeight}</p>
              {/* <p>Hemoglobin: 10 g/dl</p>
                            <p>Sugar: 30 mmol/l</p>
                            <p>Blood Pressure: 100 mmHg</p>
                            <p>Address: 10, Lijo St, Sundarapuram, Coimbatore-4</p> */}
            </div>
          </div>
        </div>

        <div className="right-container2">
          <div className="Treatment-det">
            <div className="Tret">
              <h2>Treatment</h2>
              {/* <p>Diagnosis:{extractedText.diagnosis || "Fever"}</p> */}
              <p>Last-Visit-Date:{extractedText.lastVisitDate || "N/A"}</p>
              <p>Next Visit:{extractedText.monthlyOnce ? "Next week" : "No"}</p>
            </div>
            <div className="sep-div"></div>
            <div className="Tabet">
              <h2>Tablets</h2>
              <p>
                Medicines: {extractedText.tablets || "No medicines prescribed"}
              </p>
              <p>
                Admitted:
                <select
                  value={extractedText.surgeryAdmitted === "Yes" ? "Yes" : "No"}
                >
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
          </div>
        </div>

        {togglePrescription && (
          <div className="popup-prescription">
            <div className="content-pres">
              <div className="fetched-files">
                <h3>Previous Prescriptions:</h3>
                {prescriptions.map((prescription, index) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    {prescription.files.map((file, fileIndex) => (
                      <div key={fileIndex}>
                        <a
                          onClick={() => handleDownload(file)}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: "blueviolet",
                            textAlign: "center",
                          }}
                        >
                          {file.filename}
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {isFromDocPage ? (
                <div className="details-file-input-container">
                  <label
                    htmlFor="prescription-upload"
                    className="custom-file-upload"
                  >
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
              ) : (
                <p></p>
              )}
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
