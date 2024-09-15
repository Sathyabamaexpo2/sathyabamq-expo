import React from 'react'
import loginimage1 from "../../assets/loginimage1.jpeg";
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Login2 = () => {
    
    const navigate=useNavigate();

    const [data, setData] = useState({
        name: "",
        age: "",
        Lic_No: "",
        Hospital_Name: "",
        Specialized: "",
        gender: "",
        bloodgroup: "",
        height: "",
        weight: "",
        email: "",
        password: "",
        Confirm_password: "",
        Image: null,
      });

      const handleRedirection=()=>{
        navigate('/');
     }
   

      
      const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
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
              <button type="submit"> Login
              </button>
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
      </div>
  )
}

export default Login2;
