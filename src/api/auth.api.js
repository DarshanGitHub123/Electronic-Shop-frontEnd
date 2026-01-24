import api from "./axios";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const registerAdminUser = (data) => api.post("/auth/register/admin", data);
export const googleLogin = (data) => api.post("/auth/google", data);
