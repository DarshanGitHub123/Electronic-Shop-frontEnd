import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border p-3 rounded">
      <div className="h-32 bg-gray-200 mb-2" />
      <h3 className="text-sm">{product.name}</h3>
      <p className="text-xs">₹{product.price}</p>

      <button
        onClick={() => addToCart(product._id)}
        className="w-full bg-black text-white text-xs mt-2 py-1"
      >
        Add to Cart
      </button>
    </div>
  );
}
