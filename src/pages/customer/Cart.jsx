import { useCart } from "../../context/CartContext";
import { createOrder } from "../../api/order.api";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // ✅ SAFE total calculation
  const total = cart.reduce((sum, item) => {
    return (
      sum +
      Number(item.product?.price || 0) *
      Number(item.quantity || 0)
    );
  }, 0);

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    await createOrder({
      items: cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: total,
    });

    await clearCart();
    alert("Order placed successfully");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-semibold text-lg mb-4">Your Cart</h2>

      {cart.length === 0 && (
        <p className="text-sm text-gray-500">Cart is empty</p>
      )}

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center border p-3 mb-2 rounded"
        >
          {/* Product Info */}
          <div>
            <p className="text-sm font-medium">
              {item.product?.name || "Product"}
            </p>
            <p className="text-xs text-gray-500">
              ₹{item.product?.price}
            </p>
          </div>

          {/* Quantity & Remove */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item._id, Number(e.target.value))
              }
              className="w-14 border px-1 text-xs"
            />

            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-500 text-xs"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL + PLACE ORDER */}
      {cart.length > 0 && (
        <div className="mt-4 border-t pt-3">
          <p className="font-semibold mb-2">
            Total: ₹{total}
          </p>

          <button
            onClick={placeOrder}
            className="w-full bg-black text-white py-2 text-sm rounded"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
