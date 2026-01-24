import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { ShoppingCart, Search as SearchIcon, User, LogOut } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { getProducts } from "../../api/product.api";

export default function Navbar() {
  const { role, logout } = useAuth();
  const { cart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Fetch products once for frontend search
    getProducts().then(res => setProducts(res.data));
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return products.filter(p =>
      (p.title || "").toLowerCase().includes(query) ||
      (p.description || "").toLowerCase().includes(query)
    ).slice(0, 8); // Limit to 8 suggestions
  }, [searchQuery, products]);

  const handleProductSelect = (id) => {
    setSearchQuery("");
    setShowDropdown(false);
    navigate(`/product/${id}`);
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              ElectroShop
            </span>
          </Link>

          {/* Search Bar - Visible for Customers and Guests */}
          {role !== "Admin" && (
            <div className="flex-1 max-w-xl hidden md:block relative" ref={dropdownRef}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showDropdown && filteredProducts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]">
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredProducts.map(product => (
                      <button
                        key={product._id}
                        onClick={() => handleProductSelect(product._id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-1 flex-shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <SearchIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                            {product.name || product.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          ₹{product.price}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-3 md:gap-4">

            {/* Customer links */}
            {role === "Customer" && (
              <>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hidden sm:block"
                >
                  Orders
                </Link>

                {/* Cart with Badge */}
                <Link
                  to="/cart"
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Admin link */}
            {role === "Admin" && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Admin
              </Link>
            )}

            {/* Auth controls */}
            {!role ? (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        {role !== "Admin" && (
          <div className="mt-3 md:hidden relative">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Mobile Suggestions Dropdown */}
            {showDropdown && filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[100]">
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredProducts.map(product => (
                    <button
                      key={product._id}
                      onClick={() => handleProductSelect(product._id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border-b border-gray-100 dark:border-slate-700 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-1 flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <SearchIcon size={14} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-white truncate">
                          {product.name || product.title}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        ₹{product.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
