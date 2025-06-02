import axios from 'axios';

// Placeholder de la URL base del backend
const BASE_URL = 'http://localhost:3000/api'; // Reemplazar cuando esté listo el backend

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
