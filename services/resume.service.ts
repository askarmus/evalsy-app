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

export const createResume = async (payload: { resumeId: string; jobId: string; name: string; url: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/resume/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // ✅ sends cookies (including accessToken)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create resume");
  }

  return await response.json();
};

export const deleteResume = async (jobId: string, resumeId: string) => {
  const response = await apiClient.delete(`/resume/delete/${jobId}/${resumeId}`);
  return response.data.resumes;
};

export const processResumeById = async (resumeId: string, jobId: string) => {
  const response = await apiClient.post("/resume/process-resume", {
    resumeId,
    jobId,
  });

  return response.data.analysis;
};
