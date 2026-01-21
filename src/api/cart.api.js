import api from "./axios";

export const fetchCart = () => api.get("/cart");
export const addItemToCart = (productId) =>
  api.post("/cart", { productId });

export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });

export const removeCartItem = (itemId) =>
  api.delete(`/cart/${itemId}`);

export const clearCart = () => api.delete("/cart");
