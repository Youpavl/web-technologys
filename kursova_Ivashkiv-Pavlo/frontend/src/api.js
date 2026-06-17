import axios from 'axios';

// Один axios на весь застосунок, щоб не писати повну адресу щоразу
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export default api;
