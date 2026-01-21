import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/order.api";
import { getProductById } from "../../api/product.api";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🆕 Inventory status per order
  // { orderId: { productId: "Available" | "Out of Stock" } }
  const [inventoryStatus, setInventoryStatus] = useState({});

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const changeStatus = async (id, status) => {
    await updateOrderStatus(id, { status });
    loadOrders();
  };

  // 🆕 CHECK INVENTORY FUNCTION
  const checkInventory = async (order) => {
    const statusMap = {};

    for (const item of order.items) {
      try {
        const res = await getProductById(item.product._id);
        const availableStock = res.data.stock;

        statusMap[item.product._id] =
          availableStock >= item.quantity
            ? "Available"
            : "Out of Stock";
      } catch (err) {
        statusMap[item.product._id] = "Error";
      }
    }

    setInventoryStatus((prev) => ({
      ...prev,
      [order._id]: statusMap,
    }));
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading orders...</p>;
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border rounded-lg p-4 space-y-4"
        >
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                Order #{order._id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded w-fit mt-2 sm:mt-0
                ${
                  order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {order.status}
            </span>
          </div>

          {/* CUSTOMER */}
          <div className="border-t pt-3 text-sm">
            <p>
              <strong>Customer:</strong> {order.user?.name}
            </p>
            <p className="text-xs text-gray-600">
              {order.user?.email}
            </p>
          </div>

          {/* ITEMS + INVENTORY */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Items</p>

              {/* 🆕 CHECK INVENTORY BUTTON */}
              <button
                onClick={() => checkInventory(order)}
                className="text-xs bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Check Inventory
              </button>
            </div>

            {order.items.map((item, idx) => {
              const status =
                inventoryStatus[order._id]?.[item.product._id];

              return (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm mb-1"
                >
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>

                  <div className="flex items-center gap-2">
                    <span>
                      ₹{item.product?.price * item.quantity}
                    </span>

                    {/* 🆕 INVENTORY STATUS BADGE */}
                    {status && (
                      <span
                        className={`text-xs px-2 py-1 rounded
                          ${
                            status === "Available"
                              ? "bg-green-100 text-green-700"
                              : status === "Out of Stock"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="border-t pt-3 flex flex-wrap gap-2">
            {["Pending", "Delivered", "Rejected"].map((s) => (
              <button
                key={s}
                onClick={() => changeStatus(order._id, s)}
                className={`text-xs px-3 py-1 rounded
                  ${
                    order.status === s
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
