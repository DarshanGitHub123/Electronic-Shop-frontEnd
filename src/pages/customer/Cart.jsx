import { useCart } from "../../context/CartContext";
import { createOrder } from "../../api/order.api";
import { Plus, Minus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import CheckoutModal from "../../components/customer/CheckoutModal";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // Calculate totals
  const itemTotal = cart.reduce((sum, item) => {
    return sum + Number(item.product?.price || 0) * Number(item.quantity || 0);
  }, 0);

  const deliveryFee = itemTotal > 0 ? (itemTotal > 500 ? 0 : 40) : 0;
  const discount = Math.floor(itemTotal * 0.05); // 5% discount
  const grandTotal = itemTotal + deliveryFee - discount;

  const handleIncrement = async (item) => {
    await updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrement = async (item) => {
    if (item.quantity === 1) {
      await removeFromCart(item._id);
    } else {
      await updateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleCheckout = (checkoutData) => {
    placeOrder(checkoutData);
  };

  const placeOrder = async (checkoutData) => {
    try {
      await createOrder({
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        totalAmount: grandTotal,
        location: {
          addressLine1: checkoutData.addressLine1,
          addressLine2: checkoutData.addressLine2,
          addressLine3: checkoutData.addressLine3,
          street: checkoutData.street,
          city: checkoutData.city,
          state: checkoutData.state,
          country: checkoutData.country,
          postalCode: checkoutData.postalCode,
        },
        paymentDetails: {
          method: checkoutData.paymentMethod,
          status: checkoutData.paymentMethod === "Online" ? "Paid" : "Pending",
        },
      });

      await clearCart();
      setShowCheckout(false);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Cart Items - Left Side */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Shopping Cart
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add some products to get started!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📱</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {item.product?.name || "Product"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        ₹{item.product?.price} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-blue-600 text-white rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="px-3 py-1 hover:bg-blue-700 transition-colors"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 className="w-4 h-4" />
                            ) : (
                              <Minus className="w-4 h-4" />
                            )}
                          </button>
                          <span className="font-bold px-4">{item.quantity}</span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-3 py-1 hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill Summary - Right Side */}
        {cart.length > 0 && (
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Bill Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Item Total</span>
                  <span className="font-medium text-gray-800 dark:text-white">₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    Discount (5%)
                  </span>
                  <span className="font-medium text-green-600">-₹{discount}</span>
                </div>

                {itemTotal < 500 && itemTotal > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Add ₹{500 - itemTotal} more to get FREE delivery! 🚚
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                Safe and secure checkout
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
        total={grandTotal}
      />
    </div>
  );
}
