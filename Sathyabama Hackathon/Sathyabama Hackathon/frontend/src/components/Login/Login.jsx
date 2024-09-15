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

  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodgroup: "",
    height: "",
    weight: "",
    email: "",
    password: "",
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

    if (currstate === "Sign-Up" && doc) {
      if (type === "file") {
        setDoctorData((prevData) => ({ ...prevData, [name]: files[0] }));
      } else {
        setDoctorData((prevData) => ({ ...prevData, [name]: value }));
      }
    } else {
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
        if (response.status === 200) {
          toast.success("Login Successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.setItem("token", response.data.token);
          navigate("/userpage");
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
        }
  
        // Send request with form-data content-type
        const response = await axios.post(newUrl, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        // Handle successful registration
        if (response.status === 201) {
          toast.success(`${currstate} Successful!`, {
            position: "top-right",
            autoClose: 3000,
          });
          // Redirect or other actions after successful sign-up
        } else {
          toast.error(response.data.message || "Something went wrong.", {
            position: "top-right",
            autoClose: 3000,
          });
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
        </div>
      </div>
    </>
  );
};

export default Login;
