import { ShieldCheck, RefreshCcw, Phone, Truck } from "lucide-react";

const TopBar = () => {
  const items = [
    {
      icon: ShieldCheck,
      text: "Sản phẩm chính hãng",
    },
    {
      icon: RefreshCcw,
      text: "Lỗi đổi liền trong 30 ngày",
    },
    {
      icon: Phone,
      text: "Hotline: 1900 2091",
    },
    {
      icon: Truck,
      text: "Miễn phí vận chuyển toàn quốc",
    },
  ];

  return (
    <div className="w-full border-b border-white/10 bg-gradient-to-r from-emerald-600 to-teal-700 text-sm text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="scrollbar-none flex items-center justify-between gap-6 overflow-x-auto py-2">
          {items.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="group flex cursor-pointer items-center gap-2 whitespace-nowrap"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20">
                  <Icon className="h-4 w-4 text-white" />
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
