import apiClient from "@/helpers/apiClient";

// Fetch all invitations for a specific job
export const getInvitations = async (jobId: string) => {
  const response = await apiClient.get(`/invitations/fetch?jobId=${jobId}`);
  return response.data.data;
};

// Send a new invitation
export const sendInvitation = async (payload: {
  jobId: string;
  name: string;
  email: string;
  message: string;
  expires: string;
}) => {
  const response = await apiClient.post("/invitations/send", payload);
  return response.data.data;
};
