import React, { useEffect, useState } from 'react';
import './Doctor-side.css';
import './nav.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Typed from 'typed.js';
import pat from '../assets/pat.png';
import search from '../assets/search .png';  
import chat from '../assets/chat.png';
import theme from '../assets/theme.png';
import appoin from '../assets/appoinment.png';
import power from '../assets/power-button.png';
import profile from '../assets/profile.png';

const Doctorside = () => {
  const appointments = [
    { Name: "Mugeish",Age:20,ID:"12A",Time: "10:00 AM" },
    { Name: "Harish",Age:21,ID:"12B", Time: "10:00 AM" },
    { Name: "Navi",Age:22,ID:"12C", Time: "5:00 PM" },
    { Name: "Lijo",Age:23,ID:"12D", Time: "12:00 PM" },
    { Name: "Harrsha",Age:24,ID:"12E",Time: "9:00 AM" }
  ];

  const { state } = useLocation();
  const { name = 'No Name', image = '', Hospital_Name = 'No Hospital', Specialized = 'No Specialization', Lic_No = 'No License' } = state || {};
  console.log('State:', state);
  const navigate = useNavigate();
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleAppointment, setToggleAppointment] = useState(false);

  const handleLogout = () => {
    navigate('/');
  };
  const normalizePath = (filePath) => {
    return filePath ? filePath.replace(/\\/g, '/') : '';
  };
  const imageUrl = image ? `http://localhost:5000/api/user/${normalizePath(image)}` : '';
  console.log('Image URL:', imageUrl);

  const handleProfileToggle = () => {
    setToggleProfile(prev => !prev);
  };

  const handleAppointmentToggle = () => {
    setToggleAppointment(prev => !prev);
  };
  const handleRedirect = (item) => {
    navigate('/details', { state: { Name: item.Name, Age: item.Age, ID: item.ID } });
  };

  useEffect(() => {
    const typed = new Typed('.typed-text', {
      strings: [`Dr. ${name}`],
      typeSpeed: 50,
      backSpeed: 50,
      loop: false
    });

    return () => typed.destroy();
  }, [name]);

  return (
    <div className="whole-cont">
      <div className="header-div">
        <header>
          <nav>
            <div className="doc-nav-Lcont">
              <div className="doc-title"><h2>MedX</h2></div>
              <div className="doc-search-div">
                <input type="text" placeholder="Search" />
                <img src={search} alt="Search" width={20} height={20} className="input-icon" />
              </div>
            </div>
          </nav>
          <button id="doc-prof-btn" onClick={handleProfileToggle}>
            <img src={imageUrl} alt="Profile" width={60} height={60} className='profile-img'/>
          </button>
        </header>
      </div>

      <div className="main-content-DS">
        <aside>
          <div className="welcome-div">
            <div className="other-btn-div">
              <div className="btn-img">
                <img src={theme} alt="Theme" width={40} height={40} />
                <button className="other-btn">Theme</button>
              </div>
              <div className="btn-img">
                <img src={chat} alt="Chat" width={40} height={40} />
                <button className="other-btn">Chat</button>
              </div>
              <div className="btn-img">
                <img src={appoin} alt="Appointment" width={40} height={40} />
                <button className="other-btn" onClick={handleAppointmentToggle}>Appointment</button>
              </div>
            </div>
            <div className="logout-btn-div">
              <img src={power} alt="Logout" width={40} height={40} />
              <button className="button-31" id="lout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </aside>
        <main>
          <div className="main-top">
            <div className="doc-greet">
              <div className="prof">
                <img src={imageUrl} alt="Doctor" width={125} />
              </div>
              <div className="doc-greet-text">
                <div className="typed-anim-cont">
                  <h2>Welcome,</h2>
                  <h2 className="typed-text"><p>           </p></h2>
                </div>
                <p id="desig">{Specialized} Surgeon</p>
              </div>
            </div>
            <div className="doc-pat-count">
              <h2>Total patients:</h2>
              <h3>100</h3>
            </div>
          </div>
          <div className="main-bottom">
            <div className="list-container">
              {appointments.map((item, index) => (
                <div key={index} className="list-div-Card">
                  <div className="prof2">
                    <img src={pat} alt="Patient" width={90} />
                  </div>
                  <label>Name: {item.Name}</label>
                  <label>Age: {item.Age}</label>
                  <label>Patient's Id: {item.ID}</label>
                  <button className="button-31" id="view" onClick={() => handleRedirect(item)}>View in Detail</button>
                </div>
              ))}
            </div>
          </div>
        </main>
        {toggleProfile && (
          <div className="toggle-prof-div">
            <div className="det-doc">
              <div className="prof-det">
                <img src={imageUrl} alt="Profile" width={125} />
              </div>
              <label>Name: Dr. {name}</label>
              <label>Hospital Name: {Hospital_Name}</label>
              <label>Position: {Specialized} Surgeon</label>
              <label>Lic_No: {Lic_No}</label>
              <button className="button-31" onClick={handleProfileToggle}>Close</button>
            </div>
          </div>
        )}
        {toggleAppointment && appointments.map((item, index) => (
          <div key={index} className="appion-div">
            <div className="prof3">
              <img src={pat} alt={item.Name} width={60} />
            </div>
            <div className="appion-content">
              <p>{item.Name}</p>
              <p>Time: {item.Time}</p>
            </div>
            <div className="button-group">
              <button className="appoin-btn">Accept</button>
              <button className="appoin-btn decline">Decline</button>
              <button className="close-btn" onClick={handleAppointmentToggle}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctorside;
