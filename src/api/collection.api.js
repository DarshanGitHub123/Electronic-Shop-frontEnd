import api from "./axios";

export const getCollections = () => api.get("/collections");

export const createCollection = (data) =>
  api.post("/collections", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCollection = (id, data) =>
  api.put(`/collections/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCollection = (id) =>
  api.delete(`/collections/${id}`);
