import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="mx-4 mt-4">
      <div className="
        glass
        px-4 py-3
        rounded-2xl
        flex items-center justify-between
        gap-3
        bg-white/20
        backdrop-blur-xl
        border border-white/30
      ">
        {/* LEFT: SEARCH */}
        <div className="flex items-center gap-2 w-full max-w-md">
          
          Admin Panel
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATION */}
          <button
            className="
              relative
              w-9 h-9
              rounded-xl
              flex items-center justify-center
              bg-white/20
              hover:bg-white/30
              transition
            "
          >
            <Bell size={18} />
            <span className="
              absolute -top-1 -right-1
              w-2 h-2
              bg-orange-500
              rounded-full
            " />
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="
              px-4 py-2
              rounded-xl
              text-sm font-medium
              bg-gradient-to-r from-orange-500 to-orange-600
              text-white
              shadow-lg
              hover:scale-[1.03]
              transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
