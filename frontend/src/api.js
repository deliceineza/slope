import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'https://slope-4.onrender.com';
export const isApiUrlConfigured = Boolean(import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL);

if (!isApiUrlConfigured) {
  console.error('API base URL env var not set. Set VITE_API_URL=https://slope-4.onrender.com in Render environment variables.');
}

console.log('Using API base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeSlope = async (slope) => {
  const response = await api.post('/analyze', { slope });
  console.log('analyzeSlope response:', response.data);
  return response.data;
};

export default api;
