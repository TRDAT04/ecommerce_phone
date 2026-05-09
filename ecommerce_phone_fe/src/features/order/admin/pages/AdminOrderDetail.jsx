import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axiosClient.get(`/api/admin/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Lỗi load order:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const statusMap = {
    PENDING: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { text: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    SHIPPING: { text: "Đang giao", color: "bg-purple-100 text-purple-700" },
    DONE: { text: "Hoàn thành", color: "bg-green-100 text-green-700" },
    CANCELLED: { text: "Đã hủy", color: "bg-red-100 text-red-700" },
  };

  const canCancel = order?.status === "PENDING";

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);

      await axiosClient.put(`/api/admin/orders/${id}/status`, {
        status: newStatus,
      });

      fetchOrder();
    } catch (err) {
      console.error("Update failed", err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div className="p-10">Đang tải...</div>;

  const status = statusMap[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-600",
  };

  const steps = ["PENDING", "CONFIRMED", "SHIPPING", "DONE"];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow border flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Đơn hàng #{order.id}</h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${status.color}`}
        >
          {status.text}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <div className="flex justify-between text-sm text-gray-500">
          <span>📝 Đặt hàng</span>
          <span>📦 Xác nhận</span>
          <span>🚚 Giao</span>
          <span>✅ Hoàn thành</span>
        </div>

        <div className="flex mt-3 gap-2">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                steps.indexOf(order.status) >= i
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ACTION */}
      <div className="bg-white p-6 rounded-2xl shadow border flex gap-3 flex-wrap">
        {order.status === "PENDING" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("CONFIRMED")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Xác nhận
          </button>
        )}

        {order.status === "CONFIRMED" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("SHIPPING")}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Giao hàng
          </button>
        )}

        {order.status === "SHIPPING" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("DONE")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Hoàn thành
          </button>
        )}

        <button
          disabled={!canCancel || loading}
          onClick={() => {
            if (!canCancel) return;
            updateStatus("CANCELLED");
          }}
          className={`px-4 py-2 rounded text-white ${
            canCancel
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Hủy đơn
        </button>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="font-semibold mb-3 text-lg">Thông tin khách</h2>
        <p>
          <b>👤</b> {order.customerName}
        </p>
        <p>
          <b>📞</b> {order.phone}
        </p>
        <p>
          <b>📍</b> {order.address}
        </p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="font-semibold mb-4 text-lg">Sản phẩm</h2>

        {order.items?.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b py-4"
          >
            <div className="flex gap-4 items-center">
              <img
                src={`http://localhost:8080${item.image}`}
                className="w-16 h-16 object-contain border rounded"
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

        <div className="text-right mt-4 text-lg font-bold text-red-600">
          Tổng: {(order.totalPrice || 0).toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}
