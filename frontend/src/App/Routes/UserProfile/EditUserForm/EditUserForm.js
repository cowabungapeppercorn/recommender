import React, { useState, useContext } from 'react';
import BackendApi from '../../../../backendApi';
import { Form, Button, Alert } from 'react-bootstrap';
import { UserContext } from '../../../../userContext';

function EditUserForm(props) {
  const { currentUser, getCurrentUser } = useContext(UserContext);
  const username = currentUser.username;
  const [editMode, setEditMode] = useState(false);
  const [first_name, setFirstName] = useState(currentUser.first_name);
  const [last_name, setLastName] = useState(currentUser.last_name);
  const [email, setEmail] = useState(currentUser.email);
  const [errors, setErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };

    if (!username) {
      props.history.push('/');
    }

    try {
      const data = {
        first_name,
        last_name,
        email
      }

      await BackendApi.updateUser(username, data, authHeader)
    } catch(e) {
      return setErrors([e.response.data.msg]);
    }

    getCurrentUser();
    setEditMode(false);
  }

  function toggleEdit() {
    editMode ? setEditMode(false) : setEditMode(true);
  }

  const errorAlerts = (
    <div>
      <h1>WTF</h1>
      <Alert variant='danger'>{errors}</Alert>
    </div>
  );

  const form = (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          disabled
        >
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={first_name}
          onChange={e => setFirstName(e.target.value)}
          disabled={!editMode}
        >
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={last_name}
          onChange={e => setLastName(e.target.value)}
          disabled={!editMode}
        >
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={!editMode}
        >
        </Form.Control>
      </Form.Group>
      <Button type="submit">
        {'Submit'}
      </Button>
    </Form>
  );

  const editModeBtn = (
    <Button className={"my-3"} variant="info" onClick={toggleEdit}>
      {'Edit Profile'}
    </Button>
  );

  return (
    <div>
      <h1>User Info:</h1>
      {errors.length > 0 && errorAlerts}
      {form}
      {editModeBtn}
    </div>
  );
}

export default EditUserForm;