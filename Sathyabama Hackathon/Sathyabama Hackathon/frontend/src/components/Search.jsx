import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Search.css";

const Search = (props) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const filtered = results.filter((doctor) =>
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.Hospital_Name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults([]);
    }
  }, [query, results]);



  const handleSearch = async (event) => {
    event.preventDefault();

    if (!query.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/user/searchDoctors?query=${query.toLowerCase()}`);
      setResults(response.data.doctors);
      setSearchPerformed(true);
    } catch (err) {
      toast.error('Error while searching');
    }
  };

  const handleBookAppointment = async () => {
    if (!appointmentTime || !appointmentDate || !selectedDoctor) {
      toast.error('Please select a doctor, date, and appointment time.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        throw new Error('No token found');
      }

      const username = props.userData.name
  
      const response = await axios.post('http://localhost:5000/api/user/bookAppointment', {
        username:username,
        doctorName: selectedDoctor.name,
        doctorType: selectedDoctor.Specialized,
        time: appointmentTime,
        date: appointmentDate,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      toast.success('Appointment request sent to the doctor!');
  
      setSelectedDoctor(null);
      setAppointmentTime('');
      setAppointmentDate('');
  
    } catch (error) {
      toast.error(`Error while sending the appointment request: ${error.message}`);
      console.error('Error:', error);
    }
  };
  
  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setFilteredResults([]);
    setSearchPerformed(false);
  };

  return (
    <div className="search-container">
  <Toaster />
  <div className="search-bar">
    <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search doctors by name, specialization, or hospital"
      />
      <button type="submit">Search</button>
      <button type="button" onClick={clearSearch} className="clear-search-btn">Clear</button>
    </form>
  </div>

      <div className="results-container">
        {searchPerformed && filteredResults.length > 0 ? (
          filteredResults.map((doctor) => (
            <div key={doctor._id} className={`doctor-card ${selectedDoctor === doctor ? 'hidden' : ''}`}>
              <span className="close-icon" onClick={clearSearch}>&times;</span>
              <div>
                <h3>{doctor.name}</h3>
                <p>Specialization: {doctor.Specialized}</p>
                <p>Hospital: {doctor.Hospital_Name}</p>
              </div>
              <button onClick={() => handleDoctorClick(doctor)}>Book Appointment</button>
            </div>
          ))
        ) : searchPerformed && filteredResults.length === 0 ? (
          <p className="doctor-card">No results found</p>
        ) : null}
      </div>

      {selectedDoctor && (
        <>
          <div className="blur-background" onClick={() => setSelectedDoctor(null)}></div>
          <div className="appointment-popup">
            <span className="close-icon" onClick={() => setSelectedDoctor(null)}>&times;</span>
            <h3>Book Appointment with {selectedDoctor.name}</h3>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              placeholder="Select date"
            />
            <input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              placeholder="Select time"
            />
            <button onClick={handleBookAppointment}>Book Appointment</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
