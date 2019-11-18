import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';
import NewArtistForm from '../Artists/NewArtistForm/NewArtistForm';

function Artists(props) {
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
      <h2>All Artists</h2>
      <NewArtistForm {...props} setArtists={setArtists} />
      {artists.length > 0 ?
        artistList
      :
        <h1>No albums sucker</h1>
      }
    </div>
  );
}

export default Artists;