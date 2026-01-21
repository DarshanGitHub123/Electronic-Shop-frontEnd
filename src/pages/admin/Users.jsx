import { useEffect, useState } from "react";
import api from "../../api/axios";

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
      <p className="text-sm text-gray-500">Loading customers...</p>
    );
  }

  return (
    <div className="bg-white border rounded-lg">
      {/* PAGE HEADING */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Customers</h2>
        <p className="text-xs text-gray-500">
          List of registered customers
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center text-sm text-gray-500 p-4"
                >
                  No customers found
                </td>
              </tr>
            )}

            {customers.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
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
