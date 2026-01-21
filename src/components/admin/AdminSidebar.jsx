import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const link = (path) =>
    `block px-4 py-2 rounded-md text-sm font-medium transition
     ${
       pathname === path
         ? "bg-indigo-600 text-white"
         : "text-gray-300 hover:bg-gray-800 hover:text-white"
     }`;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 bg-black text-white p-2 rounded"
      >
        ☰
      </button>

      {/* Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-screen w-56 bg-black p-4
        transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <h1 className="text-white font-semibold mb-6">
          ADMIN <span className="text-indigo-400">ElectonicStore</span>
        </h1>

        <nav className="space-y-1">
          <Link to="/admin" className={link("/admin")}>Dashboard</Link>
          <Link to="/admin/products" className={link("/admin/products")}>Products</Link>
          <Link to="/admin/categories" className={link("/admin/categories")}>Categories</Link>
          <Link to="/admin/orders" className={link("/admin/orders")}>Orders</Link>
          <Link to="/admin/users" className={link("/admin/users")}>Customers</Link>
        </nav>
      </aside>
    </>
  );
}
