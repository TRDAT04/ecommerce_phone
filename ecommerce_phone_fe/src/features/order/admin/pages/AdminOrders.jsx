import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      let url = "/api/admin/orders?";

      if (status) url += `status=${status}&`;
      if (phone) url += `phone=${phone}`;

      const res = await axiosClient.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi load orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusMap = {
    PENDING: {
      text: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700",
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700",
    },
    SHIPPING: {
      text: "Đang giao",
      color: "bg-purple-100 text-purple-700",
    },
    DONE: {
      text: "Hoàn thành",
      color: "bg-green-100 text-green-700",
    },
    CANCELLED: {
      text: "Đã hủy",
      color: "bg-red-100 text-red-700",
    },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📦 Quản lý đơn hàng</h1>

        <div className="text-sm text-gray-500">
          Tổng đơn: <b>{orders.length}</b>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-2xl shadow border flex flex-wrap gap-3 items-center">
        <select
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:outline-none"
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
          className="border px-3 py-2 rounded-lg flex-1 min-w-[200px]"
        />

        <button
          onClick={fetchOrders}
          className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-80"
        >
          Lọc
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="hidden md:grid grid-cols-5 text-sm font-semibold text-gray-500 px-4">
        <span>Mã đơn</span>
        <span>Khách hàng</span>
        <span>SĐT</span>
        <span>Tổng tiền</span>
        <span className="text-right">Trạng thái</span>
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow border divide-y">
        {orders.map((o) => {
          const s = statusMap[o.status] || {
            text: o.status,
            color: "bg-gray-100 text-gray-600",
          };

          return (
            <div
              key={o.id}
              onClick={() => navigate(`/admin/orders/${o.id}`)}
              className="grid md:grid-cols-5 gap-4 p-4 items-center hover:bg-gray-50 cursor-pointer transition"
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
                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold ${s.color}`}
                >
                  {s.text}
                </span>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            Không có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
}
