import { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  updateOrderPayment,
} from "../../api/order.api";
import { getProductById } from "../../api/product.api";
import { PackageCheck } from "lucide-react";
import { toast } from "react-toastify";

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
    try {
      await updateOrderStatus(id, { status });
      loadOrders();
      toast.success(`Order ${status}!`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await updateOrderPayment(id, { status: "Paid" });
      loadOrders();
      toast.success("Payment confirmed!");
    } catch {
      toast.error("Payment update failed");
    }
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
          Orders Management
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
                <p className="text-sm font-semibold text-white">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-xs text-white/60">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-xl w-fit font-bold
                  ${order.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : order.status === "Accepted"
                      ? "bg-purple-500/20 text-purple-300"
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
                <span className="font-medium text-white">
                  {order.user?.name}
                </span>
              </p>
              <p className="text-xs text-white/60">
                {order.user?.email}
              </p>
            </div>

            {/* CUSTOMIZATION NOTES */}
            {order.customizationDescription && (
              <div className="border-t border-white/10 pt-3 text-sm">
                <p className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                  <PackageCheck size={14} /> Customization Instructions
                </p>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-xs italic text-white/80 leading-relaxed">
                  "{order.customizationDescription}"
                </div>
              </div>
            )}

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
              <p className="font-medium mb-1 text-white">
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
            <div className="border-t border-white/10 pt-3 flex flex-col sm:flex-row sm:justify-between gap-2 text-sm items-center">
              <div className="flex gap-4">
                <p>
                  <span className="text-white/60">
                    Method:
                  </span>{" "}
                  <span className="text-white">{order.paymentDetails?.method}</span>
                </p>

                <p>
                  <span className="text-white/60">
                    Status:
                  </span>{" "}
                  <span
                    className={`text-xs px-2 py-0.5 rounded ml-1 font-bold
                      ${order.paymentDetails?.status === "Paid"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                      }`}
                  >
                    {order.paymentDetails?.status}
                  </span>
                </p>
              </div>

              {/* PAY BUTTON */}
              {order.status !== "Pending" && order.status !== "Rejected" && order.paymentDetails?.status === "Pending" && (
                <button
                  onClick={() => markAsPaid(order._id)}
                  className="px-4 py-1.5 rounded-xl text-xs bg-green-600 hover:bg-green-700 text-white font-bold transition shadow-lg"
                >
                  Mark as Paid
                </button>
              )}
            </div>

            {/* ITEMS */}
            <div className="border-t border-white/10 pt-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-white">
                  Items
                </p>
                <button
                  onClick={() => checkInventory(order)}
                  className="
                    px-4 py-1.5
                    rounded-xl
                    text-xs
                    bg-indigo-600
                    hover:bg-indigo-700
                    text-white
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

                    <div className="flex items-center gap-2 text-white">
                      <span>
                        ₹{(Number(item.price) *
                          item.quantity) || 0}
                      </span>

                      {status && (
                        <span
                          className={`text-xs px-2 py-1 rounded
                            ${status === "Available"
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
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                <span className="text-sm text-white/60">Grand Total</span>
                <span className="text-lg font-bold text-orange-400">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="border-t border-white/10 pt-3 space-y-3">
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Update Order Status</p>
              <div className="flex flex-wrap gap-2">
                {order.status === "Pending" && (
                  <>
                    <button
                      onClick={() => changeStatus(order._id, "Accepted")}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-700 text-white transition shadow-lg"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => changeStatus(order._id, "Rejected")}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition shadow-lg"
                    >
                      Reject Order
                    </button>
                  </>
                )}

                {order.status === "Accepted" && (
                  <>
                    <button
                      onClick={() => changeStatus(order._id, "OutForDelivery")}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition shadow-lg"
                    >
                      Out For Delivery
                    </button>
                    <button
                      onClick={() => changeStatus(order._id, "Delivered")}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-lg"
                    >
                      Mark Delivered
                    </button>
                  </>
                )}

                {order.status === "OutForDelivery" && (
                  <button
                    onClick={() => changeStatus(order._id, "Delivered")}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-lg"
                  >
                    Mark Delivered
                  </button>
                )}

                {(order.status === "Delivered" || order.status === "Rejected") && (
                  <p className="text-xs text-white/40 italic">This order is in a final state and cannot be changed.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
