import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getCoupons,
    createCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
} from "../../api/coupons.api.js";
import CouponCard from "../../components/Coupon/Couponcard.jsx";

// import {
//     Tag,
//     Percent,
//     IndianRupee,
//     Plus,
//     X,
//     Loader2,
// } from "lucide-react";

export default function Coupons() {
    const [coupons, setCoupons] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        code: "",
        minPrice: "",
        discount: "",
    });

    const fetchCoupons = async () => {
        setLoading(true);
        const res = await getCoupons();
        setCoupons(res.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const resetForm = () => {
        setEditId(null);
        setForm({ code: "", minPrice: "", discount: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editId) {
            await updateCoupon(editId, form);
            toast.success("Coupon updated");
        } else {
            await createCoupon(form);
            toast.success("Coupon created");
        }

        resetForm();
        fetchCoupons();
    };

    const handleEdit = (coupon) => {
        setEditId(coupon._id);
        setForm({
            code: coupon.code,
            minPrice: coupon.minPrice,
            discount: coupon.discount,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this coupon?")) return;
        await deleteCoupon(id);
        toast.info("Coupon deleted");
        fetchCoupons();
    };

    const handleToggle = async (id) => {
        await toggleCouponStatus(id);
        fetchCoupons();
    };

    return (
        <div className="w-full space-y-12 pb-20">
            {/* HEADER */}
            <div>
                <h1 className="text-xl font-semibold text-white">Coupon Management</h1>
                <p className="text-xs text-white/40">
                    Create & manage discount coupons
                </p>
            </div>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="glass p-8 rounded-3xl border border-white/20 max-w-xl space-y-6"
            >
                <h2 className="text-sm font-bold text-white">
                    {editId ? "Edit Coupon" : "Create Coupon"}
                </h2>

                <input
                    className="glass-input"
                    placeholder="Coupon Code (e.g. SAVE20)"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    required
                />

                <input
                    type="number"
                    className="glass-input"
                    placeholder="Minimum Price"
                    value={form.minPrice}
                    onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
                    required
                />

                <input
                    type="number"
                    className="glass-input"
                    placeholder="Discount %"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    required
                />

                <div className="flex gap-3">
                    <button className="btn-primary flex-1">
                        {editId ? "Update Coupon" : "Create Coupon"}
                    </button>

                    {editId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-5 rounded-xl bg-white/10 text-white"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* LIST */}
            {loading ? (
                <p className="text-white/40">Loading coupons...</p>
            ) : coupons.length === 0 ? (
                <p className="text-white/20">No coupons created yet</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <CouponCard
                            key={coupon._id}
                            coupon={coupon}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
