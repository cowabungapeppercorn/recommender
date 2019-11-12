import React, { useState } from 'react';
import BackendApi from '../../../backendApi';
import { Form, Button, Alert } from 'react-bootstrap';

function RegisterForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formType, setFormType] = useState('login');
  const [errors, setErrors] = useState([]);

  async function handleRegister(evt) {
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
      return setErrors([e.response.data.msg]);
    }
  };

  async function handleLogin(evt) {
    evt.preventDefault();

    if (!username || !password) {
      return setErrors(["Must enter a valid username and password."]);
    }

    const user = {
      username,
      password
    };

    try {
      await BackendApi.login(user);
      props.history.push('/');
    } catch (e) {
      return setErrors([e.response.data.msg]);
    }
  };

  function changeForm() {
    if (formType === "login") {
      setFormType("register");
    } else {
      setFormType("login");
    }
  };

  const errorAlerts = (
    <div>
      <h1>WTF</h1>
      <Alert variant='danger'>{errors}</Alert>
    </div>
  );

  const form = (
    <Form onSubmit={formType === "login" ? handleLogin : handleRegister}>
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
      <Button type="submit">
        {formType === "login" ? "Login" : "Sign Up"}
      </Button>
    </Form>
  );

  const changeFormBtn = (
    <Button variant="info" onClick={changeForm}>
      {formType === "login" ? "Register" : "Login"}
    </Button>
  )

  return (
    <div>
      <h1>{formType === "login" ? "Login" : "Register"}</h1>
      {errors.length > 0 && errorAlerts}
      {form}
      {changeFormBtn}
    </div>
  )
}

export default RegisterForm;