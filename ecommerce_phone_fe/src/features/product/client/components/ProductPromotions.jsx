import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ProductPromotions() {
  const [showAll, setShowAll] = useState(false);

  const promotions = [
    "Thu cũ đổi mới hỗ trợ lên đến 4 triệu đồng",
    "Ưu đãi giảm tới 5% tối đa 100k khi mua AirPods kèm iPhone/iPad/MacBook",
    "Ưu đãi giảm tới 3% tối đa 200k khi mua Apple Watch kèm iPhone/iPad/MacBook",
    "Ưu đãi giảm 5% tối đa 300k khi mua AirPods + Apple Watch kèm iPhone/iPad/MacBook",
    "Tặng Voucher giảm ngay 10%, tối đa 200.000đ cho khách hàng mua sản phẩm vào ngày sinh nhật",
    "Ưu đãi mua dán màn hình kèm máy Điện thoại/Máy tính bảng/Laptop/Đồng hồ giảm 10%",
    "Bán báo giá tốt nhất cho khách hàng doanh nghiệp B2B khi mua số lượng lớn",
  ];

  // Mobile: chỉ hiện 3 item đầu
  const visiblePromotions = showAll
    ? promotions
    : promotions.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-xl border border-black/20 bg-white">
      {/* HEADER */}
      <div className="flex items-center gap-2 bg-red-100 px-4 py-3 font-semibold text-red-600">
        👑 <span>ƯU ĐÃI NEXTMOBILE</span>
      </div>

      {/* LIST */}
      <div className="space-y-3 p-4">
        {(window.innerWidth >= 768 ? promotions : visiblePromotions).map(
          (text, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* NUMBER */}
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {index + 1}
              </div>

              {/* CONTENT */}
              <p className="text-sm leading-relaxed text-gray-800">
                {text}{" "}
                <span className="cursor-pointer font-medium text-green-600 hover:underline">
                  (Khám phá ngay)
                </span>
              </p>
            </div>
          )
        )}

        {/* BUTTON MOBILE */}
        <button
  onClick={() => setShowAll(!showAll)}
  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.98] md:hidden"
>
  <span>
    {showAll ? "Thu gọn ưu đãi" : "Xem thêm ưu đãi"}
  </span>

  {showAll ? (
    <ChevronUp size={18} />
  ) : (
    <ChevronDown size={18} />
  )}
</button>
      </div>
    </div>
  );
}