import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="mx-4 mt-4 relative z-30">
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
        {/* LEFT: TOGGLE & TITLE */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all shadow-md active:scale-95"
          >
            <Menu size={22} />
          </button>
          <span className="text-xl font-black text-white tracking-tighter hidden sm:block">
            ELECTRO<span className="text-orange-500">SHOP</span>
          </span>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3">

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
