import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/customer/Home";
import Cart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/Orders";
import CollectionDetail from "./pages/customer/CollectionDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import Billings from "./pages/admin/Billings";
import AdminCollections from "./pages/admin/Collections";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>

            {/* ---------- AUTH ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ---------- CUSTOMER ---------- */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<CustomerOrders />} />
              <Route path="/collections/:id" element={<CollectionDetail />} />
            </Route>

            {/* ---------- ADMIN ---------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="Admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="billings" element={<Billings />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
