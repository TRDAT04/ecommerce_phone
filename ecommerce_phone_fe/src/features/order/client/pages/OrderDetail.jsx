import { useParams } from "react-router-dom";
import {
  User,
  MapPin,
  Package,
  ClipboardList,
  CheckCircle,
  Truck,
  Phone,
  FileText,
  XCircle,
} from "lucide-react";
import { useOrderDetail } from "../hooks/useOrderDetail";

const STATUS_MAP = {
  PENDING: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  SHIPPING: { text: "Đang giao", color: "bg-purple-100 text-purple-700" },
  DONE: { text: "Hoàn thành", color: "bg-green-100 text-green-700" },
  CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
};

const STEPS = ["PENDING", "CONFIRMED", "SHIPPING", "DONE"];

export default function OrderDetail() {
  const { id } = useParams();
  const { order, loading, handleCancel, canCancel } = useOrderDetail(id);

  if (loading && !order) return <div className="p-10">Đang tải...</div>;
  if (!order) return <div className="p-10">Không có dữ liệu</div>;

  const status = STATUS_MAP[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      {/* HEADER */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold">
              <ClipboardList size={20} /> Đơn hàng #{order.id}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <FileText size={14} />
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>
          <span className={`rounded-full px-4 py-1 text-sm font-semibold shadow-sm ${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1"><ClipboardList size={16} /> Đặt hàng</span>
          <span className="flex items-center gap-1"><Package size={16} /> Xác nhận</span>
          <span className="flex items-center gap-1"><Truck size={16} /> Giao hàng</span>
          <span className="flex items-center gap-1"><CheckCircle size={16} /> Hoàn thành</span>
        </div>

        <div className="mt-3 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition ${
                STEPS.indexOf(order.status) >= i ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <User size={20} /> Thông tin nhận hàng
        </h2>
        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <User size={16} /> <b>{order.customerName}</b>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16} /> <b>{order.phone}</b>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} /> {order.address}
          </p>
        </div>
        {order.note && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <FileText size={16} /> {order.note}
          </div>
        )}
      </div>

      {/* ITEMS */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Package size={20} /> Sản phẩm
        </h2>

        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                className="h-20 w-20 rounded-xl border object-contain p-1 shadow-sm"
              />
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  {item.storage} • {item.color}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-red-500">
                {item.price.toLocaleString()} đ
              </p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="mt-6 border-t pt-4 text-right">
          <p className="text-lg font-bold text-red-600">
            Tổng tiền: {order.totalPrice.toLocaleString()} đ
          </p>
        </div>
      </div>

      {/* CANCEL BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={handleCancel}
          disabled={!canCancel || loading}
          className={`flex items-center gap-2 rounded px-5 py-2 text-white shadow-sm transition ${
            canCancel ? "bg-red-500 hover:bg-red-600" : "cursor-not-allowed bg-gray-300"
          }`}
        >
          <XCircle size={18} />
          {loading ? "Đang xử lý..." : "Hủy đơn"}
        </button>
      </div>
    </div>
  );
}