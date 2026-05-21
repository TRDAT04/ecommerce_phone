import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Receipt, ArrowRight } from "lucide-react";

export default function Success() {
  const { id: orderCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Animated Success Icon */}
        <div className="relative mb-6 inline-flex">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-600 shadow-2xl shadow-emerald-200">
            <CheckCircle size={52} className="text-white" strokeWidth={1.5} />
          </div>
          {/* Pulse rings */}
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900">
          Đặt hàng thành công! 🎉
        </h1>
        <p className="mb-6 text-gray-500">
          Cảm ơn bạn đã tin tưởng mua hàng tại{" "}
          <span className="font-semibold text-red-500">NextMobile</span>
        </p>

        {/* Order ID card */}
        <div className="mx-auto mb-6 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Mã đơn hàng</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-center gap-2">
              <Receipt size={20} className="text-gray-400" />
              <span className="text-2xl font-extrabold tracking-wider text-red-500">#{orderCode}</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Lưu mã đơn để tra cứu hoặc liên hệ hỗ trợ
            </p>
          </div>
        </div>

        {/* Info hint */}
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-100">
          📌 Vui lòng lưu mã đơn và số điện thoại để tra cứu đơn hàng
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate("/track-order")}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white py-3.5 font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <Receipt size={18} />
            Tra cứu đơn
          </button>
          <button
            onClick={() => navigate("/")}
            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-red-300"
          >
            <ShoppingBag size={18} />
            Tiếp tục mua sắm
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}