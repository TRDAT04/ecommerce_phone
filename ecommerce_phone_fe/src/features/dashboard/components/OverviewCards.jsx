import { useEffect, useState } from "react";
import { getOverview } from "../api/dashboardService";
import {
  DollarSign, ShoppingCart, Users, Package,
  Star, TrendingUp, TrendingDown, Minus,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtVND = (v) => v?.toLocaleString("vi-VN") + "₫";
const fmtShort = (v) => {
  if (!v) return "0₫";
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1) + "B₫";
  if (v >= 1_000_000)     return (v / 1_000_000).toFixed(0) + "M₫";
  if (v >= 1_000)         return (v / 1_000).toFixed(0) + "K₫";
  return v + "₫";
};

// Tính MoM% và trả về { pct, Icon, colorClass, label }
function calcMoM(current, last) {
  if (last <= 0) return null;
  const pct = ((current - last) / last) * 100;
  return {
    pct,
    Icon:       pct > 0 ? TrendingUp : pct < 0 ? TrendingDown : Minus,
    colorClass: pct > 0 ? "text-emerald-600" : pct < 0 ? "text-red-500" : "text-gray-400",
    bgClass:    pct > 0 ? "bg-emerald-50" : pct < 0 ? "bg-red-50" : "bg-gray-50",
    ringClass:  pct > 0 ? "ring-emerald-100" : pct < 0 ? "ring-red-100" : "ring-gray-100",
    label:      `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}% so tháng trước`,
  };
}

// ─── Card config ──────────────────────────────────────────────────────────────
const CARDS = [
  {
    key: "totalRevenue",
    label: "Doanh thu",
    icon: DollarSign,
    format: fmtVND,
    gradient: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    shadow: "shadow-emerald-100",
    // Sub-value: doanh thu tháng này
    subKey: "currentMonthRevenue",
    subLabel: "Tháng này",
    subFormat: fmtShort,
    // Trend: so sánh tháng này vs tháng trước
    trendCurrentKey: "currentMonthRevenue",
    trendLastKey:    "lastMonthRevenue",
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

// ─── Single Card ──────────────────────────────────────────────────────────────
function OverviewCard({ card, overview }) {
  const Icon  = card.icon;
  const value = overview[card.key] ?? 0;

  // Sub-value (chỉ card doanh thu)
  const subValue = card.subKey ? (overview[card.subKey] ?? 0) : null;

  // MoM trend (chỉ card doanh thu)
  const mom = card.trendCurrentKey
    ? calcMoM(overview[card.trendCurrentKey] ?? 0, overview[card.trendLastKey] ?? 0)
    : null;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100
        transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:${card.shadow}`}
    >
      {/* ── Top row ── */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{card.label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {/* ── Main value ── */}
      <p className="text-2xl font-extrabold tracking-tight text-gray-900 break-all">
        {card.format(value)}
      </p>

      {/* ── Sub-value: doanh thu tháng này ── */}
      {subValue !== null && (
        <p className="mt-0.5 text-xs text-gray-400">
          <span className="font-medium text-gray-600">{card.subFormat(subValue)}</span>
          {" "}{card.subLabel}
        </p>
      )}

      {/* ── Trend chip ── */}
      <div className="mt-2">
        {mom ? (
          // Chip MoM% động
          <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${mom.bgClass} ${mom.ringClass}`}>
            <mom.Icon size={11} className={mom.colorClass} />
            <span className={`text-[11px] font-semibold ${mom.colorClass}`}>{mom.label}</span>
          </div>
        ) : (
          // Chip tĩnh cho các card còn lại
          <div className={`inline-flex items-center gap-1 rounded-full ${card.bg} px-2 py-0.5`}>
            <TrendingUp size={11} className={card.text} />
            <span className={`text-[11px] font-medium ${card.text}`}>Cập nhật mới nhất</span>
          </div>
        )}
      </div>

      {/* ── Background decoration ── */}
      <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br ${card.gradient} opacity-5`} />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-3.5 w-20 rounded-full bg-gray-200" />
        <div className="h-10 w-10 rounded-xl bg-gray-100" />
      </div>
      <div className="h-7 w-28 rounded-lg bg-gray-200" />
      <div className="mt-1 h-3 w-20 rounded-full bg-gray-100" />
      <div className="mt-2 h-5 w-32 rounded-full bg-gray-100" />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function OverviewCards() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getOverview().then((res) => setOverview(res.data));
  }, []);

  if (!overview) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((card, i) => (
        <OverviewCard key={i} card={card} overview={overview} />
      ))}
    </div>
  );
}
