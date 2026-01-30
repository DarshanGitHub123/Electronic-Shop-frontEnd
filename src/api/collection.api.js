import api from "./axios";

export const getCollections = (pincode = "", admin = false) =>
  api.get(`/collections?pincode=${pincode}&admin=${admin}`);

export const getCollectionById = (id) => api.get(`/collections/${id}`);

export const createCollection = (data) =>
  api.post("/collections", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCollection = (id, data) =>
  api.put(`/collections/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCollectionRank = (id, rank) =>
  api.put(`/collections/${id}/rank`, { rank });

export const deleteCollection = (id) =>
  api.delete(`/collections/${id}`);


