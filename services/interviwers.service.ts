import apiClient from "@/helpers/apiClient";

// Fetch all interviewers
export const getAllInterviewers = async () => {
  const response = await apiClient.get("/interviewer/getall");
  return response.data.data;
};

// Create a new interviewer
export const createInterviewer = async (payload: {
  name: string;
  jobTitle: string;
  biography: string;
  photoUrl?: string;
}) => {
  const response = await apiClient.post("/interviewer/create", payload);
  return response.data;
};

// Update an existing interviewer
export const updateInterviewer = async (
  id: string,
  payload: {
    name: string;
    jobTitle: string;
    biography: string;
    photoUrl?: string;
  }
) => {
  const response = await apiClient.put(`/interviewer/update/${id}`, payload);
  return response.data;
};

// Delete an interviewer
export const deleteInterviewer = async (id: string) => {
  const response = await apiClient.delete(`/interviewer/delete/${id}`);
  return response.data;
};

// Fetch a specific interviewer by ID
export const getInterviewerById = async (id: string) => {
  const response = await apiClient.get(`/interviewer/get/${id}`);
  return response.data.data;
};
