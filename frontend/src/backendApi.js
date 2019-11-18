import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

class BackendApi {
  static async getAllSongs(headers) {
    let res = await axios.get(`${BASE_URL}/songs`, headers);
    return res.data.songs;
  };

  static async addNewSong(newSong, headers) {
    let res = await axios.post(`${BASE_URL}/songs`, newSong, headers);
    return res.data;
  };

  static async getAllAlbums(headers) {
    let res = await axios.get(`${BASE_URL}/albums`, headers);
    return res.data.albums;
  };

  static async addNewAlbum(newAlbum, headers) {
    let res = await axios.post(`${BASE_URL}/albums`, newAlbum, headers);
    return res.data;
  }

  static async getAllArtists(headers) {
    let res = await axios.get(`${BASE_URL}/artists`, headers);
    return res.data.artists;
  };

  static async register(newUser) {
    let res = await axios.post(`${BASE_URL}/users/register`, newUser);
    return res.data.access_token;
  };

  static async login(user) {
    let res = await axios.post(`${BASE_URL}/users/login`, user);
    return res.data.access_token;
  };

  static async getUser(username) {
    let res = await axios.get(`${BASE_URL}/users/${username}`);
    return res.data;
  }
}

export default BackendApi;