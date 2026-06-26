import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeSlope = async (slope) => {
  const response = await api.post('/analyze', { slope });
  return response.data;
};

export default api;
