import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function NewSongForm() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [errors, setErrors] = useState([]);

  

  return (
    <Form inline>
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
}

export default NewSongForm;