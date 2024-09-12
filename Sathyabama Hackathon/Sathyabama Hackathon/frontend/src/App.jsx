import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Doctorside from './components/Doctor-side';
import Details from './components/Details';
import User from "./components/User/User.jsx";
const App = () => {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/"element={<Login/>}/>
        <Route path="/userpage" element={<User/>} /> 
        <Route path="/doctor" element={<Doctorside />} /> 
        <Route path="/details" element={<Details />} /> 
=======
        <Route path="/" element={<Login />} /> 
        <Route path="/doctor" element={<Doctorside />} /> 
        <Route path="/details" element={<Details />} /> 
        <Route path="/user" element={<User/>} /> 
>>>>>>> 71aa42fcf9e8afc632c7a15cdfca12f86ce255a2
      </Routes>
    </Router>
  );
} 

export default App;
