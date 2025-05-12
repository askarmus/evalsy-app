import apiClient from '@/helpers/apiClient';

export const getCreditBalance = async () => {
  const response = await apiClient.get('/credits/balance');
  return response.data.data.credits;
};

export const getCreditHistory = async () => {
  const response = await apiClient.get('/credits/history');
  return response.data.data;
};

export const createCheckoutSession = async (credits: number) => {
  const response = await apiClient.post('/credits/checkout-session', { credits });
  return response.data.url;
};
export const deductCredits = async (payload: { amount: number; type: 'resume' | 'interview'; relatedId?: string }) => {
  const response = await apiClient.post('/credits/deduct', payload);
  return response.data;
};
