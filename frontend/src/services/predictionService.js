import api from '../api';

export const predictLandPrice = async (payload, token) => {
  const response = await api.post('/predict', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
