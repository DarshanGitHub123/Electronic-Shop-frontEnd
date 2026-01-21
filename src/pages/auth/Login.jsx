import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      const { token, role } = res.data;

      login(token, role);

      // Role-based redirect
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white border rounded-lg p-6 shadow-sm">
        
        {/* Header */}
        <h1 className="text-xl font-semibold text-center mb-1">
          Sign in
        </h1>
        <p className="text-xs text-center text-gray-500 mb-4">
          Continue to ElectroShop
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 text-xs p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div>
            <label className="block text-xs font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-center mt-4">
          New to ElectroShop?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
