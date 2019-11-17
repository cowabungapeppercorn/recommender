import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

class BackendApi {
  static async getAllSongs(headers) {
    let res = await axios.get(`${BASE_URL}/songs`, headers);
    return res.data.songs;
  };

  static async getAllAlbums() {
    let res = await axios.get(`${BASE_URL}/albums`);
    return res.data.albums;
  };

  static async getAllArtists() {
    let res = await axios.get(`${BASE_URL}/artists`);
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