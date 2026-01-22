import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 ml-16 md:ml-64 flex flex-col">
        {/* TOP BAR */}
        <AdminTopbar />

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
