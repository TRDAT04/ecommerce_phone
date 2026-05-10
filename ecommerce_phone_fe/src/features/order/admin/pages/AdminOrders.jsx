import { useNavigate } from "react-router-dom";
import { useAdminOrders } from "../hooks/useAdminOrders";

const STATUS_MAP = {
  PENDING: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
  CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  SHIPPING: { text: "Đang giao", color: "bg-purple-100 text-purple-700" },
  DONE: { text: "Hoàn thành", color: "bg-green-100 text-green-700" },
  CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
};

export default function AdminOrders() {
  const { orders, status, setStatus, setPhone, fetchOrders } = useAdminOrders();
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📦 Quản lý đơn hàng</h1>
        <div className="text-sm text-gray-500">
          Tổng đơn: <b>{orders.length}</b>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4 shadow">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 focus:outline-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="SHIPPING">Đang giao</option>
          <option value="DONE">Hoàn thành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <input
          placeholder="🔍 Nhập số điện thoại"
          onChange={(e) => setPhone(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border px-3 py-2"
        />

        <button
          onClick={fetchOrders}
          className="rounded-lg bg-black px-5 py-2 text-white hover:opacity-80"
        >
          Lọc
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="hidden grid-cols-5 px-4 text-sm font-semibold text-gray-500 md:grid">
        <span>Mã đơn</span>
        <span>Khách hàng</span>
        <span>SĐT</span>
        <span>Tổng tiền</span>
        <span className="text-right">Trạng thái</span>
      </div>

      {/* LIST */}
      <div className="divide-y rounded-2xl border bg-white shadow">
        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            Không có đơn hàng nào
          </div>
        )}

        {orders.map((o) => {
          const s = STATUS_MAP[o.status] || {
            text: o.status,
            color: "bg-gray-100 text-gray-600",
          };

          return (
            <div
              key={o.id}
              onClick={() => navigate(`/admin/orders/${o.id}`)}
              className="grid cursor-pointer items-center gap-4 p-4 transition hover:bg-gray-50 md:grid-cols-5"
            >
              <div className="font-semibold text-gray-800">#{o.id}</div>

              <div>
                <p className="font-medium">{o.customerName}</p>
                <p className="text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-gray-700">{o.phone}</div>

              <div className="font-bold text-red-500">
                {(o.totalPrice || 0).toLocaleString()} đ
              </div>

              <div className="text-right">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>
                  {s.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}