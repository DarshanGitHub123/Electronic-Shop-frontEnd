import { useState } from "react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-x-hidden">
      {/* MOBILE BACKDROP */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* MAIN AREA */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >
        {/* TOP BAR */}
        <AdminTopbar toggleSidebar={toggleSidebar} />

        {/* CONTENT WRAPPER */}
        <div className="px-4 md:px-6 pb-6 mt-4">
          <div
            className="
              bg-white/10
              backdrop-blur-xl
              border border-white/30
              rounded-2xl
              p-4 md:p-6
              shadow-glass
              min-h-[calc(100vh-140px)]
            "
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
