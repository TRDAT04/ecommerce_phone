import { User, Phone, MapPin, FileText, Wallet, CreditCard, Truck, Package } from "lucide-react";
import { getImageUrl } from "../../../../utils/image";
import { useCheckout } from "../hooks/useCheckout";

export default function Checkout() {
  const {
    cart,
    form,
    setForm,
    loading,
    subtotal,
    shipping,
    total,
    handleSubmit,
  } = useCheckout();

  // ================= EMPTY =================
  if (cart.items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-3 text-xl font-semibold">
          Không có sản phẩm để thanh toán
        </h1>
        <button
          onClick={() => (window.location.href = "/")}
          className="rounded-lg bg-red-500 px-6 py-3 text-white hover:bg-red-600"
        >
          Quay lại mua hàng
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-3">
      {/* FORM */}
      <div className="rounded-xl bg-white p-6 shadow md:col-span-2">
        <h1 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <Package size={20} /> Thông tin nhận hàng
        </h1>

        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
              <User size={18} /> Họ và tên
            </label>
            <input
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-green-500"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
              <Phone size={18} /> Số điện thoại
            </label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-green-500"
              placeholder="0123 456 789"
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
              <MapPin size={18} /> Địa chỉ
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-green-500"
              placeholder="Số nhà, đường, phường/xã..."
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 font-medium text-gray-700">
              <FileText size={18} /> Ghi chú
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-green-500"
              placeholder="Ghi chú thêm (không bắt buộc)"
            />
          </div>
        </div>

        {/* PAYMENT */}
        <h2 className="mt-6 mb-2 flex items-center gap-2 font-semibold">
          <Wallet size={20} /> Phương thức thanh toán
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
              form.paymentMethod === "cod"
                ? "border-green-500 bg-green-50"
                : "hover:bg-gray-50"
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

          <label
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
              form.paymentMethod === "bank"
                ? "border-green-500 bg-green-50"
                : "hover:bg-gray-50"
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
      <div className="sticky top-4 h-fit rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Package size={20} /> Đơn hàng
        </h2>

        {cart.items.map((item, i) => (
          <div key={i} className="mb-4 flex gap-4">
            <img
              src={getImageUrl(item.image)}
              className="h-16 w-16 object-contain"
            />
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
          <div className="mb-1 flex justify-between">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} đ</span>
          </div>
          <div className="mb-1 flex justify-between">
            <span>Phí ship</span>
            <span>{shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()} đ`}</span>
          </div>
          <div className="mt-2 flex justify-between text-lg font-bold">
            <span>Tổng</span>
            <span className="text-red-500">{total.toLocaleString()} đ</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-red-500 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}