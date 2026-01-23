import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, getProducts } from "../../api/product.api";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../api/order.api";
import ProductCard from "../../components/product/ProductCard";
import CheckoutModal from "../../components/customer/CheckoutModal";
import { ShoppingCart, ShieldCheck, Truck, RefreshCcw, Info, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  // STABLE CART STATE
  const cartItem = useMemo(() =>
    cart.find(item => (item.product?._id || item.product) === id),
    [cart, id]);

  const quantity = cartItem?.quantity || 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res, allRes] = await Promise.all([
          getProductById(id),
          getProducts()
        ]);

        const prodData = res.data;
        setProduct(prodData);
        setActiveImage(prodData.images?.[0] || "");

        // Filter for products in the same category (excluding current)
        const categoryProducts = allRes.data.filter(p =>
          (p.category?._id || p.category) === (prodData.category?._id || prodData.category) &&
          p._id !== prodData._id
        ).slice(0, 8);
        setRelatedProducts(categoryProducts);

      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Product Not Found</h2>
      <Link to="/" className="text-blue-600 mt-4 block underline">Back to Shop</Link>
    </div>
  );

  const discount = product.discount || 0;
  const originalPrice = Math.floor(product.price * (1 + discount / 100));

  // Totals for checkout: ON THIS PAGE, WE ONLY ORDER THE CURRENT PRODUCT (Buy Now)
  const currentQuantity = quantity || 1;
  const displayItemTotal = product.price * currentQuantity;
  const displayDeliveryFee = displayItemTotal > 0 ? (displayItemTotal > 500 ? 0 : 40) : 0;
  const displayDiscount = Math.floor(displayItemTotal * 0.05);
  const displayGrandTotal = displayItemTotal + displayDeliveryFee - displayDiscount;

  const handleBuyNow = async () => {
    if (quantity === 0) {
      await addToCart(product._id);
    }
    setShowCheckout(true);
  };

  const handleCheckoutSubmit = async (checkoutData) => {
    try {
      // ORDER ONLY THE CURRENT PRODUCT
      await createOrder({
        items: [{
          product: product._id,
          quantity: currentQuantity,
          price: product.price,
        }],
        totalAmount: displayGrandTotal,
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

      // After placing order for THIS item, we might want to remove it from cart or just clear all?
      // Usually Buy Now orders specifically this. Let's just follow the existing clearCart for now
      // but only if the user expects it. The user said "after placed only one product is ordered".
      await clearCart();
      setShowCheckout(false);
      toast.success("Order placed successfully! 🎉");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

      {/* ---------- TOP SECTION: GALLERY & INFO ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* 1. IMAGE GALLERY (left 5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-2xl flex items-center justify-center p-4">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="text-6xl">📱</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 custom-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. PRODUCT DETAILS (center 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <nav className="text-xs text-blue-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Link to="/" className="hover:underline">Electronics</Link>
              <span>•</span>
              <Link to={`/category/${product.category?._id}`} className="hover:underline">
                {product.category?.categoryName || "Smart Devices"}
              </Link>
            </nav>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
              <span className="h-4 w-[1px] bg-gray-200"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                SKU: {product._id.slice(-6).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-gray-900 dark:text-white">₹{product.price}</span>
              {discount > 0 && (
                <span className="text-lg text-gray-400 line-through">₹{originalPrice}</span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-green-600 font-bold uppercase tracking-wide">
                Tax: ₹{product.tax || 0} Included
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                Inclusive of all taxes and GST
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-400 flex items-center gap-2">
              <Info size={14} /> Description
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Specs Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold uppercase text-gray-400">Main Specifications</h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-400 text-[10px] font-bold uppercase">{key}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. BUY BOX (right 3 cols) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 p-6 bg-white dark:bg-slate-800 border-2 border-blue-600 rounded-3xl shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">Total: ₹{product.price}</span>
              <Truck size={20} className="text-blue-600" />
            </div>

            <div className="space-y-3">
              {/* <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <ShieldCheck size={18} className="text-green-500" />
                <span>2 Year Extended Warranty</span>
              </div> */}
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <RefreshCcw size={18} className="text-orange-500" />
                <span>7 Days Replacement Policy</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="min-h-[60px]">
                {quantity === 0 ? (
                  <button
                    onClick={() => addToCart(product._id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 uppercase tracking-wider h-full"
                  >
                    <ShoppingCart size={20} />
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-2 rounded-xl border border-blue-100 h-full">
                    <button
                      onClick={() => quantity === 1 ? removeFromCart(cartItem._id) : updateQuantity(cartItem._id, quantity - 1)}
                      className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow flex items-center justify-center font-bold text-xl hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItem._id, quantity + 1)}
                      className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow flex items-center justify-center font-bold text-xl hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {quantity > 0 && (
                  <Link to="/cart" className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white text-center font-bold py-4 rounded-xl uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                    <ShoppingBag size={18} />
                    Go to Cart
                  </Link>
                )}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all uppercase tracking-wider"
                >
                  Buy it now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- RECOMMENDATIONS SECTION ---------- */}
      {product.recommendedProducts?.length > 0 && (
        <div className="pt-12 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Best Pairs for you</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selected explicitly for this model</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {product.recommendedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ---------- CATEGORY RELATED SECTION ---------- */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-50">
                <LayoutGrid size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">More from {product.category?.categoryName}</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Related Products across the store</p>
              </div>
            </div>
            <Link to={`/category/${product.category?._id}`} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors">
              See All
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={handleCheckoutSubmit}
        itemTotal={displayItemTotal}
        deliveryFee={displayDeliveryFee}
        discount={displayDiscount}
        total={displayGrandTotal}
      />
    </div>
  );
}

// Simple LayoutGrid for lucide if not standard
function LayoutGrid({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
  )
}
