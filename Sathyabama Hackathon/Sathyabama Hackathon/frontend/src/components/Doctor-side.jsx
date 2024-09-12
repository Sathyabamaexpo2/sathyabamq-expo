import React, { useEffect, useRef, useState } from 'react';
import './Doctor-side.css';
import './nav.css';
import {useLocation,useNavigate} from "react-router-dom"
import Typed from 'typed.js';
import pat from "../assets/pat.png";
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
  const HandleRedirectionLogout=()=>{
    Navigate('/');
 }
  const List=[{
    Name:"Lijo",
    Age:20,
    Height:"165CM",
    Weight:"75Kg"
  },{ Name:"Navii",
    Age:20,
    Height:"185CM",
    Weight:"75Kg"},
    { Name:"Harish",
        Age:20,
        Height:"170CM",
        Weight:"69Kg"},
        { Name:"Harrsha",
            Age:20,
            Height:"160CM",
            Weight:"59Kg"}]
const HandleProff=()=>{
    setToggle(!Toggle);
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
      <div className="header-div">
        <header>
          <nav>
            <h1>MedX</h1>
            <input type="text" placeholder='Search' />
          </nav>
          <button className='button-31' onClick={HandleRedirectionLogout}>Logout</button>
          <button id='doc-prof-btn'onClick={HandleProff}><img src={profile} alt="" width={50} height={50}/></button>
        </header>
      </div>

      <div className="main-content-DS">
        <div className="welcome-div">
          <div className="txt-div">
          <h2>Welcome,</h2>
          <h2 className="typed-text"></h2>
          </div>
          <div className="list-container">
          {List.map((item, index) => (
              <div key={index} className="list-div-Card">
                  <div className="prof">
                    <img src={pat} alt="" width={90}/>
                  </div>
                <label>Name :{item.Name}</label>
                <label>Age :{item.Age}</label>
                <label>Height :{item.Height}</label>
                <label>Weight :{item.Weight}</label>
                <button className='button-31' onClick={HandleRedirect}>View in detail</button>
              </div>))}
          </div>
        </div>

        <div className="right-container">
          <aside>
            <h2>Appointments.</h2>
            <h2>Total Slots:<span>10</span></h2>
          </aside>
          {Appointments.map((item,index)=>(
            <div key={index} className="appion-div">
                <div className="prof" id='prof-2'><img src={pat} alt="" width={60}/></div> <p>{item.Name}</p> <p>Time:{item.Time} </p> <button className='appoin-btn'><img src={check} alt="" /></button ><button className='appoin-btn'><img src={multiplication} alt="" /></button>
            </div>
          ))}
        </div>
        {Toggle&&(<div className="toggle-prof-div">
            <div className="det-doc">
            <div className="prof"><img src={profile} alt="" width={100} /></div>
                <label>Name:Dr.Harish Viswanath</label>
                <label>Hospital Name:Mridhullah Heart Clinic</label>
                <label>Position:Heart Surgeon</label>
                <button className='button-31' onClick={HandleProff}>Close</button>
            </div>
        </div>)}
      </div>
    </>
  );
};

export default Doctorside;
