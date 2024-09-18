import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import loginimage1 from "../../assets/loginimage1.jpeg";
import { useNavigate } from 'react-router-dom';

const Login = ({ setShowLogin }) => {
  const [currstate, setCurrState] = useState("Login");
  const [doc, setDoc] = useState(false);
  const [text, setText] = useState("");
  const navigate = useNavigate();
  const[otpPopup,setOtpPopup]=useState(false);
  const [otp,setOtp]=useState("");

  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodgroup: "",
    height: "",
    weight: "",
    email: "",
    password: "",
    image:null
  });

  const [doctorData, setDoctorData] = useState({
    name: "",
    age: "",
    Lic_No: "",
    Hospital_Name: "",
    Specialized: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const onChangeHandler = (event) => {
    const { name, value, type, files } = event.target;
  
    // For Sign-Up (Doctor)
    if (currstate === "Sign-Up" && doc) {
      if (type === "file") {
        setDoctorData((prevData) => ({ ...prevData, [name]: files[0] }));
      } else {
        setDoctorData((prevData) => ({ ...prevData, [name]: value }));
      }
    } 
    // For Sign-Up (User)
    else if (currstate === "Sign-Up" && !doc) {
      if (type === "file") {
        setUserData((prevData) => ({ ...prevData, [name]: files[0] }));
      } else {
        setUserData((prevData) => ({ ...prevData, [name]: value }));
      }
    }
    // For Login
    else if (currstate === "Login") {
      setUserData((prevData) => ({ ...prevData, [name]: value }));
    }
  };
  
const onLogin = async (event) => {
  event.preventDefault();
  let newUrl = "http://localhost:5000/api/user";
  let payload;

  try {
    if (currstate === "Login") {
      newUrl += "/login";
      if (!userData.email || !userData.password) {
        toast.error("Email and password are required.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      payload = {
        email: userData.email,
        password: userData.password,
      };
      const response = await axios.post(newUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      console.log(response.data); // Log the entire response data to check the structure
      if (response.status === 200) {
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 3000,
        });
      
        // Check if response.data.user and response.data.user.image exist
        if (response.data.user && response.data.user.image && response.data.user.image.path) {
          const imagePath = response.data.user.image.path;
          localStorage.setItem("token", response.data.token);
          navigate("/userpage", { state: { image: imagePath } });
        } else {
          // Handle cases where image or path is missing
          toast.warn("User logged in, but no image found.");
          localStorage.setItem("token", response.data.token);
          navigate("/userpage");
        }
      } else {
        toast.error(response.data.message || "Something went wrong.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      
    } else if (currstate === "Sign-Up") {
      if (doc) {
        newUrl += "/RegDo";
        const requiredFields = ["name", "age", "Lic_No", "Hospital_Name", "Specialized", "email", "password", "confirmPassword", "image"];
        payload = new FormData();
        
        for (const field of requiredFields) {
          if (!doctorData[field] && field !== "image") {
            toast.error(`${field.replace('_', ' ')} is required.`, {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          if (field === "image" && !doctorData.image) {
            toast.error("Image is required.", {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          payload.append(field, doctorData[field]);
        }
        const response = await sendVerificationtoAdmin(doctorData.Lic_No, doctorData.email, doctorData.name);
        if(response) {
          setOtpPopup(true);
        }
      } else {
        newUrl += "/register";
        const requiredFields = ["name", "age", "gender", "bloodgroup", "height", "weight", "email", "password"];
        payload = new FormData();
      
        for (const field of requiredFields) {
          if (!userData[field]) {
            toast.error(`${field.replace('_', ' ')} is required.`, {
              position: "top-right",
              autoClose: 3000,
            });
            return;
          }
          payload.append(field, userData[field]);
        }
        
        // Handle image if present
        if (userData.image) {
          payload.append('image', userData.image);
        }
      
        const response = await axios.post(newUrl, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200 || response.status === 201) {
          toast.success('User registered successfully!');
        } else {
          toast.error(response.data.message || 'Something went wrong.');
        }
      }
    }
  } catch (error) {
    console.error("Error during submission:", error);
    toast.error(`Error: ${error.response ? error.response.data.message : "Something went wrong. Please try again!"}`, {
      position: "top-right",
      autoClose: 3000,
    });
  }
};

  
  const sendVerificationtoAdmin = async (LicenseNumber, email, name) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/superadmin/verify", {
        Lic_No: LicenseNumber,
        email: email,
        name: name,
      });
  
      if (response.status === 200) {
        toast.success("Verification email sent to Super Admin.");
        return true; 
      } else {
        toast.error(response.data.message || "Failed to send verification email.");
        return false;
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Verification failed.");
      return false;
    }
  };
  
  const OtpVerification = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/user/verifyOtp", {
        otp,
        email: doctorData.email,
      });
  
      if (response.status === 200) {
        toast.success("Registration Successful!");
        const registerUrl = "http://localhost:5000/api/user/RegDo";
        const formData = new FormData();
        Object.keys(doctorData).forEach((key) => {
          formData.append(key, doctorData[key]);
        });
        const registerResponse = await axios.post(registerUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (registerResponse.status === 200 || registerResponse.status === 201) {
          toast.success('Doctor registered successfully!');
          setOtpPopup(false);
          navigate("/doclogin");
        } else {
          toast.error(registerResponse.data.message || "Something went wrong.");
        }
  
      } else {
        toast.error("Failed to verify OTP, try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("Something went wrong, try again.");
    }
  };
  useEffect(() => {
    setText(doc ? "User" : "Doctor ");
  }, [doc]);

  const handleRedirection = () => {
    navigate('/doclogin');
  };
  return (
    <>
      <ToastContainer />
      <div className="login-main-container">
        <div className="user-sideimage">
          <img src={loginimage1} alt="Login" />
        </div>
        <div className="login-popup">
          <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
              <div className="title-contain">
                <h2>{currstate}</h2>
                <p className="login-page-title">to medX.co</p>
              </div>
            </div>
            <div className="login-popup-inputs">
              {currstate === "Login" ? (
                <>
                  <input
                    name="email"
                    onChange={onChangeHandler}
                    value={userData.email}
                    type="email"
                    placeholder="Your email"
                    required
                  />
                  <input
                    name="password"
                    onChange={onChangeHandler}
                    value={userData.password}
                    type="password"
                    placeholder="Password"
                    required
                  />
                </>
              ) : (
                <>
                  {doc ? (
                    <div className="signup-doc">
                      <input
                        name="name"
                        onChange={onChangeHandler}
                        value={doctorData.name}
                        type="text"
                        placeholder="Your Name"
                        required
                      />
                      <input
                        name="age"
                        onChange={onChangeHandler}
                        value={doctorData.age}
                        type="number"
                        placeholder="Your age"
                        required
                      />
                      <input
                        name="Lic_No"
                        onChange={onChangeHandler}
                        value={doctorData.Lic_No}
                        type="text"
                        placeholder="License number"
                        required
                      />
                      <input
                        name="Hospital_Name"
                        onChange={onChangeHandler}
                        value={doctorData.Hospital_Name}
                        type="text"
                        placeholder="Hospital Name"
                        required
                      />
                      <input
                        name="Specialized"
                        onChange={onChangeHandler}
                        value={doctorData.Specialized}
                        type="text"
                        placeholder="Specialization"
                        required
                      />
                      <input
                        name="email"
                        onChange={onChangeHandler}
                        value={doctorData.email}
                        type="email"
                        placeholder="Your email"
                        required
                      />
                      <input
                        name="password"
                        onChange={onChangeHandler}
                        value={doctorData.password}
                        type="password"
                        placeholder="Password"
                        required
                      />
                      <input
                        name="confirmPassword"
                        onChange={onChangeHandler}
                        value={doctorData.confirmPassword}
                        type="password"
                        placeholder="Confirm Password"
                        required
                      />
                      <div className="file-input-container">
                        <label htmlFor="file-upload" className="custom-file-upload">
                          Upload profile-pic
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          name="image"
                          onChange={onChangeHandler}
                          style={{ display: "none" }}
                          required
                        />
                        <span>{doctorData.image ? doctorData.image.name : "No file chosen"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="signup">
                      <input
                        name="name"
                        onChange={onChangeHandler}
                        value={userData.name}
                        type="text"
                        placeholder="Your Name"
                        required
                      />
                      <input
                        name="age"
                        onChange={onChangeHandler}
                        value={userData.age}
                        type="number"
                        placeholder="Your age"
                        required
                      />
                      <input
                        name="gender"
                        onChange={onChangeHandler}
                        value={userData.gender}
                        type="text"
                        placeholder="Gender"
                        required
                      />
                      <input
                        name="bloodgroup"
                        onChange={onChangeHandler}
                        value={userData.bloodgroup}
                        type="text"
                        placeholder="Blood Group"
                        required
                      />
                      <input
                        name="height"
                        onChange={onChangeHandler}
                        value={userData.height}
                        type="number"
                        placeholder="Height in cms"
                        required
                      />
                      <input
                        name="weight"
                        onChange={onChangeHandler}
                        value={userData.weight}
                        type="number"
                        placeholder="Weight"
                        required
                      />
                      <input
                        name="email"
                        onChange={onChangeHandler}
                        value={userData.email}
                        type="email"
                        placeholder="Your email"
                        required
                      />
                      <input
                        name="password"
                        onChange={onChangeHandler}
                        value={userData.password}
                        type="password"
                        placeholder="Password"
                        required
                      />
  <div className="file-input-container">
      <label htmlFor="user-file-upload" className="custom-file-upload">
        Upload profile-pic
      </label>
      <input
        id="user-file-upload"
        type="file"
        name="image"
        onChange={onChangeHandler}
        style={{ display: "none" }}
        required
      />
      <span>{userData.image ? userData.image.name : "No file chosen"}</span></div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="signup-log-div">
              <button type="submit">
                {currstate === "Sign-Up" ? "Create account" : "Login"}
              </button>
            </div>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>
                By continuing, I agree to the terms of use and privacy policy.
              </p>
            </div>
            {currstate === "Login" ? (
              <>
                <a
                  className="doc-signup-button"
                  onClick={handleRedirection}
                  style={{ marginTop: "-15px" }}
                >
                  Sign in as a Doctor
                </a>
                <p>
                  Create a new account?
                  <span onClick={() => setCurrState("Sign-Up")}>Click here</span>
                </p>
              </>
            ) : (
              <>
                <a
                  className="doc-signup-button"
                  onClick={() => setDoc((prev) => !prev)}
                  style={{ marginTop: "-15px" }}
                >
                  Sign up as a {text}
                </a>
                <p style={{ marginTop: "-10px" }}>
                  Already have an account?
                  <span onClick={() => setCurrState("Login")}>Login here</span>
                </p>
              </>
            )}
          </form>

          {otpPopup && (
        <>
          <div className="blur-background" onClick={() => setOtpPopup(false)}></div>
          <div className="otp-popup">
            <span className="close-icon" onClick={() => setOtpPopup(false)}>&times;</span>
            <h3>Enter OTP</h3>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button onClick={OtpVerification}>Verify OTP</button>
          </div>
        </>
      )}
      
        </div>
      </div>
    </>
  );
};

export default Login;
