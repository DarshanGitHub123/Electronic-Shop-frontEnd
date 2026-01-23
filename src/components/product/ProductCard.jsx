import { useCart } from "../../context/CartContext";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Find if this product is in cart
  const cartItem = cart.find(item => item.product?._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = async () => {
    await addToCart(product._id);
  };

  const handleIncrement = async () => {
    if (cartItem) {
      await updateQuantity(cartItem._id, quantity + 1);
    }
  };

  const handleDecrement = async () => {
    if (cartItem) {
      if (quantity === 1) {
        await removeFromCart(cartItem._id);
      } else {
        await updateQuantity(cartItem._id, quantity - 1);
      }
    }
  };

  // Calculate discount percentage (mock for demo)
  const discount = Math.floor(Math.random() * 30) + 10;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-slate-700">
      {/* Image Container */}
      <div className="relative h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl">📱</span>
        </div>

        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
          {discount}% OFF
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white line-clamp-2 mb-1">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{product.price}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{Math.floor(product.price * (1 + discount / 100))}
          </span>
        </div>

        {/* Add to Cart Button / Counter */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        ) : (
          <div className="flex items-center justify-between bg-blue-600 text-white rounded-lg overflow-hidden shadow-md">
            <button
              onClick={handleDecrement}
              className="px-3 py-2 hover:bg-blue-700 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold px-4">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-3 py-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
