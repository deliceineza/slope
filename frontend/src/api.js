import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const analyzeSlope = async (slope, token) => {
  const response = await api.post('/analyze', { slope }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;
