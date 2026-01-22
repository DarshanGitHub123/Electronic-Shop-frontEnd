import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
} from "lucide-react";

const stats = [
  {
    label: "Total Products",
    value: "128",
    icon: Package,
    gradient: "from-indigo-500 to-indigo-700",
  },
  {
    label: "Total Orders",
    value: "342",
    icon: ShoppingCart,
    gradient: "from-emerald-500 to-emerald-700",
  },
  {
    label: "Users",
    value: "96",
    icon: Users,
    gradient: "from-sky-500 to-sky-700",
  },
  {
    label: "Revenue",
    value: "₹4.8L",
    icon: IndianRupee,
    gradient: "from-orange-500 to-orange-700",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold tracking-wide">
        Dashboard Overview
      </h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, gradient }) => (
          <div
            key={label}
            className="glass p-5 flex items-center justify-between hover:scale-[1.02] transition"
          >
            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-300">
                {label}
              </p>
              <p className="text-3xl font-bold mt-1">
                {value}
              </p>
            </div>

            {/* ICON */}
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
            >
              <Icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* PLACEHOLDER FOR CHARTS / NEXT SECTIONS */}
      <div className="glass p-6 text-sm text-gray-300">
        Analytics & charts will appear here
      </div>
    </div>
  );
}
