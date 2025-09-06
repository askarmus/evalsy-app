import apiClient from '@/helpers/apiClient';

export const get10InterviewResult = async () => {
  const response = await apiClient.get('/dashboard/interview-results?limit=3');
  return response.data.data;
};

export const hiringPipelineOverview = async () => {
  const response = await apiClient.get('/dashboard/hiring-pipeline-overview');
  return response.data.data;
};

export const trendByJobSeniority = async () => {
  const response = await apiClient.get('/dashboard/trend-by-job-seniority');
  return response.data.data;
};

export const fetchCoreWidgets = async () => {
  const response = await apiClient.get('/dashboard/core');
  return response.data.data;
};

export type TopJob = {
  jobId: string;
  jobTitle: string;
  avgScore: number;
  interviews: number;
  positiveRate: number; // %
  strongHireRate: number; // %
  invitations: number;
  completionRate: number; // %
  performanceScore: number; // 0..100
};

export const topJobsByPerformance = async (params?: { limit?: number; windowDays?: number; minCompleted?: number }) => {
  const res = await apiClient.get('/dashboard/top-jobs/performance', { params });
  return res.data.data as TopJob[];
};
