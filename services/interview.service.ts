import apiClient from '@/helpers/apiClient';
import axios from 'axios';

export const updateQuestion = async (payload: { invitationId: string; questionId: string; recordedUrl: string; code?: string; output?: string }) => {
  const response = await apiClient.post('/interview/updatequestion', payload);
  return response.data.data;
};

export const updateScreeshot = async (payload: { invitationId: string; fileName: string }) => {
  const response = await apiClient.post('/interview/updateScreenshot', payload);
  return response.data.data;
};

export const startInterview = async (payload: { invitationId: string }) => {
  const response = await apiClient.post('/interview/start', payload);
  return response.data.data;
};

export const endInterview = async (payload: { invitationId: string }) => {
  const response = await apiClient.post('/interview/endInterview/', payload);
  return response.data.data;
};

export const sendResultEmail = async (payload: { interviewResultId: string; sendEmail: boolean; emails: string[] | null }) => {
  const response = await apiClient.post('/interview/result/sendemail', payload);
  return response.data.data.uploadedFileUrl;
};

export const getAllInterviewResult = async () => {
  const response = await apiClient.get('/interview/result/all');
  return response.data.data;
};

export const getInterviewResultById = async (id: string) => {
  const response = await apiClient.get(`/interview/fetch/${id}`);
  return response.data.data;
};

export const getUploadUrl = async (invitationId: string, questionId: string) => {
  const response = await apiClient.get('/upload-url', {
    params: { invitationId, questionId },
  });
  return response.data;
};

export const uploadRecordingBlob = async (uploadUrl: string, blob: Blob) => {
  return await axios.put(uploadUrl, blob, {
    headers: {
      'Content-Type': 'audio/webm',
      'Content-Range': `bytes 0-${blob.size - 1}/${blob.size}`,
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    withCredentials: false,
  });
};

export const logFraudEvent = async (payload: { invitationId: string; type: string; details?: string }) => {
  await apiClient.post('/interview/logFraudEvent', {
    invitationId: payload.invitationId,
    event: {
      type: payload.type,
      timestamp: Date.now(),
      details: payload.details,
    },
  });
};
