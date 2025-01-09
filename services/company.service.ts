import apiClient from "@/helpers/apiClient";

export const getCompanySettings = async () => {
  const response = await apiClient.get("/company/settings");
  return response.data;
};

export const saveCompanySettings = async (payload: any) => {
  const response = await apiClient.post("/company/settings", payload);
  return response.data;
};

export const uploadLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/api/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.url; // Return the uploaded file URL
};
