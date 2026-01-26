import api from "./axios";

export const getBanners = () => api.get("/banners");
export const createBanner = (data) => api.post("/banners", data);
export const updateBanner = (id, data) => api.put(`/banners/${id}`, data);
export const updateBannerRanks = (bannerRanks) => api.put("/banners/ranks", { bannerRanks });
export const deleteBanner = (id) => api.delete(`/banners/${id}`);
