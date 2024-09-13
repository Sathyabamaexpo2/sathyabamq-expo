import React, { useEffect, useRef, useState } from 'react';
import './Doctor-side.css';
import './nav.css';
import {useLocation,useNavigate} from "react-router-dom"
import Typed from 'typed.js';
import pat from "../assets/pat.png";
import search from "../assets/search .png";
import chat from "../assets/chat.png";
import theme from "../assets/theme.png";
import appoin from "../assets/appoinment.png";
import power from "../assets/power-button.png"
import check from "../assets/check.png"
import profile from "../assets/profile.png"
import multiplication from "../assets/multiplication.png"
const Doctorside = () => {
  const Appointments=[{Name:"Mugeish",Time:"10:00 AM"},{Name:"Harish",Time:"10:00 AM"},{Name:"Navi",Time:"5:00 PM"},{Name:"Lijo",Time:"12:00 PM"},{Name:"Harrsha",Time:"9:00 AM"}]
  const progressRingRef = useRef(null);
  const progressTextRef = useRef(null);
  const Navi=useLocation();
  const Navigate=useNavigate();
  const [Toggle,setToggle]=useState(false);
  const[Appoin,setToggleAppoinment]=useState(false)
  const HandleRedirectionLogout=()=>{
    Navigate('/');
 }
  const List=[{
    Name:"Lijo",
    Age:20,
    Id:"123D"
  },{ Name:"Navii",
    Age:20,
    Id:"123C"},
    { Name:"Harish",
        Age:20,
        Id:"123B"},
        { Name:"Harrsha",
            Age:20,
          Id:"123A"}]
const HandleProff=()=>{
    setToggle(!Toggle);
}
const HandleApponment=()=>{
  setToggleAppoinment(!Appoin)
}
const HandleRedirect=()=>{
    Navigate('/details');
}
  useEffect(() => {
    const typed = new Typed('.typed-text', {
      strings: ['Dr.Harish Viswanath'],
      typeSpeed: 50,
      backSpeed: 50,
      loop: false
    });
    return () => typed.destroy();
  }, []);
  return (
    <>
    <div className="whole-cont">
    <div className="header-div">
        <header>
          <nav>
            <div className="doc-nav-Lcont">
            <div className="doc-title"><h2>MedX</h2></div>
            <div className="doc-search-div">
            <input type="text" placeholder='Search' />
            <img src={search} alt="" width={20} height={20} className='input-icon '/>
            </div>
            </div>
          </nav>
          <button id='doc-prof-btn'onClick={HandleProff}><img src={profile} alt="" width={50} height={50}/></button>
        </header>
      </div>

      <div className="main-content-DS">
        <aside>
        <div className="welcome-div">
          <div className="other-btn-div">
          <div className="btn-img"><img src={theme} alt="" width={40} height={40}/><button className='other-btn' onClick={HandleApponment}>theme</button></div>
          <div className="btn-img"><img src={chat} alt="" width={40} height={40}/><button className='other-btn'>Chat</button></div>
          <div className="btn-img"><img src={appoin} alt="" width={40} height={40}/><button className='other-btn'>appointment</button></div>
          </div>
        <div className="logout-btn-div"><img src={power} alt="" width={40} height={40}/> <button className='button-31' id='lout' onClick={HandleRedirectionLogout}>Logout</button></div>
        </div>
        </aside>
        <main>
          <div className="main-top">
          <div className="doc-greet">
            <div className="prof">
              <img src={profile} alt="" width={125}/>
            </div>
            <div className="doc-greet-text">
              <div className="typed-anim-cont">
              <h2>Welcome,</h2>
              <h2 className="typed-text"></h2>
              </div>
              <p id='desig'>Heart Surgeon</p>
            </div>
          </div>
          <div className="doc-pat-count">
              <h2>Total patient's </h2><h3>100</h3>
            </div>
          </div>
          <div className="main-bottom">
          <div className="list-container">
          {List.map((item, index) => (
              <div key={index} className="list-div-Card">
                  <div className="prof2">
                    <img src={pat} alt="" width={90}/>
                  </div>
                <label>Name :{item.Name}</label>
                <label>Age :{item.Age}</label>
                <label>Patient's Id:{item.Id}</label>
                <button className='button-31' id='view' onClick={HandleRedirect}>View in detail</button>
              </div>))}
          </div>
          </div>
</main>
        {Toggle&&(<div className="toggle-prof-div">
            <div className="det-doc">
            <div className="prof-det"><img src={profile} alt="" width={125} /></div>
                <label>Name:Dr.Harish Viswanath</label>
                <label>Hospital Name:Harvard Heart Clinic</label>
                <label>Position:Heart Surgeon</label>
                <button className='button-31' onClick={HandleProff}>Close</button>
            </div>
        </div>)}
        {Appointments.map((item, index) => (
  Appoin && (
    <div key={index} className="appion-div">
      <div className="prof" id='prof-2'>
        <img src={pat} alt={item.Name} width={60} />
      </div>
      <p>{item.Name}</p>
      <p>Time: {item.Time}</p>
      <button className='appoin-btn'>
        Accept
      </button>
      <button className='appoin-btn'>
        Decline
      </button>
    </div>
  )
))}
      </div>
    </div>
    </>
  );
};

export default Doctorside;
