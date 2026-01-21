import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-black text-white p-3 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="font-semibold text-sm md:text-base">
        ElectroShop
      </Link>

      {/* Navigation */}
      <nav className="flex items-center space-x-3 text-xs md:text-sm">
        
        {/* Customer links */}
        {role === "Customer" && (
          <>
            <Link to="/orders" className="hover:underline">
              Orders
            </Link>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
          </>
        )}

        {/* Admin link */}
        {role === "Admin" && (
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        )}

        {/* Auth controls */}
        {!role ? (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-white text-black px-2 py-1 rounded text-xs hover:bg-gray-200"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
