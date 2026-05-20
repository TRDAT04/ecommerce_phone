import {
  User, Phone, MapPin, FileText, Wallet,
  CreditCard, Truck, Package, ShieldCheck, ChevronRight, Tag, Mail,
} from "lucide-react";
import { getImageUrl } from "../../../../utils/image";
import { useCheckout } from "../hooks/useCheckout";

export default function Checkout() {
  const {
    cart, form, setForm, loading, subtotal, shipping, total, handleSubmit, user,
  } = useCheckout();

  // ================= EMPTY =================
  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Package size={36} className="text-gray-400" />
        </div>
        <h1 className="mb-3 text-xl font-bold text-gray-800">Không có sản phẩm để thanh toán</h1>
        <button
          onClick={() => (window.location.href = "/")}
          className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:scale-105"
        >
          Quay lại mua hàng
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-6 pb-28 lg:py-8 lg:pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Thanh toán</h1>
            <p className="text-sm text-gray-500">{cart.items.length} sản phẩm trong đơn hàng</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ===== LEFT: FORM ===== */}
          <div className="space-y-4 lg:col-span-2">
            {/* Delivery Info */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                  <MapPin size={18} className="text-red-500" />
                  Thông tin nhận hàng
                </h2>
              </div>
              <div className="space-y-4 p-6">
                {/* Name */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User size={15} className="text-gray-400" />
                    Họ và tên
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone size={15} className="text-gray-400" />
                    Số điện thoại
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="0123 456 789"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin size={15} className="text-gray-400" />
                    Địa chỉ giao hàng
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="Số nhà, đường, phường, tỉnh/thành"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FileText size={15} className="text-gray-400" />
                    Ghi chú
                    <span className="text-xs font-normal text-gray-400">(tuỳ chọn)</span>
                  </label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                    placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Mail size={15} className="text-gray-400" />
                    Email nhận xác nhận đơn hàng
                    <span className="text-xs font-normal text-gray-400">(tuỳ chọn)</span>
                  </label>
                  {user ? (
                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3">
                      <Mail size={14} className="flex-shrink-0 text-gray-400" />
                      <span className="text-sm text-gray-600">{form.email}</span>
                      <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Tài khoản</span>
                    </div>
                  ) : (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-100"
                      placeholder="example@gmail.com (nhận email xác nhận đơn hàng)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              <div className="border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-gray-800">
                  <Wallet size={18} className="text-red-500" />
                  Phương thức thanh toán
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2">
                {/* COD */}
                <label
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    form.paymentMethod === "cod"
                      ? "border-red-500 bg-red-50/60 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={form.paymentMethod === "cod"}
                    onChange={() => setForm({ ...form, paymentMethod: "cod" })}
                  />
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    form.paymentMethod === "cod" ? "bg-red-500" : "bg-gray-100"
                  } transition-colors`}>
                    <Truck size={18} className={form.paymentMethod === "cod" ? "text-white" : "text-gray-500"} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${form.paymentMethod === "cod" ? "text-red-700" : "text-gray-800"}`}>
                      Thanh toán khi nhận hàng
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">COD – Trả tiền mặt</p>
                  </div>
                  {form.paymentMethod === "cod" && (
                    <div className="ml-auto h-5 w-5 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </label>

                {/* Bank */}
                <label
                  className={`group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                    form.paymentMethod === "bank"
                      ? "border-red-500 bg-red-50/60 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={form.paymentMethod === "bank"}
                    onChange={() => setForm({ ...form, paymentMethod: "bank" })}
                  />
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                    form.paymentMethod === "bank" ? "bg-red-500" : "bg-gray-100"
                  } transition-colors`}>
                    <CreditCard size={18} className={form.paymentMethod === "bank" ? "text-white" : "text-gray-500"} />
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${form.paymentMethod === "bank" ? "text-red-700" : "text-gray-800"}`}>
                      Chuyển khoản ngân hàng
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Internet Banking / QR</p>
                  </div>
                  {form.paymentMethod === "bank" && (
                    <div className="ml-auto h-5 w-5 flex-shrink-0 rounded-full bg-red-500 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck size={16} className="text-green-500" />
                Bảo mật SSL
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Tag size={16} className="text-blue-500" />
                Giá đã bao gồm VAT
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck size={16} className="text-purple-500" />
                Giao hàng toàn quốc
              </div>
            </div>
          </div>

          {/* ===== RIGHT: SUMMARY ===== */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-4">
                <h2 className="font-semibold text-white">Đơn hàng của bạn</h2>
                <p className="text-xs text-gray-400 mt-0.5">{cart.items.length} sản phẩm</p>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50 px-5 py-4 max-h-64 overflow-y-auto">
                {cart.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <div className="relative flex-shrink-0">
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-gray-50 p-1 ring-1 ring-gray-100">
                        <img
                          src={getImageUrl(item.image)}
                          className="h-full w-full object-contain"
                          alt={item.name}
                        />
                      </div>
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 text-[10px] font-bold text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.storage} · {item.color}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm font-semibold text-gray-800">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 px-5 py-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-medium text-gray-800">{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí giao hàng</span>
                    <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-800"}`}>
                      {shipping === 0 ? "Miễn phí" : `${shipping.toLocaleString()}đ`}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span className="font-semibold text-gray-800">Tổng thanh toán</span>
                  <span className="text-lg font-extrabold text-red-500">{total.toLocaleString()}đ</span>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="hidden lg:flex group mt-4 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-red-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    <>
                      Đặt hàng ngay
                      <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white p-4 pb-6 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500">Tổng thanh toán</p>
            <p className="text-lg font-bold text-red-500">{total.toLocaleString()}đ</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex min-w-[140px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-200 transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              "Đặt hàng ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}