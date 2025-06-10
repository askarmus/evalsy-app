import apiClient from '@/helpers/apiClient';
import axios from 'axios';

export const createJobApplication = async (payload: any) => {
  const response = await apiClient.post('/job/apply', payload);
  return response.data.data;
};

export const getJobById = async (jobId: string) => {
  const response = await axios.get(`http://localhost:5000/job/apply/${jobId}`);
  return response.data.data;
};
