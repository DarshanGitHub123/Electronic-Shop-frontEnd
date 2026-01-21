import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order.api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then(res => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-semibold text-lg mb-4">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">No orders yet</p>
      )}

      {orders.map(o => (
        <div
          key={o._id}
          className="border p-3 mb-3 rounded"
        >
          <p className="text-sm font-medium">
            Order #{o._id.slice(-6)}
          </p>
          <p className="text-xs">
            Status: <strong>{o.status}</strong>
          </p>
          <p className="text-xs">
            Total: ₹{o.totalAmount}
          </p>
        </div>
      ))}
    </div>
  );
}
