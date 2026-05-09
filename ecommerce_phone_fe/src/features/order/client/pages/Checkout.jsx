import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";
import { useAuthStore } from "../../../../store/authStore";
import { getImageUrl } from "../../../../utils/image";

import {
  User,
  Phone,
  MapPin,
  FileText,
  Wallet,
  CreditCard,
  Truck,
  Package,
} from "lucide-react";

export default function Checkout() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  // ================= LOAD CART =================
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isBuyNow = params.get("type") === "buyNow";

    if (isBuyNow) {
      const item = JSON.parse(localStorage.getItem("buyNow"));
      setCart({ items: item ? [item] : [] });
    } else {
      const cartData = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      setCart(cartData);
    }
  }, []);

  // ================= AUTO-FILL USER =================
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      customerName: prev.customerName || user.name || user.fullName || "",
      phone: prev.phone || user.phone || "",
      address: prev.address || user.address || "",
    }));
  }, [user]);

  // ================= CALCULATE TOTAL =================
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const validate = () => {
    if (!form.customerName.trim()) return "Vui lòng nhập họ tên";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!form.address.trim()) return "Vui lòng nhập địa chỉ";
    if (cart.items.length === 0) return "Không có sản phẩm để thanh toán";
    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    const params = new URLSearchParams(window.location.search);
    const isBuyNow = params.get("type") === "buyNow";

    try {
      setLoading(true);

      const res = await axiosClient.post("/api/orders", {
        ...form,
        totalPrice: total,
        items: cart.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      const { orderId } = res.data;

      if (isBuyNow) {
        localStorage.removeItem("buyNow");
      } else {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }

      navigate(`/success/${orderId}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  // EMPTY CART
  if (cart.items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-semibold mb-3">Không có sản phẩm để thanh toán</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
        >
          Quay lại mua hàng
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* FORM */}
      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package size={20} /> Thông tin nhận hàng
        </h1>

        {/* INPUTS */}
        <div className="space-y-4">
          <div>
            <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
              <User size={18} /> Họ và tên
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
              <Phone size={18} /> Số điện thoại
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="0123 456 789"
            />
          </div>

          <div>
            <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
              <MapPin size={18} /> Địa chỉ
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Số nhà, đường, phường/xã..."
            />
          </div>

          <div>
            <label className="font-medium flex items-center gap-2 mb-1 text-gray-700">
              <FileText size={18} /> Ghi chú
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Ghi chú thêm (không bắt buộc)"
            />
          </div>
        </div>

        {/* PAYMENT */}
        <h2 className="font-semibold mt-6 mb-2 flex items-center gap-2">
          <Wallet size={20} /> Phương thức thanh toán
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {/* COD */}
          <label
            className={`border p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
              form.paymentMethod === "cod" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              checked={form.paymentMethod === "cod"}
              onChange={() => setForm({ ...form, paymentMethod: "cod" })}
            />
            <Truck size={18} />
            <span>Thanh toán khi nhận hàng (COD)</span>
          </label>

          {/* BANK */}
          <label
            className={`border p-3 rounded-lg cursor-pointer flex items-center gap-3 transition ${
              form.paymentMethod === "bank" ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              checked={form.paymentMethod === "bank"}
              onChange={() => setForm({ ...form, paymentMethod: "bank" })}
            />
            <CreditCard size={18} />
            <span>Chuyển khoản ngân hàng</span>
          </label>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-4">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Package size={20} /> Đơn hàng
        </h2>

        {cart.items.map((item, i) => (
          <div key={i} className="flex gap-4 mb-4">
            <img src={getImageUrl(item.image)} className="w-16 h-16 object-contain" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-gray-500">x{item.quantity}</p>
            </div>
            <div className="text-sm font-semibold">
              {(item.price * item.quantity).toLocaleString()} đ
            </div>
          </div>
        ))}

        <div className="border-t pt-3 text-sm">
          <div className="flex justify-between mb-1">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </div>

          <div className="flex justify-between mb-1">
            <span>Phí ship</span>
            <span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()} đ`}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Tổng</span>
            <span className="text-red-500">{total.toLocaleString()} đ</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}