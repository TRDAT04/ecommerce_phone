import { useEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

import { TrendingUp, Wallet } from "lucide-react";

import { getRevenue } from "../api/dashboardService";

export default function RevenueChart() {
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    getRevenue().then((res) => setRevenue(res.data));
  }, []);

  const fullMonths = [
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
    "2026-05",
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
    "2026-12",
  ];

  const data = useMemo(() => {
    if (!revenue) return [];

    return fullMonths.map((m) => {
      const found = revenue.find((r) => r.month === m);

      return {
        month: m.slice(5),
        revenue: found ? found.revenue : 0,
      };
    });
  }, [revenue]);

  const totalRevenue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  }, [data]);

  // Loading
  if (!revenue) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="h-[320px] animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl bg-white p-6 transition-all hover:shadow-md">
      {/* HEADER */}
      <div className="mb-6 flex items-start justify-between">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp size={18} className="text-green-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800">Doanh thu</h2>

              <p className="text-sm text-gray-500">Tổng quan theo tháng</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="text-right">
          <div className="mb-1 flex items-center justify-end gap-1 text-xs text-gray-400">
            <Wallet size={13} />
            Tổng năm
          </div>

          <p className="text-xl font-bold text-emerald-600">
            {totalRevenue.toLocaleString()}₫
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            {/* Gradient */}
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />

                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />

            {/* X */}
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            {/* Y */}
            <YAxis
              tickFormatter={(v) => v / 1000000 + "M"}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                borderRadius: "14px",
                border: "1px solid #f3f4f6",
                background: "#fff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => value.toLocaleString() + "₫"}
              labelFormatter={(label) => `Tháng ${label}`}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#colorRevenue)"
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#059669"
              strokeWidth={2}
              dot={{
                r: 3,
                strokeWidth: 2,
                fill: "#fff",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <TrendingUp size={13} className="text-green-500" />
          Tăng trưởng ổn định
        </span>

        <span>Realtime data</span>
      </div>
    </div>
  );
}
