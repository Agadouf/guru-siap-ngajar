import api from "./api";

export const uploadVideo = async (expressionId, file) => {
  const formData = new FormData();

  formData.append("video", file);

  const response = await api.post(
    `/expressions/${expressionId}/video`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};