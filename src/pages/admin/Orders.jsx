import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/order.api";
import { getProductById } from "../../api/product.api";
import { PackageCheck } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // { orderId: { productId: "Available" | "Out of Stock" | "Error" } }
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

  const checkInventory = async (order) => {
    const statusMap = {};

    for (const item of order.items) {
      try {
        const res = await getProductById(item.product._id);
        statusMap[item.product._id] =
          res.data.stock >= item.quantity
            ? "Available"
            : "Out of Stock";
      } catch {
        statusMap[item.product._id] = "Error";
      }
    }

    setInventoryStatus((prev) => ({
      ...prev,
      [order._id]: statusMap,
    }));
  };

  if (loading) {
    return (
      <p className="text-sm text-white/60">
        Loading orders…
      </p>
    );
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <PackageCheck size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-wide">
          Orders
        </h1>
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="
              bg-white/10
              backdrop-blur-xl
              border border-white/30
              rounded-2xl
              p-5
              shadow-glass
              space-y-4
            "
          >
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-sm font-semibold">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-white/60">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-xl w-fit
                  ${
                    order.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : order.status === "OutForDelivery"
                      ? "bg-blue-500/20 text-blue-300"
                      : order.status === "Delivered"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* CUSTOMER */}
            <div className="border-t border-white/10 pt-3 text-sm">
              <p>
                <span className="text-white/60">Customer:</span>{" "}
                <span className="font-medium">
                  {order.user?.name}
                </span>
              </p>
              <p className="text-xs text-white/60">
                {order.user?.email}
              </p>
            </div>

            {/* ✅ DELIVERY AGENT (ONLY FOR OUTFORDELIVERY & DELIVERED) */}
            {(order.status === "OutForDelivery" ||
              order.status === "Delivered") &&
              order.deliveryAgent && (
                <div className="border-t border-white/10 pt-3 text-sm">
                  <p>
                    <span className="text-white/60">
                      Delivery Agent:
                    </span>{" "}
                    <span className="font-medium text-white">
                      {order.deliveryAgent.name}
                    </span>
                  </p>
                  <p className="text-xs text-white/60">
                    📞 {order.deliveryAgent.phone}
                  </p>
                </div>
            )}


            {/* DELIVERY ADDRESS */}
            <div className="border-t border-white/10 pt-3 text-sm">
              <p className="font-medium mb-1">
                Delivery Address
              </p>
              <p className="text-xs text-white/70 leading-5">
                {order.location?.addressLine1},{" "}
                {order.location?.addressLine2},{" "}
                {order.location?.addressLine3}
                <br />
                {order.location?.street},{" "}
                {order.location?.city}
                <br />
                {order.location?.state},{" "}
                {order.location?.country} –{" "}
                {order.location?.postalCode}
              </p>
            </div>

            {/* PAYMENT */}
            <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
              <p>
                <span className="text-white/60">
                  Payment Method:
                </span>{" "}
                {order.paymentDetails?.method}
              </p>

              <p>
                <span className="text-white/60">
                  Payment Status:
                </span>{" "}
                <span
                  className={`text-xs px-2 py-1 rounded ml-1
                    ${
                      order.paymentDetails?.status === "Paid"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                >
                  {order.paymentDetails?.status}
                </span>
              </p>
            </div>

            {/* ITEMS */}
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                  Items
                </p>
                <button
                  onClick={() => checkInventory(order)}
                  className="
                    px-4 py-1.5
                    rounded-xl
                    text-xs
                    bg-gradient-to-r from-indigo-500 to-indigo-600
                    hover:scale-[1.03]
                    transition
                  "
                >
                  Check Inventory
                </button>
              </div>

              {order.items.map((item, idx) => {
                const status =
                  inventoryStatus[order._id]?.[
                    item.product._id
                  ];

                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm mb-2"
                  >
                    <span className="text-white/80">
                      {item.product?.name} ×{" "}
                      {item.quantity}
                    </span>

                    <div className="flex items-center gap-2">
                      <span>
                        ₹{item.product?.price *
                          item.quantity}
                      </span>

                      {status && (
                        <span
                          className={`text-xs px-2 py-1 rounded
                            ${
                              status === "Available"
                                ? "bg-green-500/20 text-green-300"
                                : status === "Out of Stock"
                                ? "bg-red-500/20 text-red-300"
                                : "bg-gray-500/20 text-gray-300"
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
            <div className="border-t border-white/10 pt-3 flex flex-wrap gap-2">
              {[
                "Pending",
                "OutForDelivery",
                "Delivered",
                "Rejected",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    changeStatus(order._id, s)
                  }
                  className={`px-4 py-1.5 rounded-xl text-xs transition
                    ${
                      order.status === s
                        ? "bg-orange-500 text-white"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
