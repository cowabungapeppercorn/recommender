import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';
import NewSongForm from '../Songs/NewSongForm/NewSongForm';
import { Row } from 'react-bootstrap';

function Songs(props) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': token } };
    async function _getSongs() {
      try {
        let res = await BackendApi.getAllSongs(authHeader);
        console.log("SONGS ---->", res);
        setSongs(res);
      } catch (err) {
        console.log(err);
      }
    }
    _getSongs();
  }, []);

  const songList = (
    <ul>
      {songs.map(s => {
        return <li key={s.id}>{s.title}</li>
      })}
    </ul>
  );

  return (
    <div className="container mt-5">
      <h2>All Songs</h2>
      <Row className="justify-content-center">
        <NewSongForm {...props} setSongs={setSongs} />
      </Row>
      {songs.length > 0 ?
        songList
        :
        <h1>No songs sucker</h1>
      }
    </div>
  );
}

export default Songs;