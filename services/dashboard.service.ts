import apiClient from "@/helpers/apiClient";

export const get10InterviewResult = async () => {
  const response = await apiClient.get("/dashboard/interview-results?limit=4");
  return response.data.data;
};

export const hiringPipelineOverview = async () => {
  const response = await apiClient.get("/dashboard/hiring-pipeline-overview");
  return response.data.data;
};

export const trendByJobSeniority = async () => {
  const response = await apiClient.get("/dashboard/trend-by-job-seniority");
  return response.data.data;
};
