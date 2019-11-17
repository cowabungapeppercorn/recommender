import React from 'react';
import { UserContext } from '../../../userContext';

function Home() {
  return (
    <UserContext.Consumer>
      {currentUser => (
        <div className='container'>
          <div className='row mt-5 justify-content-center'>
            <h1>Welcome to Recommender</h1>
          </div>
          {currentUser && (
            <div className='row my-3 justify-content-center'>
              <h3>sup {currentUser}</h3>
            </div>
          )}
        </div>
      )}
    </UserContext.Consumer>
  )
}

export default Home;