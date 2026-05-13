import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { PieChart as PieChartIcon, ShoppingBag } from "lucide-react";
import { getRecentOrders } from "../api/dashboardService";

const STATUS_CONFIG = {
  DONE:      { label: "Hoàn thành",   color: "#10b981", bg: "bg-emerald-50",  text: "text-emerald-700", dot: "bg-emerald-400" },
  CONFIRMED: { label: "Đã xác nhận",  color: "#8b5cf6", bg: "bg-violet-50",   text: "text-violet-700",  dot: "bg-violet-400" },
  PENDING:   { label: "Chờ xác nhận", color: "#f59e0b", bg: "bg-amber-50",    text: "text-amber-700",   dot: "bg-amber-400" },
  SHIPPING:  { label: "Đang giao",    color: "#3b82f6", bg: "bg-blue-50",     text: "text-blue-700",    dot: "bg-blue-400" },
  CANCELLED: { label: "Đã hủy",       color: "#ef4444", bg: "bg-red-50",      text: "text-red-600",     dot: "bg-red-400" },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-gray-500">{item.name}</p>
      <p className="text-base font-bold" style={{ color: item.payload.fill }}>
        {item.value} đơn
      </p>
    </div>
  );
}

export default function OrderStatusPieChart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gray-200" />
          <div>
            <div className="h-4 w-32 rounded-full bg-gray-200" />
            <div className="mt-1.5 h-3 w-24 rounded-full bg-gray-100" />
          </div>
        </div>
        <div className="mx-auto h-48 w-48 rounded-full bg-gray-200" />
        <div className="mt-4 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
              <div className="h-3 w-24 rounded-full bg-gray-200" />
              <div className="h-3 w-10 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-400">Không có dữ liệu</p>
      </div>
    );
  }

  // Group by status
  const grouped = Object.values(
    orders.reduce((acc, order) => {
      if (!order.status) return acc;
      if (!acc[order.status]) {
        acc[order.status] = {
          name: STATUS_CONFIG[order.status]?.label || order.status,
          raw: order.status,
          value: 0,
          fill: STATUS_CONFIG[order.status]?.color || "#9ca3af",
        };
      }
      acc[order.status].value++;
      return acc;
    }, {})
  );

  const total = grouped.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm">
          <PieChartIcon size={17} className="text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Trạng thái đơn hàng</h2>
          <p className="text-xs text-gray-400">Phân bố {total} đơn gần đây</p>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="relative h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={grouped}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              strokeWidth={0}
            >
              {grouped.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-extrabold text-gray-800">{total}</p>
          <p className="text-xs text-gray-400">Tổng đơn</p>
        </div>
      </div>

      {/* Legend list */}
      <div className="mt-4 space-y-2">
        {grouped
          .sort((a, b) => b.value - a.value)
          .map((item) => {
            const cfg = STATUS_CONFIG[item.raw];
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
            return (
              <div
                key={item.raw}
                className={`flex items-center justify-between rounded-xl px-3 py-2 ${cfg?.bg || "bg-gray-50"}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${cfg?.dot || "bg-gray-400"}`} />
                  <span className={`text-xs font-medium ${cfg?.text || "text-gray-600"}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${cfg?.text || "text-gray-600"}`}>
                    {item.value}
                  </span>
                  <span className="rounded-full bg-white/60 px-1.5 py-0.5 text-[10px] text-gray-400">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
