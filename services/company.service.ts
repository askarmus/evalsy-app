import apiClient from "@/helpers/apiClient";

export const getCompanySettings = async () => {
  const response = await apiClient.get("/company/get");
  return response.data.data;
};

export const saveCompanySettings = async (payload: any) => {
  const response = await apiClient.post("/company/createOrUpdate", payload);
  return response.data.data;
};

export const upload = async (file: File, contentType: string = "audio/mpeg") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("contentType", contentType);

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
