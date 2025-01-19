import apiClient from "@/helpers/apiClient";

export const getAll = async () => {
  const response = await apiClient.get("/job/getall");
  return response.data;
};

export const generateQuestions = async (payload) => {
  const response = await apiClient.post("/generate-questions", payload);
  return response.data;
};

export const createJob = async (payload) => {
  const response = await apiClient.post("/job/create", payload);
  return response.data;
};

export const getAllJobs = async () => {
  const response = await apiClient.get("/job/getall");
  return response.data.data;
};
