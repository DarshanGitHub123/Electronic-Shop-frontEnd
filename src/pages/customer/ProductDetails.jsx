import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/product.api";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id).then(res => setProduct(res.data));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="h-56 bg-gray-200 rounded" />

      <h2 className="font-semibold text-lg">{product.name}</h2>
      <p className="text-sm text-gray-600">{product.description}</p>
      <p className="font-semibold">₹{product.price}</p>

      <p className="text-xs">
        Stock: {product.stock > 0 ? "Available" : "Out of stock"}
      </p>

      <button
        disabled={product.stock === 0}
        onClick={() => addToCart(product._id)}
        className="w-full bg-black text-white py-2 rounded text-sm disabled:opacity-50"
      >
        Add to Cart
      </button>
    </div>
  );
}
