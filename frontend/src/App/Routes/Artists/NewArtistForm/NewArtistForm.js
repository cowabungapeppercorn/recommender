import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import BackendApi from '../../../../backendApi';

function NewArtistForm(props) {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    const newArtist = {
      name,
      logoUrl
    };

    if (!newArtist.name) {
      return setErrors(["Must fill out name field."]);
    };

    try {
      const { artists } = await BackendApi.addNewArtist(newArtist, authHeader);
      setName("");
      setLogoUrl("");
      props.setArtists(artists)
    } catch (e) {
      console.log(e);
      return setErrors([e.response.data.msg]);
    }
    props.history.push('/artists');
  };

  const errorAlerts = (
    <div>
      <h1>WTF</h1>
      <Alert variant='danger'>{errors}</Alert>
    </div>
  );

  const form = (
    <Form inline onSubmit={handleSubmit}>
      <Form.Group className={"mx-2"}>
        <Form.Label className={"mx-2"}>name</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className={"mx-2"}>
        <Form.Label className={"mx-2"}>logo url</Form.Label>
        <Form.Control
          type="text"
          value={logoUrl}
          onChange={e => setLogoUrl(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Button type="submit">sup</Button>
    </Form>
  );

  return (
    <div>
      {errors.length > 0 && errorAlerts}
      {form}
    </div>
  );
}

export default NewArtistForm;