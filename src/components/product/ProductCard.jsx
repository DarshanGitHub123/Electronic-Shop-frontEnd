import { useCart } from "../../context/CartContext";
import { Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Find if this product is in cart
  const cartItem = cart.find(item => item.product?._id === product._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product._id);
  };

  const handleIncrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      await updateQuantity(cartItem._id, quantity + 1);
    }
  };

  const handleDecrement = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (quantity === 1) {
        await removeFromCart(cartItem._id);
      } else {
        await updateQuantity(cartItem._id, quantity - 1);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isHovered && product.images?.length > 1) {
      interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % product.images.length);
      }, 1000); // Change image every 1 second
    } else {
      setActiveImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, product.images]);

  // Discount calculation
  const discount = product.discount || 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-slate-700 ${isOutOfStock ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
          {/* Product Image */}
          {product.images?.[0] ? (
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className={`w-full h-full object-contain p-2 transition-opacity duration-500 ${isOutOfStock ? 'grayscale' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && !isOutOfStock && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
              {discount}% OFF
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl border border-red-500/50">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.price}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₹{Math.floor(product.price * (1 + discount / 100))}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-3 pt-0">
        {/* Add to Cart Button / Counter */}
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105'
              }`}
          >
            {isOutOfStock ? (
              <span className="text-[10px] uppercase tracking-widest">Unavailable</span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        ) : (
          <div className={`flex items-center justify-between rounded-lg overflow-hidden shadow-md ${isOutOfStock ? 'bg-gray-400 text-white opacity-50' : 'bg-blue-600 text-white'}`}>
            <button
              onClick={handleDecrement}
              disabled={isOutOfStock}
              className="px-3 py-2 hover:bg-black/10 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold px-4">{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={isOutOfStock || quantity >= product.stock}
              className={`px-3 py-2 transition-colors ${isOutOfStock || quantity >= product.stock ? 'opacity-20 cursor-not-allowed' : 'hover:bg-black/10'}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
