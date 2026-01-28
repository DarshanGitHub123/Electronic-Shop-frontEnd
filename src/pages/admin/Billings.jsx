import { useEffect, useState, useRef } from "react";
import { getAllBills } from "../../api/billing.api";
import { FileText, Printer, Download } from "lucide-react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

export default function Billings() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Filters
  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const invoiceRefs = useRef({});

  useEffect(() => {
    const loadBills = async () => {
      try {
        const res = await getAllBills();
        setBills(res.data);
      } catch (error) {
        toast.error("Failed to load bills");
      } finally {
        setLoading(false);
      }
    };
    loadBills();
  }, []);

  const handlePrint = (billId) => {
    const content = invoiceRefs.current[billId]?.innerHTML;

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

  const handleDownload = (bill) => {
    try {
      toast.info("Generating PDF...");

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 20, { align: "center" });

      doc.setFontSize(10);
      doc.text(`Bill Number: ${bill.billNumber}`, 20, 35);
      doc.text(`Order Serial: ${bill.orderSerialNumber}`, 20, 42);
      doc.text(`Date: ${new Date(bill.createdAt).toLocaleString()}`, 20, 49);

      // Customer Info
      doc.setFontSize(12);
      doc.text("Customer Details:", 20, 60);
      doc.setFontSize(10);
      doc.text(`Name: ${bill.customerInfo.name}`, 20, 67);
      doc.text(`Email: ${bill.customerInfo.email}`, 20, 74);

      // Items Table Header
      let yPos = 90;
      doc.setFontSize(12);
      doc.text("Items:", 20, yPos);
      yPos += 7;

      doc.setFontSize(9);
      doc.text("Product", 20, yPos);
      doc.text("Qty", 100, yPos);
      doc.text("Base", 120, yPos);
      doc.text("Tax", 145, yPos);
      doc.text("Total", 170, yPos);
      yPos += 5;

      // Draw line
      doc.line(20, yPos, 190, yPos);
      yPos += 5;

      // Items
      bill.items.forEach((item) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.text(item.name.substring(0, 30), 20, yPos);
        doc.text(item.quantity.toString(), 100, yPos);
        doc.text(`₹${item.baseAmount.toFixed(2)}`, 120, yPos);
        doc.text(`₹${item.taxAmount.toFixed(2)}`, 145, yPos);
        doc.text(`₹${item.totalAmount.toFixed(2)}`, 170, yPos);
        yPos += 7;
      });

      // Totals
      yPos += 5;
      doc.line(20, yPos, 190, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.text("Subtotal:", 120, yPos);
      doc.text(`₹${bill.calculations.subtotal.toFixed(2)}`, 170, yPos);
      yPos += 7;

      doc.text("Tax:", 120, yPos);
      doc.text(`₹${bill.calculations.totalTax.toFixed(2)}`, 170, yPos);
      yPos += 7;

      doc.setFontSize(12);
      doc.text("Grand Total:", 120, yPos);
      doc.text(`₹${bill.calculations.grandTotal.toFixed(2)}`, 170, yPos);

      // Save PDF
      doc.save(`Invoice-${bill.billNumber}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-white/60">
        Loading invoices…
      </p>
    );
  }

  // ✅ FILTER LOGIC
  const filteredBills = bills.filter((bill) => {
    const serialMatch = bill.billNumber
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const orderSerialMatch = bill.orderSerialNumber
      ?.toLowerCase()
      .includes(searchText.toLowerCase());

    const billDate = new Date(bill.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate + "T23:59:59") : null;

    const dateMatch =
      (!from || billDate >= from) &&
      (!to || billDate <= to);

    return (serialMatch || orderSerialMatch) && dateMatch;
  });

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


      {/* 🔍 SEARCH & FILTERS */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Bill Number or Order Serial"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none"
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
        />
      </div>



      {filteredBills.map((bill) => {
        return (
          <div
            key={bill._id}
            ref={(el) =>
              (invoiceRefs.current[bill._id] = el)
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
                  Bill #{bill.billNumber}
                </p>
                <p className="text-xs opacity-70">
                  Order: {bill.orderSerialNumber}
                </p>
                <p className="text-xs opacity-70">
                  {new Date(bill.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(bill)}
                  className="
                    flex items-center gap-2
                    px-3 py-1.5 rounded-xl
                    text-xs bg-green-600 text-white hover:bg-green-700 transition
                  "
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handlePrint(bill._id)}
                  className="
                    flex items-center gap-2
                    px-3 py-1.5 rounded-xl
                    text-xs bg-indigo-600 text-white hover:bg-indigo-700 transition
                  "
                >
                  <Printer size={14} />
                  Print
                </button>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="text-sm">
              <p>
                <strong>Customer:</strong>{" "}
                {bill.customerInfo.name}
              </p>
              <p className="text-xs">
                {bill.customerInfo.email}
              </p>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 pb-1">Order Items</h4>

              {/* MOBILE ITEMS VIEW */}
              <div className="space-y-3 md:hidden">
                {bill.items.map((item) => {
                  return (
                    <div key={item._id} className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-white/60">Qty: {item.quantity}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-medium text-white/50 uppercase">
                        <div className="flex flex-col">
                          <span>Base</span>
                          <span className="text-white text-xs">₹{item.baseAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span>Tax</span>
                          <span className="text-white text-xs">₹{item.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span>Total</span>
                          <span className="text-orange-400 text-xs">₹{item.totalAmount.toFixed(2)}</span>
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
                    {bill.items.map((item) => {
                      return (
                        <tr key={item._id} className="hover:bg-white/5 transition">
                          <td className="p-3 font-medium text-white">{item.name}</td>
                          <td className="p-3 text-center">{item.quantity}</td>
                          <td className="p-3 text-center">₹{item.baseAmount.toFixed(2)}</td>
                          <td className="p-3 text-center">₹{item.taxAmount.toFixed(2)}</td>
                          <td className="p-3 text-right font-semibold text-white">
                            ₹{item.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TOTALS - Using backend calculations */}
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{bill.calculations.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{bill.calculations.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Grand Total</span>
                <span className="text-green-400">
                  ₹{bill.calculations.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {filteredBills.length === 0 && (
        <div className="p-10 text-center text-white/40 bg-white/5 rounded-2xl border border-dashed border-white/20">
          {searchText || fromDate || toDate ? `No bills found matching your filters` : "No bills available"}
        </div>
      )}
    </div>
  );
}
