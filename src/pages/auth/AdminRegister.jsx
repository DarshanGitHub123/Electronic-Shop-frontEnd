import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerAdminUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminRegister() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await registerAdminUser({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            const { token, role } = res.data;
            login(token, role);
            navigate("/admin");
        } catch (err) {
            setError(
                err.response?.data?.message || "Admin Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black px-4">

            <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 space-y-5">

                {/* HEADER */}
                <div className="text-center">
                    <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                            <ShieldCheck size={28} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-white">
                        Admin Registration
                    </h1>
                    <p className="text-xs text-white/60 mt-1">
                        Setup your <span className="font-medium text-orange-400">Admin Account</span>
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

                    {/* NAME */}
                    <div className="space-y-1">
                        <label className="text-xs text-white/70">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Admin name"
                            className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="space-y-1">
                        <label className="text-xs text-white/70">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@electroshop.com"
                            className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                    </div>

                    {/* PASSWORD */}
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
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="space-y-1">
                        <label className="text-xs text-white/70">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={
                                    showConfirmPassword ? "text" : "password"
                                }
                                name="confirmPassword"
                                required
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-white/15 border border-white/30 rounded-xl px-4 py-2.5 pr-11 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                            >
                                {showConfirmPassword ? (
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
                        {loading
                            ? "Creating Administrator Account..."
                            : "Register as Admin"}
                    </button>
                </form>

                {/* FOOTER */}
                <p className="text-xs text-center text-white/60">
                    Already an admin?{" "}
                    <Link
                        to="/login"
                        className="text-orange-400 hover:underline font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
