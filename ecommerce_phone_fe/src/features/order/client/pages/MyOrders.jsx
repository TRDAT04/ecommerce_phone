import { useNavigate } from "react-router-dom";
import {
  Receipt, PackageSearch, Clock, Truck,
  CheckCircle2, XCircle, ChevronRight, ShoppingBag,
} from "lucide-react";
import { useMyOrders } from "../hooks/useMyOrders";

const STATUS_MAP = {
  PENDING: {
    text: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    icon: Clock,
  },
  CONFIRMED: {
    text: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-400",
    icon: PackageSearch,
  },
  SHIPPING: {
    text: "Đang giao hàng",
    color: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dot: "bg-purple-400",
    icon: Truck,
  },
  DONE: {
    text: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  CANCELLED: {
    text: "Đã hủy",
    color: "bg-red-50 text-red-600 ring-1 ring-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const TABS = [
  { key: "ALL", label: "Tất cả" },
  { key: "PENDING", label: "Chờ xác nhận" },
  { key: "SHIPPING", label: "Đang giao" },
  { key: "DONE", label: "Hoàn thành" },
  { key: "CANCELLED", label: "Đã hủy" },
];

export default function MyOrders() {
  const { orders, filteredOrders, activeTab, setActiveTab } = useMyOrders();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
          <PackageSearch className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Chưa có đơn hàng nào</h1>
        <p className="mb-6 text-gray-500">Hãy mua sắm để trải nghiệm nhé 😊</p>
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-8 py-3 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-105"
        >
          <ShoppingBag size={18} />
          Mua sắm ngay
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
            <Receipt size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Đơn hàng của tôi</h1>
            <p className="text-sm text-gray-500">{orders.length} đơn hàng</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const count =
              tab.key === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-200"
                    : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-100 hover:ring-red-200 hover:text-red-600"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Empty filtered */}
        {filteredOrders.length === 0 && (
          <div className="rounded-2xl bg-white py-14 text-center shadow-sm ring-1 ring-gray-100">
            <PackageSearch className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-gray-500">Không có đơn hàng nào trong mục này</p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((o) => {
            const status = STATUS_MAP[o.status] || {
              text: o.status,
              color: "bg-gray-100 text-gray-700",
              dot: "bg-gray-400",
              icon: Clock,
            };
            const Icon = status.icon;

            return (
              <div
                key={o.id}
                onClick={() => navigate(`/order/${o.orderCode}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-red-100"
              >
                {/* Card Top */}
                <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
                      <Receipt size={16} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Đơn #{o.orderCode}</p>
                      <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    <Icon size={13} />
                    {status.text}
                  </span>
                </div>

                {/* Card Bottom */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <div className="text-sm text-gray-500">
                    Tổng tiền thanh toán
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-500">
                      {o.totalPrice?.toLocaleString()}đ
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-red-400"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}