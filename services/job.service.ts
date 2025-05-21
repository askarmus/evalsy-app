import apiClient from '@/helpers/apiClient';

export const getAll = async () => {
  const response = await apiClient.get('/job/getall');
  return response.data;
};

export const generateQuestions = async (payload) => {
  const response = await apiClient.post('/generate-questions', payload);
  return response.data;
};

export const createJob = async (payload) => {
  const response = await apiClient.post('/job/create', payload);
  return response.data;
};

export const updateJob = async (payload) => {
  const response = await apiClient.put('/job/update', payload);
  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await apiClient.delete(`/job/delete/${jobId}`);
  return response.data;
};

export const getAllJobs = async () => {
  const response = await apiClient.get('/job/getall');
  return response.data.data;
};

export const getJobById = async (jobId: string) => {
  const response = await apiClient.get(`/job/${jobId}`);
  return response.data.data;
};

export const generateJobDescriptionFromAI = async (payload: { jobTitle: string; focusPrompt?: string }) => {
  const response = await apiClient.post('/job/generate-job-description', payload);
  return response.data.jobDescription;
};
