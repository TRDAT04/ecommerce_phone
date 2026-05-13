import OverviewCards from "../components/OverviewCards";
import RevenueChart from "../components/RevenueChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import OrderStatusPieChart from "../components/OrderStatusPieChart";
import TopProducts from "../components/TopProducts";
import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const now = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tổng quan hệ thống</h1>
            <p className="text-sm text-gray-500">Cập nhật realtime – {now}</p>
          </div>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-700">Live</span>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Revenue Chart + Pie Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <OrderStatusPieChart />
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div className="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <TopProducts />
        </div>
      </div>
    </div>
  );
}