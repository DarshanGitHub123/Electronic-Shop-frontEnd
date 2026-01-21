import api from "./axios";

export const getProducts = (search = "") =>
  api.get(`/products?search=${search}`);

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post("/products", data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);
