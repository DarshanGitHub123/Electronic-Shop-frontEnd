import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Receipt,
  LayoutGrid,
  Image as ImageIcon,
  X, // ✅ FOR CLOSE BUTTON
} from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/collections", label: "Collections", icon: LayoutGrid },
  { to: "/admin/banners", label: "Banner Images", icon: ImageIcon },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/billings", label: "Billings", icon: Receipt },
  { to: "/admin/coupons", label: "Coupons", icon: Receipt },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed z-50 transition-all duration-300 ease-in-out
        ${isOpen
          ? "w-64 translate-x-0"
          : "w-20 -translate-x-full md:translate-x-0"}
        
        /* MOBILE STYLES */
        top-0 bottom-0 left-0 h-screen rounded-none
        
        /* DESKTOP STYLES (Floating) */
        md:top-4 md:bottom-4 md:left-4 md:h-[calc(100vh-32px)] md:rounded-3xl
        
        bg-slate-900/80 backdrop-blur-2xl border-r border-white/10 md:border md:border-white/20
        flex flex-col gap-6 p-4 shadow-2xl
      `}
    >
      {/* LOGO & CLOSE */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white shadow-lg border border-white/20">
            E
          </div>
          <span className={`text-lg font-bold text-white tracking-widest transition-all duration-300 ${!isOpen && "opacity-0 invisible w-0"}`}>
            ADMIN
          </span>
        </div>

        {/* CLOSE BUTTON - MOBILE ONLY */}
        <button
          onClick={() => setIsOpen(false)}
          className={`p-2 md:hidden text-white/50 hover:text-white transition-all duration-300 ${!isOpen && "opacity-0 invisible scale-0"}`}
        >
          <X size={24} />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2 mt-4">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`
                group relative flex items-center gap-4
                p-3 rounded-2xl transition-all duration-300
                ${active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "hover:bg-white/5 text-slate-400 hover:text-white"
                }
              `}
            >
              {/* ICON */}
              <Icon size={22} className="shrink-0" />

              {/* LABEL */}
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!isOpen && "opacity-0 invisible w-0"}`}>
                {label}
              </span>

              {/* TOOLTIP (ONLY WHEN COLLAPSED) */}
              {!isOpen && (
                <div className="absolute left-20 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all shadow-xl pointer-events-none whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
