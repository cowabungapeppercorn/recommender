import React, { useState, useEffect } from 'react';
import { decode } from 'jsonwebtoken';

import BackendApi from '../backendApi';
import Routes from './Routes/Routes';
import NavBar from './NavBar/NavBar';
import { UserContext } from '../userContext';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function getCurrentUser() {
    const token = localStorage.getItem("token");
    try {
      setIsLoading(true);
      let { identity } = decode(token);
      console.log("IDENTITY --->", identity);
      let res = await BackendApi.getUser(identity);
      console.log("RES --->", res);
      setCurrentUser(res.username);
      setIsLoading(false);
    } catch (e) {
      setCurrentUser(null);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    debugger;
    getCurrentUser();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setCurrentUser(null);
  }

  if (isLoading) return <h1>Loading...</h1>;

  return (
    !isLoading && (
    <div className="App">
      <UserContext.Provider value={currentUser}>
        <NavBar handleLogout={handleLogout}/>
        <h1>{currentUser}</h1>
        <Routes getCurrentUser={getCurrentUser}/>
      </UserContext.Provider>
    </div>
    )
  );
}

export default App;
