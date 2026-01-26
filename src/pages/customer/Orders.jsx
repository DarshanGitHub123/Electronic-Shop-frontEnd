import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/order.api";
import { Package, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Calendar, CreditCard } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    getMyOrders().then(res => {
      const sortedOrders = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          My Orders
        </h2>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700">
          <Package className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No Orders Yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Looks like you haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Start Shopping
          </a>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Order Header */}
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* Order ID & Date */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                    {order.status === "Rejected" && (
                      <span className="text-xs font-medium text-red-600 dark:text-red-400 italic">
                        — Items are out of stock
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{order.totalAmount || "0"}</p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Package className="w-4 h-4" />
                  <span>{order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}</span>
                </div>

                <button
                  onClick={() => toggleOrderExpansion(order._id)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {expandedOrder === order._id ? (
                    <>
                      Hide Details <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View Details <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder === order._id && (
              <div className="bg-gray-50 dark:bg-slate-900 p-4 md:p-6 border-t border-gray-200 dark:border-slate-700">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-lg"
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">📱</span>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Quantity: {item.quantity} × ₹{item.price}
                        </p>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          ₹{(Number(item.quantity) * Number(item.price)) || "0"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment & Delivery Info */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold text-gray-800 dark:text-white">Payment Info</h5>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Payment Method: <span className="font-medium">{order.paymentDetails?.method || "N/A"}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Status: <span className={`font-medium ${order.paymentDetails?.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentDetails?.status || "Pending"}
                      </span>
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <h5 className="font-semibold text-gray-800 dark:text-white">Delivery Status</h5>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Status: <span className="font-medium">{order.status}</span>
                    </p>
                    {order.status === "Rejected" ? (
                      <p className="text-xs text-red-600 font-bold mt-1">
                        Reason: Items are out of stock
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expected: <span className="font-medium">3-5 Business Days</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
