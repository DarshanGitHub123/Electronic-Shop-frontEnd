import api from "./axios";

export const getCoupons = () => api.get("/coupons");

export const createCoupon = (data) => api.post("/coupons", data);

export const updateCoupon = (id, data) =>
    api.put(`/coupons/${id}`, data);

export const toggleCouponStatus = (id) =>
    api.patch(`/coupons/${id}/toggle`);

export const deleteCoupon = (id) =>
    api.delete(`/coupons/${id}`);

export const validateCoupon = (data) =>
    api.post("/coupons/validate", data);
