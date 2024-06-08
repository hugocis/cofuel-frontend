// src/utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://cofuel-backend-63452a272e1b.herokuapp.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
