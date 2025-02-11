import apiClient from "@/helpers/apiClient";

export const get10InterviewResult = async () => {
  const response = await apiClient.get("/dashboard/interview-results?limit=4");
  return response.data.data;
};
