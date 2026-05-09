import OverviewCards from "../components/OverviewCards";
import RevenueChart from "../components/RevenueChart";
import RecentOrdersTable from "../components/RecentOrdersTable";
import OrderStatusPieChart from "../components/OrderStatusPieChart";
import TopProducts from "../components/TopProducts";

import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  PieChart,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
          <LayoutDashboard
            size={22}
            className="text-green-600"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Trang quản trị hệ thống
          </h1>

          <p className="text-sm text-gray-500 mt-0.5">
            Tổng quan hoạt động cửa hàng
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Revenue + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        
          <RevenueChart />
        </div>

        {/* Pie */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
       

          <OrderStatusPieChart />
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    

          <RecentOrdersTable />
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    

          <TopProducts />
        </div>
      </div>
    </div>
  );
}