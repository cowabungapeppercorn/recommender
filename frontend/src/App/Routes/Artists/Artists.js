import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';

function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    async function _getArtists() {
      try {
        let res = await BackendApi.getAllArtists(authHeader);
        setArtists(res);
      } catch (err) {
        console.log(err);
      }
    }
    _getArtists();
  }, []);

  const artistList = (
    <ul>
      {artists.map(a => {
        return <li key={a.id}>{a.name}</li>
      })}
    </ul>
  );

  return (
    <div className="container">
      {artists.length > 0 && (
        artistList
      )}
      {(artists.length <= 0) && (
        <h1>No albums sucker</h1>
      )}
    </div>
  );
}

export default Artists;