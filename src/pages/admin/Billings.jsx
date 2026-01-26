import { useEffect, useState, useRef } from "react";
import { getAllOrders } from "../../api/order.api";
import { FileText, Printer } from "lucide-react";
import { toast } from "react-toastify";

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

    toast.info("Preparing invoice for print...");
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

            {/* Serial Number */}
            <div className="text-sm">
              <p>
                <strong>Serial Number:</strong>{" "}
                {order.serialNumber}
              </p>
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
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1">Order Items</h4>

              {/* MOBILE ITEMS VIEW */}
              <div className="space-y-3 md:hidden">
                {order.items.map((item) => {
                  const base = item.product.price * item.quantity;
                  const tax = base * ((item.product.tax || 0) / 100);

                  return (
                    <div key={item._id} className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-white">{item.product.name}</span>
                        <span className="text-xs text-white/60">Qty: {item.quantity}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-white/50 uppercase">
                        <div className="flex flex-col">
                          <span>Base</span>
                          <span className="text-white text-xs">₹{base.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span>Tax</span>
                          <span className="text-white text-xs">₹{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span>Total</span>
                          <span className="text-orange-400 text-xs">₹{(base + tax).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DESKTOP ITEMS VIEW */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-white/60">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-center">Base</th>
                      <th className="p-3 text-center">Tax</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10 text-white/80">
                    {order.items.map((item) => {
                      const base = item.product.price * item.quantity;
                      const tax = base * ((item.product.tax || 0) / 100);

                      return (
                        <tr key={item._id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-medium text-white">{item.product.name}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-center">₹{base.toFixed(2)}</td>
                          <td className="p-3 text-center">₹{tax.toFixed(2)}</td>
                          <td className="p-3 text-right font-semibold text-white">
                            ₹{(base + tax).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

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
