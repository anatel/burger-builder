import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-builder-954d0.firebaseio.com/'
});

export default instance;
