import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';
import { Form, Button, Alert } from 'react-bootstrap';

function RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('login');
  const [errors, setErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!username || !password) {
      return setErrors(["Must enter a valid username and password."]);
    }

    const newUser = {
      username,
      password
    };

    try {
      await BackendApi.register(newUser);
      props.history.push('/');
    } catch (e) {
      return setErrors(["Username already exists."]);
    }
  }

  function changeForm() {
    if (formType === "login") {
      setFormType("register");
    } else {
      setFormType("login");
    }
  }

  const errorAlerts = (
    <div>
      <h1>WTF</h1>
      <Alert variant='danger'>{errors}</Alert>
    </div>
  );

  const registerForm = (
    <Form onSubmit={handleSubmit}>
      {/* {(errors.length) && errorAlerts} */}
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        >
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button type="submit">Sign Up</Button>
    </Form>
  );

  const loginForm = (
    <h1>LOGIN BRO</h1>
  )

  const submitBtn = (
    <Button variant="info" onClick={changeForm}>
      {formType === "login" ? "Register" : "Login"}
    </Button>
  )

  return (
    <div>
      {errors.length > 0 && errorAlerts}
      {formType === "register" && registerForm}
      {formType === "login" && loginForm}
      {submitBtn}
    </div>
  )
}

export default RegisterForm;