export default function ProductPromotions() {
    const promotions = [
      "Thu cũ đổi mới hỗ trợ lên đến 4 triệu đồng",
      "Ưu đãi giảm tới 5% tối đa 100k khi mua AirPods kèm iPhone/iPad/MacBook",
      "Ưu đãi giảm tới 3% tối đa 200k khi mua Apple Watch kèm iPhone/iPad/MacBook",
      "Ưu đãi giảm 5% tối đa 300k khi mua AirPods + Apple Watch kèm iPhone/iPad/MacBook",
      "Tặng Voucher giảm ngay 10%, tối đa 200.000đ cho khách hàng mua sản phẩm vào ngày sinh nhật",
      "Ưu đãi mua dán màn hình kèm máy Điện thoại/Máy tính bảng/Laptop/Đồng hồ giảm 10%",
      "Bán báo giá tốt nhất cho khách hàng doanh nghiệp B2B khi mua số lượng lớn",
    ];
  
    return (
      <div className="border border-black/20 rounded-xl overflow-hidden bg-white">
        {/* HEADER */}
        <div className="bg-red-100 text-red-600 px-4 py-3 font-semibold flex items-center gap-2">
          👑 <span>ƯU ĐÃI NEXTMOBILE</span>
        </div>
  
        {/* LIST */}
        <div className="p-4 space-y-3">
          {promotions.map((text, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* NUMBER */}
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold flex-shrink-0">
                {index + 1}
              </div>
  
              {/* CONTENT */}
              <p className="text-sm text-gray-800 leading-relaxed">
                {text}{" "}
                <span className="text-green-600 font-medium cursor-pointer hover:underline">
                  (Khám phá ngay)
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }