import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';
import NewAlbumForm from '../Albums/NewAlbumForm/NewAlbumForm';

function Albums(props) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const authHeader = { 'headers': { 'Authorization': 'Bearer ' + token } };
    async function _getAlbums() {
      try {
        let res = await BackendApi.getAllAlbums(authHeader);
        setAlbums(res);
      } catch (err) {
        console.log(err);
      }
    }
    _getAlbums();
  }, []);

  const albumList = (
    <ul>
      {albums.map(a => {
        return <li key={a.id}>{a.title}</li>
      })}
    </ul>
  );

  return (
    <div className="container">
      <h2>All Albums</h2>
      <NewAlbumForm {...props} setAlbums={setAlbums} />
      {albums.length > 0 ? 
        albumList
      :
        <h1>No albums sucker</h1>
      }
    </div>
  );
}

export default Albums;