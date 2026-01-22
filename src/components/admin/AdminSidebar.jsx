import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Receipt,
} from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: Home },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Layers },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/billings", label: "Billings", icon: Receipt }, // ✅ NEW
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside
      className="
        fixed left-3 top-3 bottom-3
        w-16 md:w-64
        glass
        rounded-2xl
        p-3
        flex flex-col
        gap-6
        border border-white/30
      "
    >
      {/* LOGO */}
      <div className="flex items-center justify-center md:justify-start gap-2 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold">
          S
        </div>
        <span className="hidden md:block text-lg font-semibold tracking-wide">
          Admin Panel
        </span>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-2 mt-2">
        {links.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                group relative flex items-center gap-3
                px-3 py-2.5 rounded-xl transition-all
                ${
                  active
                    ? "bg-white/25 text-white shadow-inner"
                    : "hover:bg-white/15 text-white/80"
                }
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r" />
              )}

              <div
                className={`
                  w-9 h-9 rounded-xl flex items-center justify-center
                  ${
                    active
                      ? "bg-gradient-to-br from-orange-500 to-orange-600"
                      : "bg-white/10 group-hover:bg-white/20"
                  }
                `}
              >
                <Icon size={18} />
              </div>

              <span className="hidden md:block text-sm font-medium">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
