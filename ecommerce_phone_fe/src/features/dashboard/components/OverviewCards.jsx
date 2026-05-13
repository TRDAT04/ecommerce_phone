import { useEffect, useState } from "react";
import { getOverview } from "../api/dashboardService";
import { DollarSign, ShoppingCart, Users, Package, Star, TrendingUp } from "lucide-react";

const CARDS = [
  {
    key: "totalRevenue",
    label: "Doanh thu",
    icon: DollarSign,
    format: (v) => v.toLocaleString("vi-VN") + "₫",
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    shadow: "shadow-emerald-100",
  },
  {
    key: "totalOrders",
    label: "Đơn hàng",
    icon: ShoppingCart,
    format: (v) => v.toLocaleString(),
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    shadow: "shadow-blue-100",
  },
  {
    key: "totalUsers",
    label: "Người dùng",
    icon: Users,
    format: (v) => v.toLocaleString(),
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    shadow: "shadow-violet-100",
  },
  {
    key: "totalProducts",
    label: "Sản phẩm",
    icon: Package,
    format: (v) => v.toLocaleString(),
    gradient: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
    text: "text-orange-600",
    shadow: "shadow-orange-100",
  },
  {
    key: "totalReviews",
    label: "Đánh giá",
    icon: Star,
    format: (v) => v.toLocaleString(),
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    text: "text-pink-600",
    shadow: "shadow-pink-100",
  },
];

export default function OverviewCards() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getOverview().then((res) => setOverview(res.data));
  }, []);

  if (!overview) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-3.5 w-20 rounded-full bg-gray-200" />
              <div className="h-10 w-10 rounded-xl bg-gray-100" />
            </div>
            <div className="h-7 w-28 rounded-lg bg-gray-200" />
            <div className="mt-2 h-3 w-16 rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((card, i) => {
        const Icon = card.icon;
        const value = overview[card.key] ?? 0;

        return (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:${card.shadow}`}
          >
            {/* Top */}
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm`}>
                <Icon size={18} className="text-white" />
              </div>
            </div>

            {/* Value */}
            <p className="text-2xl font-extrabold tracking-tight text-gray-900 break-all">
              {card.format(value)}
            </p>

            {/* Trend chip */}
            <div className={`mt-2 inline-flex items-center gap-1 rounded-full ${card.bg} px-2 py-0.5`}>
              <TrendingUp size={11} className={card.text} />
              <span className={`text-[11px] font-medium ${card.text}`}>Cập nhật mới nhất</span>
            </div>

            {/* Background decoration */}
            <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-5`} />
          </div>
        );
      })}
    </div>
  );
}
