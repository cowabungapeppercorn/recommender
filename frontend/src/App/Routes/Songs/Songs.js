import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';
import NewSongFrom from '../Songs/NewSongForm/NewSongForm';

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
      <h2>All Songs</h2>
      <NewSongFrom />
      {songs.length > 0 ?
        songList
      :
        <h1>No songs sucker</h1>
      }
    </div>
  );
}

export default Songs;