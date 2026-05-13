import { useEffect, useState } from "react";
import { getTopProducts } from "../api/dashboardService";
import { Trophy, TrendingUp, Package, Medal } from "lucide-react";

const RANK_STYLES = [
  {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    text: "text-white",
    shadow: "shadow-amber-200",
    label: "🥇",
  },
  {
    bg: "bg-gradient-to-br from-gray-300 to-gray-400",
    text: "text-white",
    shadow: "shadow-gray-200",
    label: "🥈",
  },
  {
    bg: "bg-gradient-to-br from-orange-400 to-amber-600",
    text: "text-white",
    shadow: "shadow-orange-200",
    label: "🥉",
  },
];

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gray-200" />
          <div>
            <div className="h-4 w-28 rounded-full bg-gray-200" />
            <div className="mt-1.5 h-3 w-20 rounded-full bg-gray-100" />
          </div>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-gray-50 pb-4 last:border-0">
            <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 rounded-full bg-gray-200" />
              <div className="h-3 w-20 rounded-full bg-gray-100" />
            </div>
            <div className="h-4 w-20 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Package size={32} className="mb-2 text-gray-300" />
        <p className="text-sm text-gray-400">Chưa có dữ liệu sản phẩm</p>
      </div>
    );
  }

  // Max revenue for progress bar
  const maxRevenue = Math.max(...products.map((p) => p.revenue));

  return (
    <div>
      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 shadow-sm">
          <Trophy size={17} className="text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">Sản phẩm bán chạy</h2>
          <p className="text-xs text-gray-400">Top {products.length} doanh thu cao nhất</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {products.map((p, index) => {
          const rank = RANK_STYLES[index];
          const pct = maxRevenue > 0 ? (p.revenue / maxRevenue) * 100 : 0;

          return (
            <div
              key={p.id}
              className="group rounded-xl border border-gray-50 bg-gray-50/50 p-3 transition-all hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm ${
                    rank
                      ? `${rank.bg} ${rank.text} ${rank.shadow}`
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {rank ? rank.label : index + 1}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-800">{p.name}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Package size={11} />
                      {p.sold} đã bán
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-bold text-emerald-600">
                    {p.revenue.toLocaleString("vi-VN")}₫
                  </p>
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-green-500">
                    <TrendingUp size={10} />
                    <span>Top sale</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
