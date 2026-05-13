import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { useCart } from "../hooks/useCart";

export default function Cart() {
  const { cart, total, increase, decrease, removeItem } = useCart();
  const navigate = useNavigate();

  // ================= EMPTY =================
  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <div className="relative mb-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-red-100 shadow-lg">
            <ShoppingCart className="text-red-400" size={40} />
          </div>
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow">
            0
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Giỏ hàng trống</h1>
        <p className="mb-6 text-gray-500">Thêm sản phẩm vào giỏ để bắt đầu mua sắm nhé!</p>
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-8 py-3 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-300"
        >
          <ShoppingBag size={18} />
          Khám phá sản phẩm
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50/50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT - CART ITEMS */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md">
              <ShoppingCart size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Giỏ hàng</h1>
              <p className="text-sm text-gray-500">{itemCount} sản phẩm</p>
            </div>
          </div>

          {/* Items Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {cart.items.map((item, i) => (
              <div
                key={i}
                className="group relative flex items-center gap-4 border-b border-gray-50 px-5 py-4 transition-all last:border-0 hover:bg-gray-50/80"
              >
                {/* Image */}
                <div className="relative flex-shrink-0">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-50 p-1 ring-1 ring-gray-100">
                    <img
                      src={item.image}
                      className="h-full w-full object-contain transition-transform group-hover:scale-105"
                      alt={item.name}
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">{item.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {item.storage}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {item.color}
                    </span>
                  </div>
                  <p className="mt-2 text-base font-bold text-red-500">
                    {item.price.toLocaleString()}đ
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-shrink-0 items-center gap-1 rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => decrease(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-red-50 hover:text-red-500 active:scale-95"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="min-w-[28px] text-center text-sm font-bold text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increase(i)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-green-50 hover:text-green-600 active:scale-95"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="hidden flex-shrink-0 text-right sm:block">
                  <p className="text-sm text-gray-400">Thành tiền</p>
                  <p className="font-bold text-gray-800">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(i)}
                  className="flex-shrink-0 rounded-lg p-2 text-gray-300 transition hover:bg-red-50 hover:text-red-500 active:scale-95"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 flex items-center gap-2 text-sm text-gray-500 transition hover:text-red-500"
          >
            <ArrowRight size={14} className="rotate-180" />
            Tiếp tục mua sắm
          </button>
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* Summary Header */}
            <div className="bg-gradient-to-r bg-green-700 px-5 py-4">
              <h2 className="font-semibold text-white">Tóm tắt đơn hàng</h2>
            </div>

            <div className="p-5">
              {/* Promo tag */}
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-green-200 bg-green-50 px-3 py-2.5">
                <Tag size={15} className="text-green-600" />
                <span className="text-sm text-green-700 font-medium">Miễn phí vận chuyển</span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính ({itemCount} sản phẩm)</span>
                  <span className="font-medium text-gray-800">{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="font-medium text-green-600">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giảm giá</span>
                  <span className="font-medium text-gray-400">0đ</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-semibold text-gray-700">Tổng tiền</span>
                <span className="text-xl font-extrabold text-red-500">
                  {total.toLocaleString()}đ
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-red-300 active:scale-[0.98]"
              >
                Thanh toán ngay
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}