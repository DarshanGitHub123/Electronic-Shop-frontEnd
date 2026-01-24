import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

import { getAllOrders } from "../../api/order.api";
import { getProducts } from "../../api/product.api";
import { getAllUsers } from "../../api/user.api";
import { Users, ShoppingBag, Package, DollarSign, Activity, AlertTriangle } from "lucide-react";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444", "#8B5CF6"];

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });
  const [orderStats, setOrderStats] = useState([]);
  const [productTimeline, setProductTimeline] = useState([]);
  const [revenueTimeline, setRevenueTimeline] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [inventoryStats, setInventoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          getAllOrders(),
          getProducts(),
          getAllUsers()
        ]);

        const orders = ordersRes.data;
        const products = productsRes.data;
        const allUsers = usersRes.data;

        /* 1. TOP STATS */
        const paidOrders = orders.filter(o => o.paymentDetails?.status === "Paid");
        const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const customersCount = allUsers.filter(u => u.role === "Customer").length;

        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          products: products.length,
          customers: customersCount
        });

        /* 2. ORDERS BY STATUS */
        const statusCount = {};
        orders.forEach(o => {
          statusCount[o.status] = (statusCount[o.status] || 0) + 1;
        });
        setOrderStats(
          Object.entries(statusCount).map(([status, count]) => ({
            status,
            count,
          }))
        );

        /* 3. PRODUCTS OVER TIME (FIXED CHRONOLOGY) */
        const productMap = {};
        // Sort products by date first
        const sortedProducts = [...products].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        sortedProducts.forEach(p => {
          const date = new Date(p.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short"
          });
          productMap[date] = (productMap[date] || 0) + 1;
        });

        setProductTimeline(
          Object.entries(productMap).map(([date, count]) => ({
            date,
            count,
          }))
        );

        /* 4. REVENUE TIMELINE (SALES OVER TIME) */
        const revMap = {};
        const sortedPaidOrders = [...paidOrders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        sortedPaidOrders.forEach(o => {
          const date = new Date(o.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short"
          });
          revMap[date] = (revMap[date] || 0) + o.totalAmount;
        });

        setRevenueTimeline(
          Object.entries(revMap).map(([date, revenue]) => ({
            date,
            revenue,
          }))
        );

        /* 5. PRODUCTS PER CATEGORY */
        const categoryCount = {};
        products.forEach(p => {
          const cat = p.category?.categoryName || "Other";
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });
        setCategoryStats(
          Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value,
          }))
        );

        /* 6. INVENTORY HEALTH */
        let inStock = 0, lowStock = 0, outOfStock = 0;
        products.forEach(p => {
          if (p.stock <= 0) outOfStock++;
          else if (p.stock < 10) lowStock++;
          else inStock++;
        });
        setInventoryStats([
          { name: "Healthy", value: inStock, color: "#22C55E" },
          { name: "Low Stock", value: lowStock, color: "#F97316" },
          { name: "Out of Stock", value: outOfStock, color: "#EF4444" }
        ]);

      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Activity size={40} className="text-orange-500 animate-pulse" />
        <p className="text-white/60 animate-pulse">Computing real-time analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="text-sm text-white/50">
            Real-time performance metrics for ElectroShop
          </p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
          <span className="text-xs font-bold text-white/80 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* 🚀 QUICK STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-emerald-600" },
          { label: "Active Orders", value: stats.orders, icon: ShoppingBag, color: "from-blue-500 to-indigo-600" },
          { label: "Total Products", value: stats.products, icon: Package, color: "from-orange-500 to-red-600" },
          { label: "Total Customers", value: stats.customers, icon: Users, color: "from-purple-500 to-pink-600" },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-glass flex items-center gap-4 group hover:bg-white/15 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-wider">{item.label}</p>
              <h3 className="text-xl font-black text-white">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 📈 MAIN GRAPH: REVENUE TIMELINE */}
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-glass space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Sales Revenue Trend</h2>
            <div className="text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-lg uppercase">Revenue Tracking</div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTimeline}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "#fff" }}
                  itemStyle={{ color: "#818CF8" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🏥 INVENTORY HEALTH PIE */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-glass flex flex-col items-center justify-between">
          <div className="text-center w-full">
            <h2 className="text-lg font-bold text-white mb-1">Inventory Health</h2>
            <p className="text-xs text-white/40 mb-4">Product availability check</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {inventoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-2 mt-4">
            {inventoryStats.map((stat, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-white/60 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: stat.color }} />
                  {stat.name}
                </span>
                <span className="font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 📊 ORDERS BY STATUS BARS */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-glass space-y-6">
          <h2 className="text-lg font-bold text-white">Order Status Volume</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStats}>
                <XAxis dataKey="status" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }} />
                <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 📉 PRODUCTS TIMELINE (FIXED) */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-glass space-y-6">
          <h2 className="text-lg font-bold text-white">Products Catalog Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productTimeline}>
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px" }} />
                <Line type="stepAfter" dataKey="count" stroke="#22C55E" strokeWidth={3} dot={{ r: 4, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CATEGORY DISTRIBUTION */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[40px] shadow-glass">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">Category Distribution</h2>
          <p className="text-sm text-white/40">Broad overview of your product ecosystem</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {categoryStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
