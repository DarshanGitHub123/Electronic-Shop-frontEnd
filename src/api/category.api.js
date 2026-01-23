import api from "./axios";

/* ===============================
   READ
   =============================== */
export const getCategories = () => {
  return api.get("/categories");
};

export const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};


/* ===============================
   CREATE
   =============================== */
export const createCategory = (data) => {
  return api.post("/categories", data);
};

/* ===============================
   UPDATE
   =============================== */
export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

/* ===============================
   DELETE
   =============================== */
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
