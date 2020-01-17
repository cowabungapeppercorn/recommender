import React, { useState, useEffect } from 'react';
import { decode } from 'jsonwebtoken';

import BackendApi from '../backendApi';
import Routes from './Routes/Routes';
import NavBar from './NavBar/NavBar';
import { UserContext } from '../userContext';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  async function getCurrentUser() {
    const token = localStorage.getItem("token");
    try {
      console.log("DECODED TOKEN ---->", decode(token));
      const { identity } = decode(token);
      const res = await BackendApi.getUser(identity);
      setCurrentUser(res);
    } catch (e) {
      setCurrentUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    async function updateCurrentUser() {
      await getCurrentUser();
    }
    updateCurrentUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  const userContext = {
    currentUser,
    getCurrentUser,
    handleLogout
  }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    !isLoading && (
    <div className="App">
      <UserContext.Provider value={userContext}>
        <NavBar />
        <Routes />
      </UserContext.Provider>
    </div>
    )
  );
};

export default App;
