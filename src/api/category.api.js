import api from "./axios";

/* ===============================
   READ
   =============================== */
export const getCategories = (pincode = "", admin = false) => {
  return api.get(`/categories?pincode=${pincode}&admin=${admin}`);
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
