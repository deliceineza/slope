import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeSlope = async (slope) => {
  const response = await api.post('/analyze', { slope });
  return response.data;
};

export default api;
