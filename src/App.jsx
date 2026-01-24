import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/customer/Home";
import Cart from "./pages/customer/Cart";
import CustomerOrders from "./pages/customer/Orders";
import CollectionDetail from "./pages/customer/CollectionDetail";
import CategoryDetail from "./pages/customer/CategoryDetail";
import ProductDetails from "./pages/customer/ProductDetails";
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
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { role } = useAuth();

  return (
    <Routes>
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

      {/* ---------- AUTH ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- CUSTOMER ---------- */}
      <Route element={<CustomerLayout />}>
        <Route
          path="/"
          element={
            role === "Admin" ? <Navigate to="/admin" replace={true} /> : <Home />
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/collections/:id" element={<CollectionDetail />} />
        <Route path="/category/:id" element={<CategoryDetail />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
