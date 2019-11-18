import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import BackendApi from '../../../../backendApi';

function NewAlbumForm(props) {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [artist, setArtist] = useState("");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    const newAlbum = {
      title,
      year,
      artist
    };

    if (!newAlbum.title || !newAlbum.year || !newAlbum.artist) {
      return setErrors(["Must fill out all 3 fields."]);
    };

    try {
      const { albums } = await BackendApi.addNewAlbum(newAlbum, authHeader);
      setTitle("");
      setYear("");
      setArtist("");
      props.setAlbums(albums)
    } catch (e) {
      console.log(e);
      return setErrors([e.response.data.msg]);
    }
    props.history.push('/albums');
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
        <Form.Label className={"mx-2"}>title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className={"mx-2"}>
        <Form.Label className={"mx-2"}>year</Form.Label>
        <Form.Control
          type="text"
          value={year}
          onChange={e => setYear(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className={"mx-2"}>
        <Form.Label className={"mx-2"}>artist</Form.Label>
        <Form.Control
          type="text"
          value={artist}
          onChange={e => setArtist(e.target.value)}
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

export default NewAlbumForm;