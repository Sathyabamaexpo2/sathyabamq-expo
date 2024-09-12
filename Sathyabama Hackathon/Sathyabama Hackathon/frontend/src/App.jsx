import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Doctorside from './components/Doctor-side';
import Details from './components/Details';
import User from './components/User/User';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/"element={<Login/>}/>
        <Route path="/userpage" element={<User/>} /> 
        <Route path="/doctor" element={<Doctorside />} /> 
        <Route path="/details" element={<Details />} /> 
      </Routes>
    </Router>
  );
}

export default App;
