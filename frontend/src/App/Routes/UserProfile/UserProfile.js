import React, { useContext } from 'react';
import { UserContext } from '../../../userContext';

function UserProfile() {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="container mt-5">
      <h1>Yo {currentUser.username}! This is your profile!</h1>
    </div>
  )
}

export default UserProfile;