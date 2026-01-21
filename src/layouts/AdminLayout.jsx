import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Section */}
      <div className="flex-1 md:ml-56 flex flex-col">
        {/* Top Navbar */}
        <AdminTopbar />

        {/* Page Content */}
        <main className="p-3 md:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
