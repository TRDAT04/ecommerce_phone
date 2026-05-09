import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { PieChart as PieChartIcon, ShoppingBag } from "lucide-react";

import { getRecentOrders } from "../api/dashboardService";

const COLORS = {
  DONE: "#22c55e",
  CONFIRMED: "#a855f7",
  PENDING: "#f59e0b",
  SHIPPING: "#3b82f6",
  CANCELLED: "#ef4444",
};

const STATUS_LABEL = {
  DONE: "Hoàn thành",
  CONFIRMED: "Đã xác nhận",
  PENDING: "Chờ xác nhận",
  SHIPPING: "Đang giao",
  CANCELLED: "Đã hủy",
};

export default function OrderStatusPieChart() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getRecentOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Empty
  if (!orders || orders.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center text-gray-400">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={24} />
        </div>
        Không có dữ liệu
      </div>
    );
  }

  // Group data
  const grouped = Object.values(
    orders.reduce((acc, order) => {
      if (!order.status) return acc;

      if (!acc[order.status]) {
        acc[order.status] = {
          name: STATUS_LABEL[order.status] || order.status,
          raw: order.status,
          value: 0,
        };
      }

      acc[order.status].value++;

      return acc;
    }, {}),
  );

  const total = grouped.reduce((sum, item) => sum + item.value, 0);

  const renderLabel = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="h-[400px] w-full rounded-2xl  bg-white p-2">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
          <PieChartIcon size={18} className="text-orange-500" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Trạng thái đơn hàng
          </h2>

          <p className="text-xs text-gray-400">Phân bố đơn hàng hiện tại</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="78%">
        <PieChart>
          <Pie
            data={grouped}
            dataKey="value"
            nameKey="name"
            label={renderLabel}
            outerRadius={95}
            strokeWidth={2}
          >
            {grouped.map((entry, index) => (
              <Cell key={index} fill={COLORS[entry.raw] || "#9ca3af"} />
            ))}
          </Pie>

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #f3f4f6",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
            formatter={(value, name) => [`${value} đơn`, name]}
          />

          {/* Legend */}
          <Legend
            wrapperStyle={{
              fontSize: "13px",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Footer */}
      <div className="mt-1 text-center text-sm text-gray-500">
        Tổng:
        <span className="ml-1 font-semibold text-gray-800">{total}</span> đơn
      </div>
    </div>
  );
}
