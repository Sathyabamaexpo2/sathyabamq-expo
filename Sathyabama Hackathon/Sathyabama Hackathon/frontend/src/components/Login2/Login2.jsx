  import React, { useState } from 'react';
  import loginimage1 from "../../assets/loginimage1.jpeg";
  import { useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  const Login2 = () => {
    const [data, setData] = useState({
      email: "",
      password: ""
    });

    const navigate = useNavigate();

    const onChangeHandler = (event) => {
      const { name, value } = event.target;
      setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (event) => {
      event.preventDefault();
      try {
        const res = await axios.post('http://localhost:5000/api/user/loginDoc',{
          email: data.email,
          password: data.password
        });
        if (res.data.message === "User doesn't exist") {
          toast.warn('User does not exist');
        } else if (res.data.message === "Invalid credentials") {
          toast.error('Wrong Password');
        } else {
          localStorage.setItem("token", res.data.token);
          const imagePath = res.data.user.image ? res.data.user.image.path : ''; // Handle optional image
          navigate('/doctor', { 
            state: {
              name: res.data.user.name,
              image: imagePath,
              Hospital_Name: res.data.user.Hospital_Name,
              Specialized: res.data.user.Specialized,
              Lic_No: res.data.user.Lic_No
            }
          });
          toast.success("Logged in Successfully!");
        }
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'Something went wrong');
      }
    };
    const handleRedirection = () => {
      navigate('/');
    };

    return (
      <div className="login-main-container">
        <div className="user-sideimage">
          <img src={loginimage1} alt="Login" />
        </div>
        <div className="login-popup">
          <form className="login-popup-container">
            <div className="login-popup-title">
              <div className="title-contain">
                <h2>Login</h2>
                <p className="login-page-title">to medX.co</p>
              </div>
            </div>
            <div className="login-popup-inputs">
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
            </div>
            <div className="signup-log-div">
              <button type="submit" onClick={handleLogin}>Login</button>
            </div>
            <div className="login-popup-condition">
              <input type="checkbox" required />
              <p>
                By continuing, I agree to the terms of use and privacy policy.
              </p>
            </div>
            <a
              className="doc-signup-button"
              onClick={handleRedirection} 
            >
              Sign in as a User
            </a>
          </form>
        </div>
        <ToastContainer />
      </div>
    );
  };

  export default Login2;
