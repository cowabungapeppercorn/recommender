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
      let { identity } = decode(token);
      let res = await BackendApi.getUser(identity);
      setCurrentUser(res.username);
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
  }, [currentUser]);

  function handleLogout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  if (isLoading) return <h1>Loading...</h1>;

  return (
    !isLoading && (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <NavBar handleLogout={handleLogout}/>
        <Routes getCurrentUser={() => getCurrentUser()}/>
      </UserContext.Provider>
    </div>
    )
  );
};

export default App;
