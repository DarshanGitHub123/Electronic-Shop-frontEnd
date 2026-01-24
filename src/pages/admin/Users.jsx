import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");

        // ✅ Only customers (exclude Admin)
        const filtered = res.data.filter(
          (user) => user.role === "Customer"
        );

        setCustomers(filtered);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-white/60">
        Loading customers…
      </p>
    );
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <Users size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-wide">
            Customers
          </h1>
          <p className="text-xs text-white/60">
            List of registered customers
          </p>
        </div>
      </div>

      {/* CUSTOMER LIST */}
      <div className="space-y-4">
        {/* MOBILE VIEW cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {customers.map((user) => (
            <div
              key={user._id}
              className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 space-y-3 shadow-glass"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white tracking-wide">{user.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-widest border border-indigo-500/20">
                  {user.role}
                </span>
              </div>
              <p className="text-sm text-white/60 truncate">
                {user.email}
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW table */}
        <div className="hidden md:block bg-white/10 border border-white/30 rounded-2xl overflow-hidden shadow-glass">
          <table className="w-full text-sm">
            <thead className="text-white/70 bg-white/5">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-center">Role</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-bold text-white">
                    {user.name}
                  </td>
                  <td className="p-4 text-white/80">
                    {user.email}
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-xs px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="p-10 text-center text-white/40 bg-white/5 rounded-2xl border border-dashed border-white/20">
            No customers found
          </div>
        )}
      </div>

    </div>
  );
}
