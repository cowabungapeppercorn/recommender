import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';

function Songs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    async function _getSongs() {
      try {
        let res = await BackendApi.getAllSongs(authHeader);
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
    <div className="container">
      {songs.length > 0 && (
        songList
      )}
      {songs.length <= 0 && (
        <h1>No songs sucker</h1>
      )}
    </div>
  );
}

export default Songs;