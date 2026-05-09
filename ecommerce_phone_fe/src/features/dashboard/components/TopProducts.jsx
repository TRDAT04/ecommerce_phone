import { useEffect, useState } from "react";
import { getTopProducts } from "../api/dashboardService";

import { Trophy, TrendingUp, Package } from "lucide-react";

export default function TopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getTopProducts().then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="h-full rounded-2xl bg-white p-2">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
          <Trophy size={18} className="text-orange-500" />
        </div>

        <div>
          <h2 className="font-semibold text-gray-800">Sản phẩm bán chạy</h2>

          <p className="text-xs text-gray-400">Top sản phẩm doanh thu cao</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {products.map((p, index) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border-b border-gray-100 px-2 py-1 pb-3 transition-all last:border-none hover:bg-gray-50"
          >
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                  index === 0
                    ? "bg-yellow-100 text-yellow-700"
                    : index === 1
                      ? "bg-gray-100 text-gray-700"
                      : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-500"
                } `}
              >
                {index + 1}
              </div>

              {/* Info */}
              <div>
                <p className="line-clamp-1 text-sm font-medium text-gray-800">
                  {p.name}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <Package size={13} />
                  Đã bán: {p.sold}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="text-right">
              <p className="text-sm font-semibold text-emerald-600">
                {p.revenue.toLocaleString()}₫
              </p>

              <div className="mt-1 flex items-center justify-end gap-1 text-xs text-green-500">
                <TrendingUp size={12} />
                Top sale
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
