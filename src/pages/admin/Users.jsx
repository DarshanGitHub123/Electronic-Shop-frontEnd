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

      {/* CUSTOMER TABLE */}
      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          shadow-glass
          overflow-x-auto
        "
      >
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="p-6 text-center text-white/60"
                >
                  No customers found
                </td>
              </tr>
            )}

            {customers.map((user) => (
              <tr
                key={user._id}
                className="
                  border-t border-white/10
                  hover:bg-white/5
                  transition
                "
              >
                <td className="p-4 font-medium">
                  {user.name}
                </td>
                <td className="text-white/80">
                  {user.email}
                </td>
                <td>
                  <span
                    className="
                      text-xs
                      px-3 py-1
                      rounded-xl
                      bg-indigo-500/20
                      text-indigo-300
                    "
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
