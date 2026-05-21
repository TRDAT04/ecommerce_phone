import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package, User, MapPin, Phone, Truck,
  CheckCircle, ClipboardList, XCircle, ArrowLeft,
  Clock, PackageSearch, CheckCircle2, FileText, Trash2,
} from "lucide-react";
import { useAdminOrderDetail } from "../hooks/useAdminOrderDetail";

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

const ACTION_BUTTONS = [
  {
    fromStatus: "PENDING",
    toStatus: "CONFIRMED",
    label: "Xác nhận đơn hàng",
    icon: PackageSearch,
    style: "from-blue-500 to-indigo-600 shadow-blue-200",
  },
  {
    fromStatus: "CONFIRMED",
    toStatus: "SHIPPING",
    label: "Bắt đầu giao hàng",
    icon: Truck,
    style: "from-purple-500 to-violet-600 shadow-purple-200",
  },
  {
    fromStatus: "SHIPPING",
    toStatus: "DONE",
    label: "Hoàn thành đơn",
    icon: CheckCircle,
    style: "from-emerald-500 to-green-600 shadow-emerald-200",
  },
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { order, loading, handleUpdateStatus, handleDelete, canCancel } = useAdminOrderDetail(id);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!order)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  const status = STATUS_MAP[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-600",
    icon: Clock,
  };
  const StatusIcon = status.icon;
  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";
  const nextAction = ACTION_BUTTONS.find((a) => a.fromStatus === order.status);

  return (
    <div className="min-h-screen bg-gray-50/60 p-6">
      <div className="mx-auto max-w-5xl space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-gray-800"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách
        </button>

        {/* HEADER */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="mb-1 text-xs text-gray-400">
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

        <div className="grid gap-5 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-5 lg:col-span-2">
            {/* PROGRESS TRACKER */}
            {!isCancelled && (
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Tiến trình đơn hàng
                </h2>
                <div className="relative">
                  <div className="absolute left-5 right-5 top-5 h-0.5 bg-gray-100" />
                  <div
                    className="absolute left-5 top-5 h-0.5 bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-700"
                    style={{
                      width: stepIndex >= 0
                        ? `${(stepIndex / (STEPS.length - 1)) * (100 - 10 / STEPS.length)}%`
                        : "0%",
                    }}
                  />
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

            {/* Cancelled banner */}
            {isCancelled && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
                <XCircle size={20} className="flex-shrink-0 text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">Đơn hàng đã bị hủy</p>
                  <p className="text-sm text-red-400">Không thể thực hiện thêm hành động nào</p>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-3 text-sm font-semibold text-gray-600">Hành động</h2>

              {!isCancelled && (
                <div className="flex flex-wrap gap-3">
                  {nextAction && (() => {
                    const ActionIcon = nextAction.icon;
                    return (
                      <button
                        disabled={loading}
                        onClick={() => handleUpdateStatus(nextAction.toStatus)}
                        className={`flex items-center gap-2 rounded-xl bg-gradient-to-r ${nextAction.style} px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
                      >
                        {loading ? (
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <ActionIcon size={16} />
                        )}
                        {loading ? "Đang xử lý..." : nextAction.label}
                      </button>
                    );
                  })()}

                  <button
                    disabled={!canCancel || loading}
                    onClick={() => canCancel && handleUpdateStatus("CANCELLED")}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-white transition-all ${
                      canCancel
                        ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-md shadow-red-200 hover:scale-105 hover:shadow-lg active:scale-95"
                        : "cursor-not-allowed bg-gray-200 text-gray-400"
                    } disabled:opacity-50`}
                  >
                    <XCircle size={16} />
                    Hủy đơn hàng
                  </button>
                </div>
              )}

              {/* Divider */}
              {!isCancelled && <div className="my-3 border-t border-gray-100" />}

              {/* Delete section */}
              {!showDeleteConfirm ? (
                <button
                  disabled={loading}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 font-semibold text-red-600 transition-all hover:bg-red-100 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Xóa đơn hàng
                </button>
              ) : (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="mb-3 flex items-start gap-2">
                    <Trash2 size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-700">Xác nhận xóa đơn hàng #{order.orderCode}?</p>
                      <p className="mt-0.5 text-sm text-red-400">Hành động này không thể hoàn tác. Toàn bộ dữ liệu đơn hàng sẽ bị xóa vĩnh viễn.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={loading}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <Trash2 size={14} />
                      )}
                      {loading ? "Đang xóa..." : "Xác nhận xóa"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ITEMS */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-50 px-6 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                  <Package size={17} className="text-gray-500" />
                  Sản phẩm ({order.items?.length || 0})
                </h2>
              </div>

              <div className="divide-y divide-gray-50 px-6">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 p-1.5 ring-1 ring-gray-100">
                        <img
                          src={item.image}
                          className="h-full w-full object-contain"
                          alt={item.productName}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.productName}</p>
                        <div className="mt-1 flex gap-1">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{item.storage}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{item.color}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-bold text-red-500">{(item.price || 0).toLocaleString()}đ</p>
                      <p className="text-sm text-gray-400">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Tổng tiền</span>
                  <span className="text-xl font-extrabold text-red-500">
                    {(order.totalPrice || 0).toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - CUSTOMER INFO */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                  <User size={16} className="text-gray-500" />
                  Thông tin khách hàng
                </h2>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <User size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Họ và tên</p>
                    <p className="font-semibold text-gray-800">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <Phone size={14} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Số điện thoại</p>
                    <p className="font-semibold text-gray-800">{order.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <MapPin size={14} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Địa chỉ giao hàng</p>
                    <p className="font-medium text-gray-800">{order.address}</p>
                  </div>
                </div>
                {order.note && (
                  <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-3 py-2.5">
                    <FileText size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs text-amber-600">Ghi chú</p>
                      <p className="text-sm text-amber-700">{order.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}