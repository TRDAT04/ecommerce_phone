import { useEffect, useState } from "react";
import { getRecentOrders } from "../api/dashboardService";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, Clock3, CheckCircle2,
  Truck, XCircle, ShieldCheck, ArrowRight,
} from "lucide-react";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../components/common/Pagination";

const STATUS = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-400",
    icon: Clock3,
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-400",
    icon: ShieldCheck,
  },
  SHIPPING: {
    label: "Đang giao",
    color: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    dot: "bg-purple-400",
    icon: Truck,
  },
  DONE: {
    label: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-50 text-red-600 ring-1 ring-red-200",
    dot: "bg-red-400",
    icon: XCircle,
  },
};

const PAGE_SIZE = 5;

const formatDate = (date) => new Date(date).toLocaleString("vi-VN");
const formatPrice = (price) => price?.toLocaleString("vi-VN") + "₫";

const AVATAR_COLORS = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-green-500",
  "from-violet-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-orange-400 to-amber-500",
];

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const {
    paginatedData: paginatedOrders,
    page,
    totalPages,
    setPage,
    handlePrev,
    handleNext,
    getPageNumbers,
    rangeText,
  } = usePagination(orders ?? [], PAGE_SIZE);

  useEffect(() => {
    getRecentOrders()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi API recent-order", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded-full bg-gray-200" />
          <div className="h-4 w-16 rounded-full bg-gray-100" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 rounded-full bg-gray-200" />
              <div className="h-3 w-20 rounded-full bg-gray-100" />
            </div>
            <div className="h-6 w-20 rounded-full bg-gray-200" />
            <div className="h-3.5 w-24 rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag size={24} className="text-gray-400" />
        </div>
        <p className="font-medium text-gray-400">Không có đơn hàng gần đây</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <ShoppingBag size={17} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">Đơn hàng gần đây</h2>
            <p className="text-xs text-gray-400">{orders.length} đơn mới nhất</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/orders")}
          className="group flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
        >
          Xem tất cả
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Mã đơn", "Khách hàng", "Tổng tiền", "Trạng thái", "Ngày tạo"].map((h) => (
                <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o, idx) => {
              const status = STATUS[o.status] || {
                label: o.status,
                color: "bg-gray-100 text-gray-700",
                dot: "bg-gray-400",
                icon: Clock3,
              };
              const StatusIcon = status.icon;
              const globalIdx = (page - 1) * PAGE_SIZE + idx;
              const avatarGradient = AVATAR_COLORS[globalIdx % AVATAR_COLORS.length];
              const initial = o.customerName?.charAt(0)?.toUpperCase() || "?";

              return (
                <tr
                  key={o.id}
                  className="group cursor-pointer border-b border-gray-50 transition-all last:border-0 hover:bg-gray-50/80"
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                >
                  <td className="py-3.5 font-bold text-gray-700">#{o.id}</td>

                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-xs font-bold text-white shadow-sm`}>
                        {initial}
                      </div>
                      <span className="font-medium text-gray-700">{o.customerName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 font-semibold text-gray-800">{formatPrice(o.totalPrice)}</td>

                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                  </td>

                  <td className="whitespace-nowrap py-3.5 text-xs text-gray-400">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination
          page={page}
          totalPages={totalPages}
          rangeText={rangeText}
          onPrev={handlePrev}
          onNext={handleNext}
          onPageSelect={setPage}
          getPageNumbers={getPageNumbers}
          accentColor="blue"
        />
      </div>
    </div>
  );
}