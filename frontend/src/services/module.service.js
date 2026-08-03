import api from "./api";

export const getModules = async () => {
  const response = await api.get("/modules");
  return response.data.data;
};

export const createModule = async (data) => {
  const response = await api.post("/modules", data);
  return response.data.data;
};

export const updateModule = async (id, data) => {
  const response = await api.put(`/modules/${id}`, data);
  return response.data.data;
};

export const deleteModule = async (id) => {
  await api.delete(`/modules/${id}`);
};