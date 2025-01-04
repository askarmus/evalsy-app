import apiClient from "@/helpers/apiClient";

export const getAll = async () => {
  const response = await apiClient.get("/job/getall");
  return response.data;
};
