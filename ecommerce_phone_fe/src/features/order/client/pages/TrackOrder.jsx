import { useNavigate } from "react-router-dom";
import { Search, Phone, Hash, ArrowRight, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { useTrackOrder } from "../hooks/useTrackOrder";

export default function TrackOrder() {
  const { phone, setPhone, orderId, setOrderId, error, setError, loading, handleSearch } =
    useTrackOrder();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 px-4 py-12">
      <div className="mx-auto max-w-lg">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-5 inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-xl shadow-blue-200/60">
            <Search size={30} className="text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Tra cứu đơn hàng</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Nhập <span className="font-semibold text-gray-700">số điện thoại</span> và{" "}
            <span className="font-semibold text-gray-700">mã đơn hàng</span> để tra cứu
          </p>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-blue-100/40 ring-1 ring-gray-100">

          {/* Input: Số điện thoại */}
          <div className="px-6 pt-6 pb-4">
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Phone size={12} />
              Số điện thoại
            </label>
            <div
              className={`flex items-center gap-3 rounded-2xl border-2 bg-gray-50/60 px-4 py-3 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-50 ${
                error && !phone.trim() ? "border-red-300 bg-red-50/40" : "border-gray-100"
              }`}
            >
              <Phone size={17} className="flex-shrink-0 text-blue-400" />
              <input
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="Nhập số điện thoại đặt hàng..."
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                inputMode="tel"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-6 py-1">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs font-semibold text-gray-300">VÀ</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Input: Mã đơn hàng */}
          <div className="px-6 pt-4 pb-6">
            <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              <Hash size={12} />
              Mã đơn hàng
            </label>
            <div
              className={`flex items-center gap-3 rounded-2xl border-2 bg-gray-50/60 px-4 py-3 transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-blue-50 ${
                error && !orderId.trim() ? "border-red-300 bg-red-50/40" : "border-gray-100"
              }`}
            >
              <Hash size={17} className="flex-shrink-0 text-blue-400" />
              <input
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder="Nhập mã đơn hàng (VD: 123)..."
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <XCircle size={15} className="flex-shrink-0 text-red-400" />
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Button */}
          <div className="px-6 pb-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang tra cứu...
                </>
              ) : (
                <>
                  Tra cứu đơn hàng
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={13} className="text-green-400" />
          Cần nhập đúng cả hai thông tin để bảo vệ đơn hàng của bạn
        </div>

      </div>
    </div>
  );
}