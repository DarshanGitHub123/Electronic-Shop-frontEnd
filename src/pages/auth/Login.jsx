import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, googleLogin } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      role === "Admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const res = await googleLogin({ credential: credentialResponse.credential });
      const { token, role } = res.data;
      login(token, role);
      role === "Admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed. Make sure you are registered.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Sign-In was unsuccessful. Try again later");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

      <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-5">

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-white/60 mt-1">
            Sign in to continue to <span className="font-medium">ElectroShop</span>
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/20 text-red-300 text-xs border border-red-500/30 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-xs text-white/70">
              Email address
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* PASSWORD WITH EYE TOGGLE */}
          <div className="space-y-1">
            <label className="text-xs text-white/70">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />

              {/* EYE BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium py-2.5 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-white/40">Or continue with</span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            shape="pill"
            text="signin_with"
            width="100%"
          />
        </div>

        {/* FOOTER */}
        <p className="text-xs text-center text-white/60">
          New to ElectroShop?{" "}
          <Link
            to="/register"
            className="text-orange-400 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
