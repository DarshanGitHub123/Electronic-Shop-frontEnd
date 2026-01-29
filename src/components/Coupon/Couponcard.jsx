export default function CouponCard({ coupon, onEdit, onDelete, onToggle }) {
    return (
        <div className="glass p-5 rounded-3xl border border-white/10 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold tracking-widest text-white">
                    {coupon.code}
                </h4>

                <button
                    onClick={() => onToggle(coupon._id)}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all
            ${coupon.isActive
                            ? "bg-green-500/15 text-green-400 border border-green-500/30"
                            : "bg-red-500/15 text-red-400 border border-red-500/30"
                        }`}
                >
                    {coupon.isActive ? "Enabled" : "Disabled"}
                </button>
            </div>

            <div className="flex justify-between text-[11px] text-white/60">
                <span>Min Price: ₹{coupon.minPrice}</span>
                <span>Discount: {coupon.discount}%</span>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    onClick={() => onEdit(coupon)}
                    className="flex-1 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white text-xs font-bold transition-all"
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(coupon._id)}
                    className="flex-1 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition-all"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
