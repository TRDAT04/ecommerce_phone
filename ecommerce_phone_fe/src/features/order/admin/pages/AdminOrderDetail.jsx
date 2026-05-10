import { useParams } from "react-router-dom";
import { useAdminOrderDetail } from "../hooks/useAdminOrderDetail";

const STATUS_MAP = {
  PENDING: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  SHIPPING: { text: "Đang giao", color: "bg-purple-100 text-purple-700" },
  DONE: { text: "Hoàn thành", color: "bg-green-100 text-green-700" },
  CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
};

const STEPS = ["PENDING", "CONFIRMED", "SHIPPING", "DONE"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { order, loading, handleUpdateStatus, canCancel } = useAdminOrderDetail(id);

  if (!order) return <div className="p-10">Đang tải...</div>;

  const status = STATUS_MAP[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-600",
  };
  console.log("STATUS FROM BACKEND:", order.status);
  const stepIndex = STEPS.indexOf(order.status);
console.log("STEPS index:", stepIndex, "| status:", order.status);
  return (
    <div className="mx-auto max-w-5xl space-y-5 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow">
        <div>
          <h1 className="text-xl font-bold">Đơn hàng #{order.id}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1 text-sm font-semibold ${status.color}`}>
          {status.text}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="rounded-2xl border bg-white p-6 shadow">
        <div className="flex justify-between text-sm text-gray-500">
          <span>📝 Đặt hàng</span>
          <span>📦 Xác nhận</span>
          <span>🚚 Giao</span>
          <span>✅ Hoàn thành</span>
        </div>
        <div className="mt-3 flex gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full ${
                STEPS.indexOf(order.status) >= i ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ACTION */}
      <div className="flex flex-wrap gap-3 rounded-2xl border bg-white p-6 shadow">
        {order.status === "PENDING" && (
          <button
            disabled={loading}
            onClick={() => handleUpdateStatus("CONFIRMED")}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Xác nhận
          </button>
        )}

        {order.status === "CONFIRMED" && (
          <button
            disabled={loading}
            onClick={() => handleUpdateStatus("SHIPPING")}
            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:opacity-50"
          >
            Giao hàng
          </button>
        )}

        {order.status === "SHIPPING" && (
          <button
            disabled={loading}
            onClick={() => handleUpdateStatus("DONE")}
            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          >
            Hoàn thành
          </button>
        )}

        <button
          disabled={!canCancel || loading}
          onClick={() => canCancel && handleUpdateStatus("CANCELLED")}
          className={`rounded px-4 py-2 text-white ${
            canCancel
              ? "bg-red-500 hover:bg-red-600"
              : "cursor-not-allowed bg-gray-300"
          } disabled:opacity-50`}
        >
          Hủy đơn
        </button>
      </div>

      {/* CUSTOMER */}
      <div className="rounded-2xl border bg-white p-6 shadow">
        <h2 className="mb-3 text-lg font-semibold">Thông tin khách</h2>
        <p><b>👤</b> {order.customerName}</p>
        <p><b>📞</b> {order.phone}</p>
        <p><b>📍</b> {order.address}</p>
      </div>

      {/* ITEMS */}
      <div className="rounded-2xl border bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Sản phẩm</h2>

        {order.items?.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                className="h-16 w-16 rounded border object-contain"
              />
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  {item.storage} - {item.color}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-red-500">
                {(item.price || 0).toLocaleString()} đ
              </p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="mt-4 text-right text-lg font-bold text-red-600">
          Tổng: {(order.totalPrice || 0).toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}