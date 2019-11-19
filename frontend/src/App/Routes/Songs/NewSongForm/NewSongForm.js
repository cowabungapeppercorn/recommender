import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import BackendApi from '../../../../backendApi';

function NewSongForm(props) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [errors, setErrors] = useState([]);

  async function handleSubmit(evt) {
    evt.preventDefault();
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    const newSong = {
      title,
      artist,
      album
    };

    if (!newSong.title || !newSong.artist || !newSong.album) {
      return setErrors(["Must fill out all 3 fields."]);
    };

    try {
      const { songs } = await BackendApi.addNewSong(newSong, authHeader);
      setTitle("");
      setArtist("");
      setAlbum("");
      setErrors([]);
      props.setSongs(songs)
    } catch (e) {
      console.log(e);
      return setErrors([e.response.data.msg]);
    }
    props.history.push('/songs');
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
        <Form.Label className={"mx-2"}>artist</Form.Label>
        <Form.Control
          type="text"
          value={artist}
          onChange={e => setArtist(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className={"mx-2"}>
        <Form.Label className={"mx-2"}>album</Form.Label>
        <Form.Control
          type="text"
          value={album}
          onChange={e => setAlbum(e.target.value)}
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

export default NewSongForm;