import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import loginimage1 from "../../assets/loginimage1.jpeg";

const Login = ({ setShowLogin }) => {
  const [currstate, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodgroup: "",
    height: "",
    weight: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = "http://localhost:5000/api/user";
    if (currstate === "Login") {
      newUrl += "/login";
    } else {
      newUrl += "/register";
    }
  
    try {
      const response = await axios.post(newUrl, data);
  
      console.log('Response:', response); // Log the entire response object
  
      if (response.data.success) {
        toast.success(`${currstate} Successful!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
  
        if (currstate === "Login") {
          localStorage.setItem("token", response.data.token);
        }

      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Something went wrong. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  

  return (
    <>
      <ToastContainer />
      <div className="main-container">
        <div className="sideimage">
          <img src={loginimage1} alt="Login" />
        </div>
        <div className="login-popup">
          <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
              <div className="title-contain">
                <h2>{currstate}</h2>
                <p>to medX.co</p>
              </div>
            
            </div>
            <div className="login-popup-inputs">
              {currstate === "Login" ? (
                <>
                 <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
                </>
              ) : (

                <div className="signup">
                 <input
                name="email"
                onChange={onChangeHandler}
                value={data.email}
                type="email"
                placeholder="Your email"
                required
              />
              <input
                name="password"
                onChange={onChangeHandler}
                value={data.password}
                type="password"
                placeholder="Password"
                required
              />
                <input
                 name="name"
                 onChange={onChangeHandler}
                 value={data.name}
                 type="text"
                 placeholder="Your Name"
                 />

                  <input
                    name="age"
                    onChange={onChangeHandler}
                    value={data.age}
                    type="number"
                    placeholder="Your age"
                    required
                  />
                  <input
                    name="gender"
                    onChange={onChangeHandler}
                    value={data.gender}
                    type="text"
                    placeholder="Gender"
                    required
                  />
                  <input
                    name="bloodgroup"
                    onChange={onChangeHandler}
                    value={data.bloodgroup}
                    type="text"
                    placeholder="Blood Group"
                    required
                  />
                  <input
                    name="height"
                    onChange={onChangeHandler}
                    value={data.height}
                    type="number"
                    placeholder="Height in cms"
                    required
                  />
                  <input
                    name="weight"
                    onChange={onChangeHandler}
                    value={data.weight}
                    type="number"
                    placeholder="Weight"
                    required
                  />
                </div>
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
              <p>
                Create a new account?
                <span onClick={() => setCurrState("Sign-Up")}>Click here</span>
              </p>
            ) : (
              <p>
                Already have an account?
                <span onClick={() => setCurrState("Login")}>Login here</span>
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
