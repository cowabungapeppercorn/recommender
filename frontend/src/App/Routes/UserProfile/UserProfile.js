import React, { useContext } from 'react';
import { UserContext } from '../../../userContext';
import EditUserForm from './EditUserForm/EditUserForm';

function UserProfile(props) {
  const { currentUser } = useContext(UserContext);

  return (
    <div className="container mt-5">
      <h1>Yo {currentUser.username}! This is your profile!</h1>
      <EditUserForm {...props} />
    </div>
  )
}

export default UserProfile;