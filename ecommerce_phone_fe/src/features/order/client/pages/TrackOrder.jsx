import { useNavigate } from "react-router-dom";
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ChevronRight, Receipt } from "lucide-react";
import { useTrackOrder } from "../hooks/useTrackOrder";

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
    icon: Package,
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

export default function TrackOrder() {
  const { phone, setPhone, orders, error, setError, handleSearch } = useTrackOrder();
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
            <Search size={28} className="text-white" />
          </div>
          <h1 className="mb-1 text-3xl font-extrabold text-gray-900">Tra cứu đơn hàng</h1>
          <p className="text-gray-500">Nhập số điện thoại để tìm kiếm đơn hàng của bạn</p>
        </div>

        {/* Search Box */}
        <div className="mb-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Search size={18} className="text-blue-500" />
            </div>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Nhập số điện thoại đặt hàng..."
              className={`flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400 ${
                error ? "text-red-600" : ""
              }`}
            />
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-blue-200 transition-all hover:scale-105 active:scale-95"
            >
              Tra cứu
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="border-t border-red-50 bg-red-50 px-4 py-2.5">
              <p className="flex items-center gap-2 text-sm font-medium text-red-500">
                <XCircle size={14} />
                {error}
              </p>
            </div>
          )}
        </div>

        <p className="mb-6 text-center text-xs text-gray-400">
          Nhấn Enter hoặc bấm "Tra cứu" để tìm đơn hàng
        </p>

        {/* Results */}
        {orders.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-medium text-gray-600">
              Tìm thấy <span className="font-bold text-blue-600">{orders.length}</span> đơn hàng
            </p>
            <div className="space-y-3">
              {orders.map((o) => {
                const s = STATUS_MAP[o.status] || {
                  text: o.status,
                  color: "bg-gray-100 text-gray-700",
                  dot: "bg-gray-300",
                  icon: Package,
                };
                const Icon = s.icon;

                return (
                  <div
                    key={o.id}
                    onClick={() => navigate(`/order/${o.id}`)}
                    className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md hover:ring-blue-100"
                  >
                    {/* Top */}
                    <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100">
                          <Receipt size={16} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">Đơn #{o.id}</p>
                          <p className="text-xs text-gray-400">
                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        <Icon size={12} />
                        {s.text}
                      </span>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-500">Tổng tiền</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-500">
                          {o.totalPrice?.toLocaleString()}đ
                        </span>
                        <ChevronRight
                          size={15}
                          className="text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}