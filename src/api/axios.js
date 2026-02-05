import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sellix-b.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
