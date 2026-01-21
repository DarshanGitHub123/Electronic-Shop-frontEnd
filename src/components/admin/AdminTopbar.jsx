import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clears token + role
    navigate("/login");
  };

  return (
    <header className="h-14 bg-white border-b flex items-center px-4 md:px-6">
      
      {/* Optional left content (title / logo) */}
      <h1 className="text-sm font-semibold text-gray-700">
        Admin Dashboard
      </h1>

      {/* Right: Admin info + logout */}
      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-gray-600 hidden sm:block">
          Admin
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
