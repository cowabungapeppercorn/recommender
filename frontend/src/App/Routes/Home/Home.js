import React, { useContext } from 'react';
import { UserContext } from '../../../userContext';

function Home() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className='container'>
      <div className='row mt-5 justify-content-center'>
        <h1>Welcome to Recommender</h1>
      </div>
      {currentUser && (
        <div className='row my-3 justify-content-center'>
          <h3>sup {currentUser.username}</h3>
        </div>
      )}
    </div>
  )
}

export default Home;