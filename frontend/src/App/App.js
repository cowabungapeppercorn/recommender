import React, { useState, useEffect } from 'react';
import { decode } from 'jsonwebtoken';

import BackendApi from '../backendApi';
import Routes from './Routes/Routes';
import NavBar from './NavBar/NavBar';
import { UserContext } from '../userContext';

import './App.css';

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

  useEffect(function () {
    try {
      getCurrentUser();
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <NavBar />
        <h1>{currentUser.username}</h1>
        <Routes />
      </UserContext.Provider>
    </div>
  );
}

export default App;
