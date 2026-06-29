import api from '../api';

export const predictLandPrice = async (payload) => {
  const response = await api.post('/predict', payload);
  return response.data;
};
