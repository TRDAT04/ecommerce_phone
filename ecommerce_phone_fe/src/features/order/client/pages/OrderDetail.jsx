import { useParams, useNavigate } from "react-router-dom";
import {
  User, MapPin, Package, ClipboardList, CheckCircle,
  Truck, Phone, FileText, XCircle, ArrowLeft,
  Clock, PackageSearch, CheckCircle2,
} from "lucide-react";
import { useOrderDetail } from "../hooks/useOrderDetail";

const STATUS_MAP = {
  PENDING: {
    text: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    icon: Clock,
  },
  CONFIRMED: {
    text: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    icon: PackageSearch,
  },
  SHIPPING: {
    text: "Đang giao hàng",
    color: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
    icon: Truck,
  },
  DONE: {
    text: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    text: "Đã hủy",
    color: "bg-red-50 text-red-600 ring-1 ring-red-200",
    icon: XCircle,
  },
};

const STEPS = [
  { key: "PENDING", label: "Đặt hàng", icon: ClipboardList },
  { key: "CONFIRMED", label: "Xác nhận", icon: Package },
  { key: "SHIPPING", label: "Giao hàng", icon: Truck },
  { key: "DONE", label: "Hoàn thành", icon: CheckCircle },
];

export default function OrderDetail() {
  const { id: orderCode } = useParams();
  const navigate = useNavigate();
  const { order, loading, handleCancel, canCancel } = useOrderDetail(orderCode);

  if (loading && !order)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-red-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Đang tải đơn hàng...</p>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Package size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );

  const status = STATUS_MAP[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  };
  const StatusIcon = status.icon;
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-red-500"
        >
          <ArrowLeft size={15} />
          Quay lại
        </button>

        {/* HEADER */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                  <ClipboardList size={13} />
                  <FileText size={13} />
                  {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
                <h1 className="text-xl font-bold text-white">Đơn hàng #{order.orderCode}</h1>
              </div>
              <span className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold ${status.color}`}>
                <StatusIcon size={14} />
                {status.text}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRESS TRACKER */}
        {!isCancelled && (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-5 text-sm font-semibold text-gray-600 uppercase tracking-wide">Trạng thái đơn hàng</h2>
            <div className="relative">
              {/* Line */}
              <div className="absolute left-5 right-5 top-5 h-0.5 bg-gray-100" />
              <div
                className="absolute left-5 top-5 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{
                  width: stepIndex >= 0
                    ? `${(stepIndex / (STEPS.length - 1)) * (100 - (10 / STEPS.length))}%`
                    : "0%",
                }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {STEPS.map((step, i) => {
                  const StepIcon = step.icon;
                  const done = stepIndex >= i;
                  const active = stepIndex === i;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2">
                      <div
                        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                          done
                            ? "border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-200"
                            : "border-gray-200 bg-white"
                        } ${active ? "ring-4 ring-emerald-100" : ""}`}
                      >
                        <StepIcon size={16} className={done ? "text-white" : "text-gray-300"} />
                      </div>
                      <span className={`text-center text-xs font-medium ${done ? "text-emerald-600" : "text-gray-400"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CANCELLED BADGE */}
        {isCancelled && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
            <XCircle size={20} className="flex-shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-700">Đơn hàng đã bị hủy</p>
              <p className="text-sm text-red-500">Đơn hàng này đã không thể tiếp tục xử lý</p>
            </div>
          </div>
        )}

        {/* CUSTOMER INFO */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-800">
            <User size={18} className="text-red-500" />
            Thông tin nhận hàng
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <User size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Họ và tên</p>
                <p className="font-semibold text-gray-800">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <Phone size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Số điện thoại</p>
                <p className="font-semibold text-gray-800">{order.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                <MapPin size={14} className="text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Địa chỉ giao hàng</p>
                <p className="font-medium text-gray-800">{order.address}</p>
              </div>
            </div>
            {order.note && (
              <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3">
                <FileText size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <p className="text-sm text-amber-700">{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* ITEMS */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-50 px-6 py-4">
            <h2 className="flex items-center gap-2 font-semibold text-gray-800">
              <Package size={18} className="text-red-500" />
              Sản phẩm ({order.items.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-50 px-6">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 p-1.5 ring-1 ring-gray-100">
                    <img
                      src={item.image}
                      className="h-full w-full object-contain"
                      alt={item.productName}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.productName}</p>
                    <div className="mt-1 flex gap-1.5">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{item.storage}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{item.color}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-red-500">{item.price.toLocaleString()}đ</p>
                  <p className="text-sm text-gray-400">x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Tổng tiền</span>
              <span className="text-xl font-extrabold text-red-500">{order.totalPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* CANCEL BUTTON */}
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            disabled={!canCancel || loading}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-sm transition-all ${
              canCancel
                ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-200 hover:scale-105 hover:shadow-md"
                : "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
            }`}
          >
            <XCircle size={18} />
            {loading ? "Đang xử lý..." : "Hủy đơn hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}