import api from '../api';

export const predictLandPrice = async (payload) => {
  const response = await api.post('/predict', payload);
  console.log('predictLandPrice response:', response.data);
  return response.data;
};
