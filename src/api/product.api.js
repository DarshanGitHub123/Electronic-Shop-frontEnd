import api from "./axios";

export const getProducts = (search = "", pincode = "", admin = false) =>
  api.get(`/products?search=${search}&pincode=${pincode}&admin=${admin}`);

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const createProduct = (data) =>
  api.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

