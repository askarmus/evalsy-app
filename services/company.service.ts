import apiClient from "@/helpers/apiClient";

export const getCompanySettings = async () => {
  const response = await apiClient.get("/company/get");
  return response.data.data;
};

export const saveCompanySettings = async (payload: any) => {
  const response = await apiClient.post("/company/createOrUpdate", payload);
  return response.data.data;
};

export const upload = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data; // Return the uploaded file URL
};
