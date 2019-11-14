import React, { useState, useEffect } from 'react';
import Routes from './Routes/Routes';
import NavBar from './NavBar/NavBar';
import { decode } from 'jsonwebtoken';
import './App.css';
import BackendApi from '../backendApi';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  async function getCurrentUser() {
    const token = localStorage.getItem("token");
    try {
      let username = decode(token);
      let res = await BackendApi.getUser(username);
      setCurrentUser(res);
    } catch (e) {
      setCurrentUser(null);
    }
  }

  useEffect(function() {
    try {
      getCurrentUser();
    } catch(e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="App">
      <NavBar />
      <h1>{currentUser}</h1>
      <Routes />
    </div>
  );
}

export default App;
