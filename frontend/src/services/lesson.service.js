import api from "./api";

export const getLessons = async () => {
  const response = await api.get("/lessons");
  return response.data.data;
};

export const createLesson = async (data) => {
  const response = await api.post("/lessons", data);
  return response.data.data;
};

export const updateLesson = async (id, data) => {
  const response = await api.put(`/lessons/${id}`, data);
  return response.data.data;
};

export const deleteLesson = async (id) => {
  await api.delete(`/lessons/${id}`);
};