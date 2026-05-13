import { ShieldCheck, RefreshCcw, Phone, Truck } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "Sản phẩm chính hãng 100%" },
  { icon: RefreshCcw, text: "Đổi lỗi trong 30 ngày" },
  { icon: Phone, text: "Hotline: 1900 2091" },
  { icon: Truck, text: "Miễn phí vận chuyển toàn quốc" },
];

const TopBar = () => {
  return (
    <div className="hidden w-full border-b border-red-700/20 bg-gradient-to-r from-green-700 via-green-700 to-green-700 text-sm text-white md:block">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6 overflow-x-auto py-2 scrollbar-none">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex cursor-default items-center gap-2 whitespace-nowrap"
              >
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/15 transition-all group-hover:bg-white/25">
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white/90 transition group-hover:text-white">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
