import api from "./axios";

export const createOrder = (data) => api.post("/orders", data);
export const getMyOrders = () => api.get("/orders/my");
export const getAllOrders = () => api.get("/orders");
export const updateOrderStatus = (id, data) =>
  api.put(`/orders/${id}/status`, data);
export const updateOrderPayment = (id, data) =>
  api.put(`/orders/${id}/payment`, data);
