import { useEffect, useState, useMemo, useCallback } from "react";
import { ResponsiveContainer } from "recharts";
import { TrendingUp, ChevronDown } from "lucide-react";

import { getRevenue, getRevenueSummary } from "../api/dashboardService";
import {
  THIS_YEAR, YEARS, MONTH_KEYS, MONTH_LABELS, CHART_TYPES,
} from "./revenue/revenueConstants";
import RevenueKPIChips          from "./revenue/RevenueKPIChips";
import RevenueChartRenderer     from "./revenue/RevenueChartRenderer";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function RevenueChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="h-5 w-32 rounded-full bg-gray-200" />
          <div className="mt-2 h-3 w-20 rounded-full bg-gray-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 rounded-xl bg-gray-200" />
          <div className="h-8 w-24 rounded-xl bg-gray-200" />
        </div>
      </div>
      <div className="mb-4 flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 rounded-xl bg-gray-100" />
        ))}
      </div>
      <div className="h-72 w-full rounded-2xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RevenueChart() {
  const [year,       setYear]       = useState(THIS_YEAR);
  const [chartType,  setChartType]  = useState("area");
  const [revenue,    setRevenue]    = useState(null);
  const [summary,    setSummary]    = useState(null);

  // Fetch khi năm thay đổi
  useEffect(() => {
    setRevenue(null);
    setSummary(null);
    Promise.all([getRevenue(year), getRevenueSummary(year)]).then(
      ([revRes, sumRes]) => {
        setRevenue(revRes.data);
        setSummary(sumRes.data);
      }
    );
  }, [year]);

  // Build 12 tháng chart data
  const data = useMemo(() => {
    if (!revenue) return [];
    return MONTH_KEYS.map((key, i) => {
      const found = revenue.find((r) => r.month === `${year}-${key}`);
      return {
        month:         MONTH_LABELS[i],
        monthIndex:    i,
        revenue:       found?.revenue       ?? 0,
        orderCount:    found?.orderCount    ?? 0,
        avgOrderValue: found?.avgOrderValue ?? 0,
      };
    });
  }, [revenue, year]);

  // MoM growth (tháng hiện tại vs tháng trước)
  const currentMonthIdx = new Date().getMonth();
  const momGrowth = useMemo(() => {
    if (data.length < 2) return null;
    const cur  = data[currentMonthIdx]?.revenue     ?? 0;
    const prev = data[currentMonthIdx - 1]?.revenue ?? 0;
    if (prev <= 0) return null;
    return ((cur - prev) / prev) * 100;
  }, [data, currentMonthIdx]);

  if (!revenue) return <RevenueChartSkeleton />;

  const commonProps = {
    margin: { top: 4, right: 4, left: 0, bottom: 0 },
  };

  return (
    <>
      {/* ── Header ── */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
            <TrendingUp size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Doanh thu theo tháng</h2>
            <p className="text-xs text-gray-400">
              Tổng quan biểu đồ năm {year}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="appearance-none rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-7 text-xs font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 cursor-pointer"
            >
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <ChevronDown
              size={12}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          {/* Chart type toggle */}
          <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
            {CHART_TYPES.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setChartType(id)}
                title={label}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                  chartType === id
                    ? "bg-white shadow-sm text-emerald-700 ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Chips ── */}
      <RevenueKPIChips summary={summary} year={year} momGrowth={momGrowth} />

      {/* ── Chart ── */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RevenueChartRenderer
            chartType={chartType}
            data={data}
            commonProps={commonProps}
          />
        </ResponsiveContainer>
      </div>

      {/* ── Footer ── */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <TrendingUp size={12} className="text-emerald-500" />
          Biểu đồ hiển thị doanh thu các đơn hàng thành công
        </span>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-500">
          {year}
        </span>
      </div>
    </>
  );
}
