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
      let { identity } = decode(token);
      let res = await BackendApi.getUser(identity.username);
      setCurrentUser(res.username);
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
  }, [currentUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <NavBar handleLogout={handleLogout}/>
        <h1>{currentUser}</h1>
        <Routes getCurrentUser={() => getCurrentUser()}/>
      </UserContext.Provider>
    </div>
  );
}

export default App;
