import { Truck, Lock, Box, Receipt } from "lucide-react";

export default function ProductCommit({ brand }) {
  return (
    <div className="rounded-lg border border-black/20 bg-white p-4">
      <p className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-red-600">
        <span>CAM KẾT SẢN PHẨM</span>
      </p>

      <ul className="space-y-3 text-sm leading-relaxed text-gray-700">
        {/* FREE SHIPPING */}
        <li className="flex items-start gap-3">
          <Truck size={18} className="mt-0.5 text-blue-600" />
          <span>
            Miễn phí vận chuyển toàn quốc - Giao hàng hỏa tốc 2H nội thành{" "}
            <span className="cursor-pointer text-blue-500 hover:text-blue-600 hover:underline">
              (Xem chi tiết)
            </span>
          </span>
        </li>

        {/* WARRANTY */}
        <li className="flex items-start gap-3">
          <Lock size={18} className="mt-0.5 text-green-600" />
          <span>
            Bảo hành chính hãng {brand} 12 tháng{" "}
            <span className="cursor-pointer text-blue-500 hover:text-blue-600 hover:underline">
              (Xem trung tâm bảo hành)
            </span>
          </span>
        </li>

        {/* SEALED PRODUCT */}
        <li className="flex items-start gap-3">
          <Box size={18} className="mt-0.5 text-orange-600" />
          <span>
            Cam kết máy mới nguyên Seal, chưa Active – Lỗi đổi liền trong 12
            tháng, đổi mới miễn phí hoặc sản phẩm tương đương (miễn phí trong 30
            ngày đầu){" "}
            <span className="cursor-pointer text-blue-500 hover:text-blue-600 hover:underline">
              (Xem chi tiết)
            </span>
          </span>
        </li>

        {/* RECEIPT / VAT */}
        <li className="flex items-start gap-3">
          <Receipt size={18} className="mt-0.5 text-purple-600" />
          <span>
            Giá đã bao gồm VAT, xuất hóa đơn ngay sau khi bán hàng. Yên tâm mua
            sắm, hạch toán dễ dàng!{" "}
            <span className="cursor-pointer text-blue-500 hover:text-blue-600 hover:underline">
              (Tham khảo chính sách xuất hoá đơn)
            </span>
          </span>
        </li>
      </ul>
    </div>
  );
}
