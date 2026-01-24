import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";

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
import AdminRegister from "./pages/auth/AdminRegister";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import Billings from "./pages/admin/Billings";
import AdminCollections from "./pages/admin/Collections";

// Static Pages
import HelpCenter from "./pages/static/HelpCenter";
import ReturnsRefunds from "./pages/static/ReturnsRefunds";
import ShippingInfo from "./pages/static/ShippingInfo";
import PrivacyPolicy from "./pages/static/PrivacyPolicy";
import TermsConditions from "./pages/static/TermsConditions";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </SearchProvider>
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
      <Route path="/admin/register" element={<AdminRegister />} />

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

        {/* STATIC PAGES */}
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/returns-refunds" element={<ReturnsRefunds />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Route>

      {/* CATCH ALL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
