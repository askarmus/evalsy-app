import apiClient from "@/helpers/apiClient";

export const getInvitations = async (jobId: string) => {
  const response = await apiClient.get(`/invitation/getall/${jobId}`);
  return response.data.data;
};

export const getInvitationDetails = async (invitationId: string) => {
  const response = await apiClient.get(`/invitation/details/${invitationId}`);
  return response.data.data;
};

// Send a new invitation
export const sendInvitation = async (payload: {
  jobId: string;
  name: string;
  email: string;
  message: string;
  expires: string;
  interviwerId: string;
}) => {
  const response = await apiClient.post("/invitation/send", payload);
  return response.data.data;
};
