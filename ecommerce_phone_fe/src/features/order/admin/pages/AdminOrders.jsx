import { useNavigate } from "react-router-dom";
import {
  Package, Search, Clock, Truck, CheckCircle2,
  ChevronRight, Filter,
} from "lucide-react";
import { useAdminOrders } from "../hooks/useAdminOrders";
import { usePagination } from "../../../../hooks/usePagination";
import Pagination from "../../../../components/common/Pagination";

const STATUS_MAP = {
  PENDING: {
    text: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
  },
  CONFIRMED: {
    text: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-400",
  },
  SHIPPING: {
    text: "Đang giao",
    color: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dot: "bg-purple-400",
  },
  DONE: {
    text: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
  },
  CANCELLED: {
    text: "Đã hủy",
    color: "bg-red-50 text-red-600 ring-1 ring-red-200",
    dot: "bg-red-400",
  },
};

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DONE", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function AdminOrders() {
  const { orders, status, setStatus, setPhone, fetchOrders } = useAdminOrders();
  const navigate = useNavigate();

  const {
    paginatedData: paginatedOrders,
    page,
    totalPages,
    setPage,
    resetPage,
    handlePrev,
    handleNext,
    getPageNumbers,
    rangeText,
  } = usePagination(orders, 10);

  // Stats summary
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    shipping: orders.filter((o) => o.status === "SHIPPING").length,
    done: orders.filter((o) => o.status === "DONE").length,
  };

  const handleFetch = () => {
    resetPage();
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-md">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Quản lý đơn hàng</h1>
              <p className="text-sm text-gray-500">Tổng cộng {stats.total} đơn hàng</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Tổng đơn", value: stats.total, icon: Package, bg: "from-gray-700 to-gray-900", text: "text-white" },
            { label: "Chờ xác nhận", value: stats.pending, icon: Clock, bg: "from-amber-400 to-orange-500", text: "text-white" },
            { label: "Đang giao", value: stats.shipping, icon: Truck, bg: "from-purple-500 to-violet-600", text: "text-white" },
            { label: "Hoàn thành", value: stats.done, icon: CheckCircle2, bg: "from-emerald-400 to-green-600", text: "text-white" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-4 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-medium opacity-80 ${card.text}`}>{card.label}</p>
                    <p className={`mt-1 text-2xl font-extrabold ${card.text}`}>{card.value}</p>
                  </div>
                  <div className="rounded-lg bg-white/20 p-2">
                    <Icon size={18} className={card.text} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Filter size={15} />
            Lọc:
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-gray-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-100">
            <Search size={15} className="flex-shrink-0 text-gray-400" />
            <input
              placeholder="Tìm theo số điện thoại..."
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            onClick={handleFetch}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-95"
          >
            <Filter size={14} />
            Lọc
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          {/* Table Header */}
          <div className="hidden border-b border-gray-100 bg-gray-50/80 px-5 py-3 md:grid md:grid-cols-5">
            {["Mã đơn", "Khách hàng", "Số điện thoại", "Tổng tiền", "Trạng thái"].map((h, i) => (
              <span
                key={h}
                className={`text-xs font-semibold uppercase tracking-wide text-gray-500 ${i === 4 ? "text-right" : ""}`}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Empty */}
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package size={40} className="mb-3 text-gray-200" />
              <p className="font-medium text-gray-400">Không có đơn hàng nào</p>
              <p className="mt-1 text-sm text-gray-300">Thử thay đổi bộ lọc để tìm kiếm</p>
            </div>
          )}

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {paginatedOrders.map((o) => {
              const s = STATUS_MAP[o.status] || {
                text: o.status,
                color: "bg-gray-100 text-gray-600",
                dot: "bg-gray-300",
              };

              return (
                <div
                  key={o.id}
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="group grid cursor-pointer items-center gap-4 px-5 py-4 transition-all hover:bg-gray-50 md:grid-cols-5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-800">#{o.orderCode}</span>
                  </div>

                  <div>
                    <p className="font-medium text-gray-800">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString("vi-VN")}</p>
                  </div>

                  <div className="text-sm text-gray-600">{o.phone}</div>

                  <div className="font-bold text-red-500">
                    {(o.totalPrice || 0).toLocaleString()}đ
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                      {s.text}
                    </span>
                    <ChevronRight
                      size={15}
                      className="text-gray-200 transition-transform group-hover:translate-x-1 group-hover:text-gray-400"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            rangeText={rangeText}
            onPrev={handlePrev}
            onNext={handleNext}
            onPageSelect={setPage}
            getPageNumbers={getPageNumbers}
            accentColor="gray"
          />
        </div>
      </div>
    </div>
  );
}