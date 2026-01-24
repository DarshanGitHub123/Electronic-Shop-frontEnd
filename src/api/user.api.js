import api from "./axios";

export const getAllUsers = () => api.get("/users");
