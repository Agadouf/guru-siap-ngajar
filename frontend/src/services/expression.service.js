import api from "./api";

export const getExpressions = async () => {
  const response = await api.get("/expressions");
  return response.data.data;
};

export const createExpression = async (data) => {
  const response = await api.post("/expressions", data);
  return response.data.data;
};

export const updateExpression = async (id, data) => {
  const response = await api.put(`/expressions/${id}`, data);
  return response.data.data;
};

export const deleteExpression = async (id) => {
  await api.delete(`/expressions/${id}`);
};