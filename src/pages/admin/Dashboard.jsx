import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

import { getAllOrders } from "../../api/order.api";
import { getProducts } from "../../api/product.api";

const COLORS = ["#6366F1", "#22C55E", "#F97316", "#EF4444"];

export default function Dashboard() {
  const [orderStats, setOrderStats] = useState([]);
  const [productTimeline, setProductTimeline] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      const orders = (await getAllOrders()).data;
      const products = (await getProducts()).data;

      /* ORDERS BY STATUS */
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

      /* PRODUCTS OVER TIME */
      const timeline = {};
      products.forEach(p => {
        const date = new Date(p.createdAt).toLocaleDateString();
        timeline[date] = (timeline[date] || 0) + 1;
      });
      setProductTimeline(
        Object.entries(timeline).map(([date, count]) => ({
          date,
          count,
        }))
      );

      /* PRODUCTS PER CATEGORY */
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
    };

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-xl font-semibold tracking-wide">
          Dashboard Analytics
        </h1>
        <p className="text-sm text-white/60">
          Visual overview of orders and products
        </p>
      </div>

      {/* 📊 RESPONSIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* GRAPH 1 */}
        <div className="
          bg-white/10
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-5
          shadow-glass
        ">
          <h2 className="text-sm font-medium mb-3 text-white/80">
            Orders by Status
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStats}>
                <XAxis
                  dataKey="status"
                  tick={{ fill: "#e5e7eb", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#e5e7eb", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2 */}
        <div className="
          bg-white/10
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-5
          shadow-glass
        ">
          <h2 className="text-sm font-medium mb-3 text-white/80">
            Products Added Over Time
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productTimeline}>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#e5e7eb", fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fill: "#e5e7eb", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3 */}
        <div className="
          bg-white/10
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-5
          shadow-glass
        ">
          <h2 className="text-sm font-medium mb-3 text-white/80">
            Products by Category
          </h2>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={85}
                  label={({ name }) =>
                    name.length > 10 ? name.slice(0, 10) + "…" : name
                  }
                >
                  {categoryStats.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,23,42,0.9)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
