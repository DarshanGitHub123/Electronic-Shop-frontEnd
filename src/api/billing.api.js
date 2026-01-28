import api from "./axios";

// Get all bills
export const getAllBills = () => api.get("/billings");

// Get bill by ID
export const getBillById = (id) => api.get(`/billings/${id}`);

// Get bill by order ID
export const getBillByOrderId = (orderId) => api.get(`/billings/order/${orderId}`);

// Create bill for an order
export const createBill = (orderId) => api.post(`/billings/create/${orderId}`);

// Delete bill
export const deleteBill = (id) => api.delete(`/billings/${id}`);
