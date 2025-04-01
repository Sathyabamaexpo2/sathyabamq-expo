import React from "react";
import QR from '../../assets/QR.jpg'
import './dash.css'
const PowerBIReport = () => {
  return (
    <div className="main-dash">
      <h3>Just A Scan Your Report will be in your Hand.....</h3>
      <div className="QR-div">
        <img src={QR} alt="" width={400} height={400} />
      </div>
    </div>
  );
};

export default PowerBIReport;
