import {
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react";

import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="hidden md:block mt-10 bg-gradient-to-b from-[#00584b] to-[#003d34] text-gray-300">
      {/* TOP */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:gap-10 md:py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* COLUMN 1 */}
        <div>
          <h3 className="relative mb-6 inline-block text-xl font-bold text-white">
            Hỗ trợ - dịch vụ
            <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-emerald-400"></span>
          </h3>

          <ul className="mt-6 space-y-4">
            {[
              {
                icon: CreditCard,
                text: "Chính sách mua hàng trả góp",
              },
              {
                icon: Truck,
                text: "Chính sách vận chuyển",
              },
              {
                icon: ShieldCheck,
                text: "Chính sách bảo hành",
              },
              {
                icon: RefreshCcw,
                text: "Chính sách đổi trả",
              },
              {
                icon: ShieldCheck,
                text: "Chính sách bảo mật",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <li
                  key={i}
                  className="flex cursor-pointer items-center gap-3 transition-all duration-300 hover:translate-x-1 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  <span>{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* COLUMN 2 */}
        <div>
          <h3 className="relative mb-6 inline-block text-xl font-bold text-white">
            Thông tin
            <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-emerald-400"></span>
          </h3>

          <ul className="mt-6 space-y-4">
            {[
              "Giới thiệu",
              "Liên hệ",
              "Tuyển dụng",
              "Tra cứu đơn hàng",
              "Tra cứu bảo hành",
            ].map((item, i) => (
              <li
                key={i}
                className="cursor-pointer transition-all duration-300 hover:translate-x-1 hover:text-white"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div>
          <h3 className="relative mb-6 inline-block text-xl font-bold text-white">
            Thanh toán
            <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-emerald-400"></span>
          </h3>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {["VISA", "MOMO", "VNPAY", "ZALO PAY"].map((item, i) => (
              <div
                key={i}
                className="cursor-pointer rounded-xl border border-white/10 bg-white/10 py-3 text-center text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-black"
              >
                {item}
              </div>
            ))}
          </div>

          {/* NEWSLETTER */}
          <div className="mt-8">
            <p className="mb-3 text-sm text-gray-200">
              Đăng ký nhận ưu đãi mới nhất
            </p>

            <div className="flex overflow-hidden rounded-xl bg-white">
              <input
                type="email"
                placeholder="Nhập email..."
                className="flex-1 px-4 py-3 text-sm text-black outline-none"
              />

              <button className="bg-emerald-500 px-5 text-sm font-medium text-white transition hover:bg-emerald-600">
                Gửi
              </button>
            </div>
          </div>
        </div>

        {/* COLUMN 4 */}
        <div>
          <h3 className="relative mb-6 inline-block text-xl font-bold text-white">
            Liên hệ
            <span className="absolute -bottom-2 left-0 h-1 w-12 rounded-full bg-emerald-400"></span>
          </h3>

          <div className="mt-6 space-y-5">
            {/* HOTLINE 1 */}
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 text-emerald-400" />

              <div>
                <p className="font-semibold text-white">1900 2091</p>

                <p className="text-sm text-gray-400">
                  Tư vấn mua hàng (8h30 - 21h30)
                </p>
              </div>
            </div>

            {/* HOTLINE 2 */}
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 text-emerald-400" />

              <div>
                <p className="font-semibold text-white">1900 5678</p>

                <p className="text-sm text-gray-400">Hỗ trợ kỹ thuật</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-emerald-400" />
              <p>support@nextmobile.vn</p>
            </div>

            {/* ADDRESS */}
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <p>12 Nguyễn trãi, Hà Nội</p>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="mt-8 flex gap-4">
            {[FaFacebookF, FaInstagram, FaYoutube, FaTiktok].map((Icon, i) => (
              <div
                key={i}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/10 transition-all duration-300 hover:scale-110 hover:bg-emerald-500"
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 text-sm text-gray-400 md:flex-row lg:px-8">
          <p>© {new Date().getFullYear()} NextMobile. All rights reserved.</p>

          <div className="flex gap-5">
            <span className="cursor-pointer transition hover:text-white">
              Điều khoản
            </span>

            <span className="cursor-pointer transition hover:text-white">
              Bảo mật
            </span>

            <span className="cursor-pointer transition hover:text-white">
              Hỗ trợ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
