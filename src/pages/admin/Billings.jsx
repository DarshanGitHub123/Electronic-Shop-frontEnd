import { useEffect, useState, useRef } from "react";
import { getAllOrders } from "../../api/order.api";
import { FileText, Printer } from "lucide-react";

export default function Billings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const invoiceRefs = useRef({});

  useEffect(() => {
    const loadBills = async () => {
      try {
        const res = await getAllOrders();
        setOrders(res.data);
      } finally {
        setLoading(false);
      }
    };
    loadBills();
  }, []);

  const handlePrint = (orderId) => {
    const content =
      invoiceRefs.current[orderId]?.innerHTML;

    if (!content) return;

    const original = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 24px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border-bottom: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `;

    window.print();
    document.body.innerHTML = original;
    window.location.reload(); // restore React safely
  };

  if (loading) {
    return (
      <p className="text-sm text-white/60">
        Loading invoices…
      </p>
    );
  }

  const paidOrders = orders.filter(
    (o) => o.paymentDetails?.status === "Paid"
  );

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <FileText size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-wide">
          Billings / Invoices
        </h1>
      </div>

      {paidOrders.map((order) => {
        let subTotal = 0;
        let totalTax = 0;

        order.items.forEach((item) => {
          const base =
            item.product.price * item.quantity;
          const tax =
            base * ((item.product.tax || 0) / 100);
          subTotal += base;
          totalTax += tax;
        });

        const grandTotal = subTotal + totalTax;

        return (
          <div
            key={order._id}
            ref={(el) =>
              (invoiceRefs.current[order._id] = el)
            }
            className="
              bg-white/10 backdrop-blur-xl
              border border-white/30
              rounded-2xl p-6 shadow-glass
              space-y-4
            "
          >
            {/* HEADER */}
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">
                  Invoice #{order._id.slice(-6)}
                </p>
                <p className="text-xs opacity-70">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handlePrint(order._id)}
                className="
                  flex items-center gap-2
                  px-3 py-1.5 rounded-xl
                  text-xs bg-indigo-600 text-white
                "
              >
                <Printer size={14} />
                Print
              </button>
            </div>

            {/* CUSTOMER */}
            <div className="text-sm">
              <p>
                <strong>Customer:</strong>{" "}
                {order.user?.name}
              </p>
              <p className="text-xs">
                {order.user?.email}
              </p>
            </div>

            {/* CUSTOMIZATION */}
            {order.customizationDescription && (
              <div className="text-sm bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-2">
                <p className="text-[10px] font-bold uppercase text-indigo-300">Notes / Customization</p>
                <p className="text-xs italic text-white/90">"{order.customizationDescription}"</p>
              </div>
            )}

            {/* ITEMS */}
            <table className="w-full text-sm border-1px">
              <thead>
                <tr>
                  <th className="text-left">Product</th>
                  <th className="text-left">Qty</th>
                  <th className="text-left">Base</th>
                  <th className="text-left">Tax</th>
                  <th className="text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => {
                  const base =
                    item.product.price *
                    item.quantity;
                  const tax =
                    base *
                    ((item.product.tax || 0) / 100);

                  return (
                    <tr key={item._id}>
                      <td>{item.product.name}</td>
                      <td>{item.quantity}</td>
                      <td>₹{base.toFixed(2)}</td>
                      <td>₹{tax.toFixed(2)}</td>
                      <td>
                        ₹{(base + tax).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* TOTALS */}
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span className="text-green-400">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
