import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-3 md:p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
