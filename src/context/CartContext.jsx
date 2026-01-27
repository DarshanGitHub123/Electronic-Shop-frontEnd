import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cart.api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    const res = await fetchCart();
    setCart(res.data);
  };

  const addToCart = async (productId) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    const res = await addItemToCart(productId);
    setCart(res.data);
  };

  const updateQuantity = async (itemId, quantity) => {
    const res = await updateCartItem(itemId, quantity);
    setCart(res.data);
  };

  const removeFromCart = async (itemId) => {
    const res = await removeCartItem(itemId);
    setCart(res.data);
  };

  const clearCart = async () => {
    await clearCartApi();
    setCart([]);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) loadCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
