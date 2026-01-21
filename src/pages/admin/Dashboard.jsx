import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

import { getAllOrders } from "../../api/order.api";
import { getProducts } from "../../api/product.api";
import { getCategories } from "../../api/category.api";

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
    <div className="space-y-6">

      <h1 className="text-lg md:text-xl font-semibold">
        Dashboard Analytics
      </h1>

      {/* 📊 RESPONSIVE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* GRAPH 1: ORDERS BY STATUS */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-2">
            Orders by Status
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStats}>
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2: PRODUCTS OVER TIME */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-2">
            Products Added
          </h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productTimeline}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22C55E"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 3: PRODUCTS PER CATEGORY */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="text-sm font-medium mb-2">
            Products by Category
          </h2>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={({ name }) =>
                    name.length > 8 ? name.slice(0, 8) + "…" : name
                  }
                >
                  {categoryStats.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
