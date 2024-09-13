import React, { useState, useEffect } from 'react';
import './User.css';
import profile from '../../assets/messi-ronaldo-fb.jpg';
import axios from 'axios'; 

const User = () => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const appointments = [
    {
      id: 1,
      type: "Dentist",
      doctor: "Robert",  // Or whatever doctor's name should be here
      time: "10:00 AM",
      color: "#A083FF",
    },
    {
      id: 2,
      type: "Cardiologist",
      doctor: "Dr. Gloria Curtis",  // Correct doctor for this type
      time: "12:00 PM",
      color: "#67A6FF",
    },
    {
      id: 3,
      type: "Oculist",
      doctor: "Dr. Erin Herwitz",
      time: "04:00 PM",
      color: "#F9CC5C",
    }
    
    
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
        <div className="calendar-container">
        <h3>Doctor Appointments</h3>
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

        {/* Appointments Section */}
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="appointment-card"
              style={{ backgroundColor: appointment.color }}
            >
              <div className="appointment-details">
                <h3>{appointment.type}</h3>
                <p>{appointment.doctor}</p>
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
        const token = localStorage.getItem('token'); // Get the JWT token
  
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

    const carbs = (carbCalories / 4).toFixed(0);
    const protein = (proteinCalories / 4).toFixed(0);
    const fats = (fatCalories / 9).toFixed(0);

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
 
  const getHealthRisk = (bmi) => {
    if (bmi < 18) {
      return { risk: 'Underweight', color: '#FFD700' }; 
    } else if (bmi >= 18 && bmi < 24) {
      return { risk: 'Normal', color: '#32CD32' }; 
    } else if (bmi >= 24) {
      return { risk: 'At Risk of Obesity', color: '#FF6347' };
    }
  };
  

  return (
    <div className="user-main-container">
      <div className="user-left">
        <h2>MedX</h2>
        <button className='button-31'>Logout</button>
      </div>

      <div className="user-right-container">
        <div className="user-center">
          <div className="user-profile">
            <div className="user-card">
              <div className="user-img-container">
                <img src={profile} alt="Profile"/>
              </div>
              <h2 className="user-card-username">{userData.name}</h2>
              <div className="patient-details">
                <div className="patient-profile">
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
            <div className="weight-container">
              <div className="weight-column">
                <h4>Weight-Loss</h4>
                <p>Calories:{weightLossCalories}</p>
                <p>Carbs:{weightLossMacros.carbs}g</p>
                <p>Protein: {weightLossMacros.protein}g</p>
               <p>Fats: 26g</p>
             </div>
              <div className="weight-column">
                   <h4>Weight-Gain</h4>
                   <p>Calories: {weightGainCalories}g</p>
                   <p>Carbs:{weightGainMacros.carbs}g</p>
                   <p>Protein:{weightLossMacros.fats}g</p>
                   <p>Fats:{weightGainMacros.fats}g</p>
              </div>
            </div>

            </div>
          </div>
        
         <div className="activity-bottom">
         <div className="bmi">
             <div className="bmi-det-div">
                <div className="bmi-l">
                  <h2>BMI</h2>
                  <div className={`bmi-circle ${bmi >= 18 && bmi <= 24 ? 'bmi-normal' : 'bmi-high'}`}>
                     {bmi}
                  </div>
                </div>
                <div className="bmi-r">
                   <h5><span>&lt;18: Low</span></h5>
                   <h5><span>18-24: Normal</span></h5>
                   <h5><span>&gt;24: High</span></h5>
                </div>
             </div>
         </div>

          <div className="recommendation-box">
                <div className="recommendation-header">
                   <h3>Health Risk Indicators</h3>
                </div>
                <div className="recommendation-content">
                    {bmi < 18 ? (
                    <div className="icon-recommendation">
                         <img src="/icons/underweight.png" />
                         <p>Risk of Nutrient Deficiency</p>
                    </div>
                     ) : bmi >= 18 && bmi <= 24 ? (
                <div className="icon-recommendation">
                     <img src="/icons/normal-weight.png" alt="Normal Weight" />
                     <p>Keep up the good work!</p>
                     </div>
                 ) : bmi > 24 && bmi <= 29 ? (
                <div className="icon-recommendation">
                   <img src="/icons/overweight.png" alt="Overweight" />
                   <p>Watch out for Hypertension and Diabetes</p>
                 </div>
                ) : bmi >= 30 ? (
                 <div className="icon-recommendation">
                    <img src="/icons/obesity.png" alt="Obesity" />
                    <p>High Risk of Heart Disease</p>
                 </div>
               ) : null}

              {userData.age >= 40 ? (
              <div className="icon-recommendation">
                  <img src="/icons/age-risk.png" alt="Age Risk" />
                  <p>Higher Risk for Cardiovascular Diseases</p>
              </div>
              ) : null}
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