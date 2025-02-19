import apiClient from "@/helpers/apiClient";

export const updateQuestion = async (payload: { invitationId: string; questionId: string; recordedUrl: string; startTime: Date; endTime: Date }) => {
  const response = await apiClient.post("/interview/updatequestion", payload);
  return response.data.data;
};

export const updateScreeshot = async (payload: { invitationId: string; fileName: string }) => {
  const response = await apiClient.post("/interview/updatequestion", payload);
  return response.data.data;
};

export const startInterview = async (payload: { invitationId: string }) => {
  const response = await apiClient.post("/interview/start", payload);
  return response.data.data;
};

export const sendResultEmail = async (file: File | null, interviewResultId: string, isSendEmail: boolean, emails: string[] | null) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  formData.append("InterviewResultId", interviewResultId);
  formData.append("email", JSON.stringify(emails));
  formData.append("isSendEmail", JSON.stringify(isSendEmail));

  const response = await apiClient.post("/interview/result/sendemail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data.downloadUrl; // Return the uploaded file URL
};

export const getAllInterviewResult = async () => {
  const response = await apiClient.get("/interview/result/all");
  return response.data.data;
};

export const getInterviewResultById = async (id: string) => {
  const response = await apiClient.get(`/interview/fetch/${id}`);
  return response.data.data;
};
