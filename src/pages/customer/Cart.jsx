import { useCart } from "../../context/CartContext";
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from "../../api/order.api";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, ShoppingBag, Tag, Info, ShieldCheck, Truck } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import CheckoutModal from "../../components/customer/CheckoutModal";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate totals with MRP, Discount, and Tax
  const totals = cart.reduce((acc, item) => {
    const product = item.product || {};
    const quantity = item.quantity || 0;

    // MRP (Original Price)
    const mrp = Number(product.price || 0);
    const itemTotalMRP = mrp * quantity;

    // Discount on MRP
    const discountPercent = Number(product.discount || 0);
    const itemTotalDiscount = (itemTotalMRP * discountPercent) / 100;

    // Price after discount
    const priceAfterDiscount = itemTotalMRP - itemTotalDiscount;

    // Tax on discounted price
    const taxPercent = Number(product.tax || 0);
    const itemTotalTax = (priceAfterDiscount * taxPercent) / 100;

    // Total for this item (including tax)
    const itemFinalTotal = priceAfterDiscount;

    return {
      mrp: acc.mrp + itemTotalMRP,
      discount: acc.discount + itemTotalDiscount,
      tax: acc.tax + itemTotalTax,
      total: acc.total + itemFinalTotal
    };
  }, { mrp: 0, discount: 0, tax: 0, total: 0 });

  const deliveryFee = totals.total > 0 ? (totals.total > 500 ? 0 : 40) : 0;
  const grandTotal = totals.total + deliveryFee;

  // Aggregate Recommended Products (Unique)
  const recommendations = Array.from(new Set(
    cart.flatMap(item => item.product?.recommendedProducts || [])
      .filter(p => p && p._id) // Ensure it's populated
  )).filter((p, index, self) =>
    self.findIndex(t => t._id === p._id) === index && // Unique by ID
    !cart.some(item => item.product?._id === p._id) // Not already in cart
  );

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
      // If payment method is COD, create order directly
      if (checkoutData.paymentMethod === "COD") {
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
            method: "COD",
            status: "Pending",
          },
        });

        await clearCart();
        setShowCheckout(false);
        toast.success("Order placed successfully! 🎉");
      } else {
        // Online payment - Initialize Razorpay
        toast.info("Initializing payment...");

        // Create Razorpay order
        const { data: razorpayOrder } = await createRazorpayOrder({
          amount: grandTotal,
        });

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Electronics Store",
          description: "Order Payment",
          order_id: razorpayOrder.orderId,
          handler: async function (response) {
            try {
              toast.info("Verifying payment...");

              // Verify payment and create order
              const { data } = await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
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
                },
              });

              await clearCart();
              setShowCheckout(false);
              toast.success("Payment successful! Order placed! 🎉");
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(error.response?.data?.message || "Payment verification failed");
            }
          },
          prefill: {
            name: checkoutData.addressLine1,
            contact: "",
          },
          theme: {
            color: "#2563eb",
          },
          modal: {
            ondismiss: function () {
              toast.warning("Payment cancelled");
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
        });
        razorpay.open();
      }
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
                          <div className="text-right">
                            <p className="text-lg font-black text-gray-900 dark:text-white shrink-0">
                              ₹{((Number(item.product?.price || 0) * (1 - Number(item.product?.discount || 0) / 100)) * item.quantity).toFixed(2)}
                            </p>
                            {item.product?.discount > 0 && (
                              <p className="text-[10px] font-bold text-green-600">
                                Saved ₹{((Number(item.product?.price || 0) * Number(item.product?.discount || 0) / 100) * item.quantity).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 mt-1 mb-3">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-gray-400 line-through">
                              ₹{item.product?.price}
                            </p>
                            {item.product?.discount > 0 && (
                              <span className="text-[10px] font-black text-green-600 uppercase bg-green-100 px-1.5 py-0.5 rounded">
                                {item.product.discount}% OFF
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-medium text-gray-500">
                            + ₹{((Number(item.product?.price || 0) * (1 - Number(item.product?.discount || 0) / 100) * Number(item.product?.tax || 0) / 100)).toFixed(2)} Tax per unit ({item.product?.tax}%)
                          </p>
                          {isItemOutOfStock && (
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest bg-red-100 px-2 py-0.5 rounded-md inline-block mt-1">
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
                  <span className="text-gray-400 uppercase tracking-widest">Total MRP</span>
                  <span className="text-gray-900 dark:text-white">₹{totals.mrp.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-green-600 flex items-center gap-1 uppercase tracking-widest">
                    <Tag size={14} /> Total Discount
                  </span>
                  <span className="text-green-600">-₹{totals.discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Calculated Tax</span>
                  <span className="text-gray-900 dark:text-white">(₹{totals.tax.toFixed(2)})<span className="text-[8px] opacity-60">(Included)</span></span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Total</span>
                  <span className="text-gray-900 dark:text-white">₹{totals.mrp.toFixed(2) - totals.discount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-400 uppercase tracking-widest">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-green-600" : "text-gray-900"}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>

                {totals.total < 500 && totals.total > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
                    <Truck size={20} className="text-blue-600" />
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tight leading-tight">
                      Add ₹{(500 - totals.total).toFixed(2)} more for FREE delivery!
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    Payable Amount
                  </span>
                  <span className="text-3xl font-black text-blue-600">
                    ₹{grandTotal.toFixed(2)}
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

      {/* Recommended Products */}
      {recommendations.length > 0 && (
        <div className="mt-16 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
              You Might Also Like
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((prod) => (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`}
                className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all group"
              >
                <div className="aspect-square rounded-xl bg-gray-50 dark:bg-slate-900 mb-3 overflow-hidden relative">
                  {prod.images?.[0] ? (
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">📱</div>
                  )}
                  {prod.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-green-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase">
                      {prod.discount}% OFF
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-xs text-gray-800 dark:text-white truncate mb-1">
                  {prod.name}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-blue-600">₹{prod.price}</p>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckout}
        itemTotal={totals.mrp.toFixed(2)}
        deliveryFee={deliveryFee.toFixed(2)}
        discount={(totals.discount).toFixed(2)}
        tax={totals.tax.toFixed(2)}
        total={grandTotal.toFixed(2)}
      />
    </div>
  );
}
