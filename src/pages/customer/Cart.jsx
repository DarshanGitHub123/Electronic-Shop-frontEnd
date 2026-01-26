import { useCart } from "../../context/CartContext";
import { createOrder } from "../../api/order.api";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, Tag, Info, ShieldCheck, Truck } from "lucide-react";
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

  // Check if any item is out of stock
  const hasOutOfStockItems = cart.some(item => (item.product?.stock || 0) <= 0);

  const handleIncrement = async (item) => {
    if ((item.product?.stock || 0) > item.quantity) {
      await updateQuantity(item._id, item.quantity + 1);
    } else {
      toast.warn("Maximum available stock reached");
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity === 1) {
      await removeFromCart(item._id);
    } else {
      await updateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleCheckout = (checkoutData) => {
    if (hasOutOfStockItems) {
      return toast.error("Please remove out-of-stock items to proceed");
    }
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
        customizationDescription: checkoutData.customizationDescription,
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
    <div className="max-w-6xl mx-auto pb-20">
      <div className="grid md:grid-cols-3 gap-6">

        {/* Cart Items - Left Side */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Shopping Cart
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
              ({cart.length} {cart.length === 1 ? "item" : "items"})
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-700 shadow-xl">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-600 mb-4" />
              <p className="text-lg font-bold text-gray-400 mb-2 uppercase tracking-tight">
                Your cart is empty
              </p>
              <Link to="/" className="text-blue-600 font-bold hover:underline">Start Shopping ➔</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => {
                const isItemOutOfStock = (item.product?.stock || 0) <= 0;
                return (
                  <div
                    key={item._id}
                    className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border transition-all duration-300 ${isItemOutOfStock ? 'border-red-200 bg-red-50/10 grayscale opacity-90' : 'border-gray-100 dark:border-slate-700 hover:shadow-xl shadow-sm'}`}
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                        {isItemOutOfStock && (
                          <div className="absolute inset-0 bg-red-600/60 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">Sold Out</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-gray-800 dark:text-white truncate uppercase tracking-tight">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-lg font-black text-gray-900 dark:text-white shrink-0">
                            ₹{(item.product?.price || 0) * item.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 mb-3">
                          <p className="text-xs font-bold text-gray-400">
                            ₹{item.product?.price} each
                          </p>
                          {isItemOutOfStock && (
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded-md">
                              Currently Unavailable
                            </span>
                          )}
                        </div>

                        {/* Controls Row */}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center rounded-lg overflow-hidden border ${isItemOutOfStock ? 'bg-gray-100 border-gray-200' : 'bg-blue-600 border-blue-700 shadow-md'}`}>
                            <button
                              onClick={() => handleDecrement(item)}
                              className={`px-3 py-1.5 transition-colors ${isItemOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-white hover:bg-black/10'}`}
                            >
                              {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                            </button>
                            <span className={`font-black px-4 text-sm ${isItemOutOfStock ? 'text-gray-400' : 'text-white'}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              disabled={isItemOutOfStock}
                              className={`px-3 py-1.5 transition-colors ${isItemOutOfStock ? 'text-gray-400 cursor-not-allowed' : 'text-white hover:bg-black/10'}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bill Summary - Right Side */}
        {cart.length > 0 && (
          <div className="md:col-span-1">
            <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 border shadow-2xl sticky top-24 space-y-6 ${hasOutOfStockItems ? 'border-red-500/30' : 'border-gray-100'}`}>
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight border-b pb-4">
                Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : "text-gray-900"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-green-600 flex items-center gap-1 uppercase tracking-widest">
                    <Tag size={14} /> Discount
                  </span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>

                {itemTotal < 500 && itemTotal > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
                    <Truck size={20} className="text-blue-600" />
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tight leading-tight">
                      Add ₹{500 - itemTotal} more for FREE delivery!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    Grand Total
                  </span>
                  <span className="text-3xl font-black text-blue-600">
                    ₹{grandTotal}
                  </span>
                </div>

                {hasOutOfStockItems && (
                  <div className="mb-4 flex items-center gap-2 text-red-600 font-bold bg-red-100 p-3 rounded-xl border border-red-200 animate-pulse">
                    <Info size={16} />
                    <span className="text-[10px] uppercase tracking-widest leading-none">Remove out-of-stock items to proceed</span>
                  </div>
                )}

                <button
                  onClick={() => !hasOutOfStockItems && setShowCheckout(true)}
                  disabled={hasOutOfStockItems}
                  className={`w-full font-black py-4 rounded-2xl transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm ${hasOutOfStockItems
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                >
                  Checkout
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                <ShieldCheck size={12} /> SSL Secure Checkout
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
        itemTotal={itemTotal}
        deliveryFee={deliveryFee}
        discount={discount}
        total={grandTotal}
      />
    </div>
  );
}
