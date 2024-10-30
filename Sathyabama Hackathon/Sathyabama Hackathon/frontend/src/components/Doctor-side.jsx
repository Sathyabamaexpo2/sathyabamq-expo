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
import axios from 'axios';
import { toast } from 'react-hot-toast';
import download from "../assets/download.png";

const Doctorside = () => {
  const [cartData, setCartData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleAppointment, setToggleAppointment] = useState(false);
  const { state } = useLocation();
  const { name = 'No Name', image = '', Hospital_Name = 'No Hospital', Specialized = 'No Specialization', Lic_No = 'No License' } = state || {};
  const navigate = useNavigate();
  const [confirmAppointments, setConfirmAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:5000/api/user/showDoccart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setCartData(userResponse.data.patientsdata);
        setAppointments(userResponse.data.patientsdata || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchData();
  }, []);


    
  const token = localStorage.getItem('token');

  const acceptAppointmentAndAddPatient = async ({ email, appointment }) => {
    try {
        const updateStatusResponse = await axios.patch(
            `http://localhost:5000/api/user/appointments/${appointment.username}`, 
            { doctorName: appointment.doctorName, status: 'accepted' },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log("Appointment accepted:", updateStatusResponse.data);

        if (updateStatusResponse.status === 200) {
            const addPatientResponse = await axios.post(
                'http://localhost:5000/api/user/cartAdd',
                {
                    name: appointment.username,
                    age: appointment.age,
                    gender: appointment.gender,
                    bloodgroup: appointment.bloodgroup,
                    height: appointment.height,
                    weight: appointment.weight,
                    email: email
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log("Patient added to cart:", addPatientResponse.data);
        }
    } catch (error) {
        console.error("Error processing appointment:", error.response ? error.response.data : error.message);
    }
};

  
  const handleDecline = async (appointment) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/user/appointments/${appointment.username}`,
      {doctorName:appointment.doctorName, status: 'declined' }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      toast.success('Appointment declined successfully!');
  
      fetchAppointments(); 
    } catch (error) {
      toast.error(`Error declining appointment: ${error.message}`);
      console.error('Error:', error);
    }
  };

  const fetchAppointments = async () =>{
    try {
      const response = await axios.get(`http://localhost:5000/api/user/appointments/${name}/${Specialized}`);
      setConfirmAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  console.log(confirmAppointments)
  
  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  const normalizePath = (filePath) => {
    return filePath ? filePath.replace(/\\/g, '/') : '';
  };

  const imageUrl = image ? `http://localhost:5000/api/user/${normalizePath(image)}` : '';
  
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
          <button id="doc-prof-btn" onClick={() => setToggleProfile(prev => !prev)}>
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
                <button className="other-btn" onClick={() => setToggleAppointment(prev => !prev)}>Appointment</button>
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
              <h2 >Total patients:</h2>
              <h3>{appointments.length}</h3> 
            </div>
          </div>
          <div className="main-bottom">
          <div className="list-container">
          {cartData.length > 0 ? (
  cartData.map((cart, index) => 
   
      <div key={`${index}`} className="list-div-Card">
        <div className="prof2">
          <img src={download} alt="Patient" width={40} height={40}/>
        </div>
        <label>Name: {cart.name}</label>
        <label>Age: {cart.age}</label>
        <label>Email: {cart.email}</label>
        <label>Height: {cart.height}</label>
        <label>Weight: {cart.weight}</label>
        <button
          className="button-31"
          id="view"
          onClick={() => navigate('/details', {
            state: { 
                name,
                cart
            }
        })}
        
        >
          View Details
        </button>
      </div>
  )
) : (
  <p>No Patients found.</p>
)}

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
              <button className="button-31" onClick={() => setToggleProfile(prev => !prev)}>Close</button>
            </div>
          </div>
        )}
      {toggleAppointment && confirmAppointments.map((item) => (
    item.appointments.map((appointment, index) => (
        <div key={index} className="appion-div">
            <div className="prof3">
                <img src={pat} alt={appointment.username} width={60} />
            </div>
            <div className="appion-content">
                <p>{appointment.username}</p>
                <p>{appointment.date}</p>
                <p>Time: {appointment.time}</p>
                <p>Status: {appointment.status}</p>
            </div>
            <div className="button-group">
                {appointment.status !== 'accepted' && appointment.status !== 'declined' && (
                    <>
                        <button 
                            className="appoin-btn" 
                            onClick={() => acceptAppointmentAndAddPatient({ email: item.email, appointment })}
                        >
                            Accept
                        </button>
                        <button 
                            className="appoin-btn decline" 
                            onClick={() => handleDecline(appointment)}
                        >
                            Decline
                        </button>
                    </>
                )}
        <button className="close-btn" onClick={() => setToggleAppointment(prev => !prev)}>✕</button>
      </div>
    </div>
  ))
))}

      </div>
    </div>
  );
};

export default Doctorside;
