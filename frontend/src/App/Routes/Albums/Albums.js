import React, { useState, useEffect } from 'react';
import BackendApi from '../../../backendApi';

function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function _getAlbums() {
      try {
        let res = await BackendApi.getAllAlbums();
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
      {albums.length > 0 && (
        albumList
      )}
      {(albums.length <= 0) && (
        <h1>No albums sucker</h1>
      )}
    </div>
  );
}

export default Albums;