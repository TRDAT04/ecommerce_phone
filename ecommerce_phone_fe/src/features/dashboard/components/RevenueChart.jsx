import { useEffect, useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { TrendingUp, Wallet, BarChart2 } from "lucide-react";
import { getRevenue } from "../api/dashboardService";

const FULL_MONTHS = [
  "2026-01","2026-02","2026-03","2026-04","2026-05","2026-06",
  "2026-07","2026-08","2026-09","2026-10","2026-11","2026-12",
];

const MONTH_LABELS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

// Custom tooltip
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl">
      <p className="mb-1 text-xs font-semibold text-gray-500">Tháng {label}</p>
      <p className="text-base font-bold text-emerald-600">
        {payload[0].value.toLocaleString("vi-VN")}₫
      </p>
    </div>
  );
}

export default function RevenueChart() {
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    getRevenue().then((res) => setRevenue(res.data));
  }, []);

  const data = useMemo(() => {
    if (!revenue) return [];
    return FULL_MONTHS.map((m, i) => {
      const found = revenue.find((r) => r.month === m);
      return {
        month: MONTH_LABELS[i],
        revenue: found ? found.revenue : 0,
      };
    });
  }, [revenue]);

  const totalRevenue = useMemo(
    () => data.reduce((sum, item) => sum + item.revenue, 0),
    [data]
  );

  const peakMonth = useMemo(() => {
    if (!data.length) return null;
    return data.reduce((best, item) => (item.revenue > best.revenue ? item : best), data[0]);
  }, [data]);

  if (!revenue) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="h-5 w-28 rounded-full bg-gray-200" />
            <div className="mt-2 h-3.5 w-20 rounded-full bg-gray-100" />
          </div>
          <div className="h-8 w-32 rounded-xl bg-gray-200" />
        </div>
        <div className="h-72 w-full rounded-2xl bg-gradient-to-r from-gray-100 via-gray-150 to-gray-100" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
            <TrendingUp size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
            <p className="text-xs text-gray-400">Biểu đồ cả năm 2026</p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-100">
            <Wallet size={13} className="text-emerald-600" />
            <div>
              <p className="text-[10px] text-emerald-600 font-medium">Tổng năm</p>
              <p className="text-xs font-bold text-emerald-700">{totalRevenue.toLocaleString("vi-VN")}₫</p>
            </div>
          </div>
          {peakMonth && peakMonth.revenue > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 ring-1 ring-blue-100">
              <BarChart2 size={13} className="text-blue-600" />
              <div>
                <p className="text-[10px] text-blue-600 font-medium">Tháng cao nhất</p>
                <p className="text-xs font-bold text-blue-700">Tháng {peakMonth.month}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickFormatter={(v) => v >= 1_000_000 ? (v / 1_000_000).toFixed(0) + "M" : v / 1000 + "K"}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#revenueGrad)"
              dot={{ r: 3, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#059669", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <TrendingUp size={12} className="text-emerald-500" />
          Cập nhật realtime
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-500">2026</span>
      </div>
    </div>
  );
}
