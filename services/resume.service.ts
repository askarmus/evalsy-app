import apiClient from "@/helpers/apiClient";

export const fetchResumes = async (jobId: string) => {
  const response = await apiClient.get(`/resume/get/${jobId}`);
  return response.data.resumes || [];
};

export const uploadResume = async (jobId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post(`/resume/upload/${jobId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data.resumes;
};

export const deleteResume = async (jobId: string, resumeId: string) => {
  const response = await apiClient.delete(`/resume/delete/${jobId}/${resumeId}`);
  return response.data.resumes;
};
