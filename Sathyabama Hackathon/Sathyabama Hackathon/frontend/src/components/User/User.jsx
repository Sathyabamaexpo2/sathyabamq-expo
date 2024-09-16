import React, { useState, useEffect } from 'react';
import './User.css';
import profile from '../../assets/messi-ronaldo-fb.jpg';
import axios from 'axios'; 
import theme from "../../assets/theme.png";
import chat from "../../assets/chat.png";
import power from "../../assets/power-button.png";
import { useLocation } from 'react-router-dom';

const User = () => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location=useLocation();
  const{state}=location;
  const{image}=state ||{};
  const appointments = [
    { 
      type: "Dentist",
      doctor: "Robert",
      time: "10:00 AM",
      color: "rgb(160, 131, 255)",
    },
    { 
      type: "Cardiologist",
      doctor: "Dr. Gloria Curtis",
      time: "12:00 PM",
      color: "rgb(103, 166, 255)",
    },
    {
      type: "Oculist",
      doctor: "Dr. Erin Herwitz",
      time: "04:00 PM",
      color: "rgb(249, 204, 92)",
    },

  ];

  appointments.sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.time}`);
    const timeB = new Date(`1970/01/01 ${b.time}`);
    return timeA - timeB;
  });
  

  const CalendarAppointments = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [daysInMonth, setDaysInMonth] = useState([]);

    // Update days in month based on selected month
    useEffect(() => {
      const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
      };

      const year = selectedDate.getFullYear();
      const days = getDaysInMonth(currentMonth, year);
      setDaysInMonth(Array.from({ length: days }, (_, i) => i + 1));
    }, [currentMonth, selectedDate]);

    // Handle month change
    const handleMonthChange = (event) => {
      const monthIndex = parseInt(event.target.value, 10);
      setCurrentMonth(monthIndex);
      setSelectedDate(new Date(selectedDate.getFullYear(), monthIndex, selectedDate.getDate()));
    };

    // Get weekdays for calendar
    const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Render calendar days with weekends highlighted
    const renderCalendarDays = () => {
      const startDay = new Date(selectedDate.getFullYear(), currentMonth, 1).getDay();
      const calendarDays = [];

      // Fill empty slots before the first days
      for (let i = 0; i < (startDay + 6) % 7; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
      }

      daysInMonth.forEach((day) => {
        const isWeekend = (startDay + day - 1) % 7 === 5 || (startDay + day - 1) % 7 === 6;
        calendarDays.push(
          <div
            key={day}
            className={`calendar-day ${isWeekend ? 'weekend' : ''}`}
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), currentMonth, day))}
          >
            {day}
          </div>
        );
      });

      return calendarDays;
    };

    return (
      <div className='appointments-container'>
        <div className="calendar">
        <div className="calendar-container">
        <h3 style={{fontSize:"22px"}}>Doctor Appointments</h3>
          <div className="calendar-box">
          <div className="calendar-header">
            <h2>{selectedDate.toLocaleString('default', { month: 'long' })}</h2>
            <select onChange={handleMonthChange} value={currentMonth}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(selectedDate.getFullYear(), i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>

          {/* Weekdays */}
          <div className="calendar-grid calendar-weekdays">
            {weekdays.map((day, index) => (
              <div key={index} className="calendar-day calendar-header-day">
                {day}
              </div>
            ))}
          </div>

          {/* Days of the Month */}
          <div className="calendar-grid calendar-days">{renderCalendarDays()}</div>
        </div>
        </div> 
        </div>
        {/* Appointments Section */}
        <div className="appointments-list">
               {appointments.map((appointment, index) => (
        <div
          key={index}
          className="appointment-card"
          style={{ backgroundColor: appointment.color }}
        >
          <div className="appointment-details">
            <p>{appointment.doctor}</p>
            <h3>{appointment.type}</h3>
          </div>
          <div className="appointment-time">
            <p>{appointment.time}</p>
          </div>
        </div>
      ))}
    </div>
        <button className='appointments-button'>View More Appointments</button>
      </div>
      
    );
  };  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); 
  
        const response = await axios.get('http://localhost:5000/api/user/getdata', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUserData(response.data.Msg);
      } 
      catch (err) {
        console.error('Error fetching user data:', err); 
        setError('Error fetching user data');
      } 
      finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }


  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2); 
  };

  const calculateBMR = (weight, height, age, gender) => {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  };

  const calculateMacros = (calories) => {
    const carbCalories = calories * 0.50;
    const proteinCalories = calories * 0.30;
    const fatCalories = calories * 0.20; 
  
    const carbs = Math.round(carbCalories / 4);
    const protein = Math.round(proteinCalories / 4);
    const fats = Math.round(fatCalories / 9);
  
    return { carbs, protein, fats };
  };
  

  const calculateCalories = (bmr) => {
    const weightLossCalories = bmr - 500;
    const weightGainCalories = bmr + 500; 
    return { weightLossCalories, weightGainCalories };
  };

const bmi = userData ? calculateBMI(userData.weight, userData.height) : 'N/A';
const bmr = userData ? calculateBMR(userData.weight, userData.height, userData.age, userData.gender) : 0;
const { weightLossCalories, weightGainCalories } = calculateCalories(bmr);
const weightLossMacros = calculateMacros(weightLossCalories);
const weightGainMacros = calculateMacros(weightGainCalories);

const normalizePath = (filePath) => {
  return filePath ? filePath.replace(/\\/g, '/') : '';
};
const imageUrl = image ? `http://localhost:5000/api/user/${normalizePath(image)}` : '';
  const getHealthRisk = (bmi) => {
    if (bmi < 18) {
      return { risk: 'Underweight', color: '#FFD700' }; 
    } else if (bmi >= 18 && bmi < 24) {
      return { risk: 'Normal', color: '#32CD32' }; 
    } else if (bmi >= 24) {
      return { risk: 'At Risk of Obesity', color: '#FF6347' };
    }
  };

  const totalWeightLossMacros = weightLossMacros.protein + weightLossMacros.carbs + weightLossMacros.fats;
  const totalWeightGainMacros = weightGainMacros.protein + weightGainMacros.carbs + weightGainMacros.fats;
  

  

  return (
    <div className="user-main-container">
      <div className="user-left">
         <div className="user-left-title">
         <h2>MedX</h2>
         </div>

        <div className="user-left-div">
           <div className="btn-img"><img src={theme} alt="" width={40} height={40}/><button className='other-btn'>Theme</button></div>
           <div className="btn-img"><img src={chat} alt="" width={40} height={40}/><button className='other-btn'>Chat</button></div>
        </div>
        <div className="logout-btn-div" style={{marginLeft:"-30px"}}><img src={power} alt="" width={40} height={40}/> <button className='button-31' id='lout'>Logout</button></div>
      </div>

      <div className="user-right-container">
        <div className="user-center">
          <div className="user-profile">
            <div className="user-card">
              <div className="user-img-container">
                <img src={imageUrl} alt="Profile"/>
              </div>
              <h2 className="user-card-username">{userData.name}</h2>
              <div className="patient-details">
                <div className="patient-profile" id="patient-pro">
                  <h2>{userData.age}</h2>
                  <span>Years</span>
                  <h2>{userData.height}cm</h2>
                  <span>Height</span>
                </div>
                <div className="patient-profile">
                  <h2>{userData.bloodgroup}</h2>
                  <span>Blood</span>
                  <h2>{userData.weight}Kg</h2>
                  <span>Weight</span>
                </div>
              </div>
            </div>

           
            <div className="activity-top">
             <div className="bmi">
               <div className="bmi-det-div">
                <div className="bmi-l">
                  <h4>BMI</h4>
                  <div className={`bmi-circle ${bmi >= 18 && bmi <= 24 ? 'bmi-normal' : 'bmi-high'}`}>
                     {bmi}
                  </div>
                </div>
                <div className="bmi-r">
                <h5><span>&lt;18: Low 🧍‍♂️🍏</span></h5>
                <h5><span>18-24: Normal ✅💪</span></h5>
                <h5><span>&gt;24: High ⚠️🍔</span></h5>
                </div>
             </div>
         </div>

          <div className="recommendation-box">
                <div className="recommendation-header">
                   <h3>Health Risk Indicators</h3>
                </div>
                <div className="recommendation-content">
                {
    bmi < 18 ? (
        <div className="icon-recommendation">
            <span role="img" aria-label="underweight">⚠️</span> {/* Underweight warning icon */}
            <p>Risk of Nutrient Deficiency</p>
        </div>
    ) : bmi >= 18 && bmi <= 24 ? (
        <div className="icon-recommendation">
            <span role="img" aria-label="healthy">✅</span> {/* Healthy weight checkmark */}
            <p>Keep up the good work!</p>
        </div>
    ) : bmi > 24 && bmi <= 29 ? (
        <div className="icon-recommendation">
            <span role="img" aria-label="overweight">⚠️</span> {/* Overweight caution */}
            <p>Watch out for Hypertension and Diabetes</p>
        </div>
    ) : bmi >= 30 ? (
        <div className="icon-recommendation">
            <span role="img" aria-label="obesity">🚨</span> {/* Obesity warning */}
            <p>High Risk of Heart Disease</p>
        </div>
    ) : null
}

{
    userData.age >= 40 ? (
        <div className="icon-recommendation">
            <span role="img" aria-label="age risk">⚠️</span> {/* Age-related caution */}
            <p>Higher Risk for Cardiovascular Diseases</p>
        </div>
    ) : null
}

            </div>
          </div>
            </div>
          </div>

<div className="calories-card">
  <div className="card-section-1">
    <div className="card-title">
      <h4>Weight Loss</h4>
      <p>Total Calories: {weightLossCalories} Cal/day</p>
    </div>
  
      <div className="macro-details">
        <p>Protein:{weightLossMacros.protein}g</p>
        <div className="progress-bar"> 
        <span style={{ width: '50%', backgroundColor: 'rgb(160, 131, 255)' }}></span>
        </div>
      </div>

      <div className="macro-details">
        <p>Carbs: {weightLossMacros.carbs}g</p>
        <div className="progress-bar">
        <span style={{ width: '68%', backgroundColor: 'rgb(103, 166, 255)' }}></span> 
        </div>
      </div>

      <div className="macro-details">
        <p className='fats'>Fats: {weightLossMacros.fats}g</p>
        <div className="progress-bar">
        <span style={{ width: '35%', backgroundColor: 'rgb(249, 204, 92)' }}></span>
        </div>
      </div>
    </div>
   
  <div className="card-section-2">
    <div className="card-title">
      <h4>Weight Gain</h4>
      <p>Total Calories: {weightGainCalories} Cal/day</p>
    </div>

  
      <div className="macro-details">
        <p>Protein: {weightGainMacros.protein}g</p>
        <div className="progress-bar">
          <span style={{ width: '35%', backgroundColor: 'rgb(160, 131, 255)' }}></span>
          </div>
      </div>

      <div className="macro-details">
        <p>Carbs: {weightGainMacros.carbs}g</p>
        <div className="progress-bar">
        <span style={{ width: '68%', backgroundColor: 'rgb(103, 166, 255)' }}></span> 
        </div>
      </div>

      <div className="macro-details">
        <p className='fats'>Fats: {weightGainMacros.fats}g</p>
        <div className="progress-bar">
        <span style={{ width: '35%', backgroundColor: 'rgb(249, 204, 92)' }}></span>
        </div>
      </div>
    </div>

      </div>
      </div>
      

        <div className="user-right">
          <CalendarAppointments />
        </div>
      </div>
    </div>
  );
};

export default User;