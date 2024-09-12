import React, { useState, useEffect } from 'react';
import './User.css';
import profile from '../../assets/messi-ronaldo-fb.jpg';

const User = () => {
  const appointments = [
    {
      id: 1,
      type: "Dentist",
      doctor: "Dr. Gloria Curtis",
      time: "10:00 AM",
      color: "#A083FF",
    },
    {
      id: 2,
      type: "Cardiologist",
      doctor: "Dr. Craig Geidt",
      time: "12:00 PM",
      color: "#67A6FF",
    },
    {
      id: 3,
      type: "Oculist",
      doctor: "Dr. Erin Herwitz",
      time: "04:00 PM",
      color: "#F9CC5C",
    },
    {
      id: 4,
      type: "Traumatologist",
      doctor: "Dr. Terry Aminoff",
      time: "07:00 PM",
      color: "#FF6F91",
    },
  ];

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

      // Fill empty slots before the first day
      for (let i = 0; i < (startDay + 6) % 7; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
      }

      // Fill the days of the month
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
        <h2>Doctor's Appointments</h2>

        {/* Calendar Section */}
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
      </div>
    );
  };  

  return (
    <div className="user-main-container">
      <div className="user-left">
        <h2>MedX</h2>
      </div>

    <div className="user-right-container">
      <div className="user-center">
      <div className="user-profile">
          <div className="user-card">
            <div className="user-img-container">
              <img src={profile} alt="Profile" />
            </div>
            <h2 className='card-username'>Username</h2>
            <div className="patient-details">
              <div className="patient-profile">
                <h2>24</h2>
                <span>Years</span>
                <h2>185cm</h2>
                <span>Height</span>
              </div>
              <div className="patient-profile">
                <h2>A+</h2>
                <span>Blood</span>
                <h2>91Kg</h2>
                <span>Weight</span>
              </div>
            </div>
          </div>

            <div className="activity-top">
              <table>
                <tbody>
                  <div className="user-section">
                  <h3>Weight-Loss</h3>
                  <h3>Weight-Gain</h3>
                  </div>
                  <tr>
                    <td>Calories: 2200</td>
                    <td>Calories: 3000</td>
                  </tr>
                  <tr>
                    <td>Carbs: 120g</td>
                    <td>Carbs: 180g</td>
                  </tr>
                  <tr>
                    <td>Protein: 140g</td>
                    <td>Protein: 130g</td>
                  </tr>
                  <tr>
                    <td>Fats: 80g</td>
                    <td>Fats: 85g</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        <div className="activity-bottom">
                <div className="bmi-det-div">
                    <div className="bmi-l">
                       <h2>BMI</h2>
                       <h2>21</h2>
                    </div>
            <div  className="bmi-r">
                 <h5><span>&lt;18: Low</span></h5>
                 <h5><span>18-24: Normal</span></h5>
                 <h5><span>&gt;24: High</span></h5>
            </div>
           </div>
            </div>
      </div>

      <div className="user-right">
        <CalendarAppointments/>
      </div>
      </div>
   </div>
  );
};


export default User;