import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";

// ⭐ Lucide Icons
import { User, Smartphone, MapPin, Package, ClipboardList, CheckCircle, Truck, Phone, FileText, XCircle } from "lucide-react";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/api/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      alert("Không tải được đơn hàng");
    } finally {
      setLoading(false);
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

  const cancelOrder = async () => {
    if (!canCancel) return;

    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng?")) return;

    try {
      setLoading(true);
      await axiosClient.put(`/api/orders/${id}/cancel`);
      await fetchOrder();
    } catch (err) {
      alert("Hủy đơn thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) return <div className="p-10">Đang tải...</div>;
  if (!order) return <div className="p-10">Không có dữ liệu</div>;

  const status = statusMap[order.status] || {
    text: order.status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <ClipboardList size={20} /> Đơn hàng #{order.id}
            </h1>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <FileText size={14} />
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold shadow-sm ${status.color}`}
          >
            {status.text}
          </span>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1"><ClipboardList size={16}/> Đặt hàng</span>
          <span className="flex items-center gap-1"><Package size={16}/> Xác nhận</span>
          <span className="flex items-center gap-1"><Truck size={16}/> Giao hàng</span>
          <span className="flex items-center gap-1"><CheckCircle size={16}/> Hoàn thành</span>
        </div>

        <div className="flex mt-3 gap-2">
          {["PENDING","CONFIRMED","SHIPPING","DONE"].map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition ${
                ["PENDING","CONFIRMED","SHIPPING","DONE"].indexOf(order.status) >= i
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="font-semibold mb-3 text-lg flex items-center gap-2">
          <User size={20} /> Thông tin nhận hàng
        </h2>

        <div className="space-y-1 text-sm">
          <p className="flex items-center gap-2">
            <User size={16}/> <b>{order.customerName}</b>
          </p>
          <p className="flex items-center gap-2">
            <Phone size={16}/> <b>{order.phone}</b>
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16}/> {order.address}
          </p>
        </div>

        {order.note && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm flex items-center gap-2 text-gray-600">
            <FileText size={16}/> {order.note}
          </div>
        )}
      </div>

      {/* ITEMS */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="font-semibold mb-4 text-lg flex items-center gap-2">
          <Package size={20}/> Sản phẩm
        </h2>

        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b py-4 gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:8080${item.image}`}
                className="w-20 h-20 object-contain border rounded-xl p-1 shadow-sm"
              />

              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-500">
                  {item.storage} • {item.color}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-red-500 text-lg">
                {item.price.toLocaleString()} đ
              </p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
          </div>
        ))}

        <div className="text-right mt-6 border-t pt-4">
          <p className="text-lg font-bold text-red-600">
            Tổng tiền: {order.totalPrice.toLocaleString()} đ
          </p>
        </div>
      </div>

      {/* CANCEL BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={cancelOrder}
          disabled={!canCancel || loading}
          className={`px-5 py-2 rounded text-white flex items-center gap-2 transition shadow-sm
            ${
              canCancel
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          <XCircle size={18}/>
          {loading ? "Đang xử lý..." : "Hủy đơn"}
        </button>
      </div>

    </div>
  );
}