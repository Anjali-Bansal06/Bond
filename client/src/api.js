import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const api = axios.create({ baseURL: API_BASE, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (username, password) => api.post('/api/auth/login', { username, password }).then(r => r.data);
export const registerUser = (username, password) => api.post('/api/auth/register', { username, password }).then(r => r.data);
export const fetchMessages = (room) => api.get(`/api/messages/${room}`).then(r => r.data);
