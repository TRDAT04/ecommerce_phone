import { useEffect, useState } from "react";
import { getOverview } from "../api/dashboardService";

import { DollarSign, ShoppingCart, Users, Package, Star } from "lucide-react";

export default function OverviewCards() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getOverview().then((res) => setOverview(res.data));
  }, []);

  if (!overview)
    return <div className="h-[120px] animate-pulse rounded-2xl bg-gray-200" />;

  const items = [
    {
      label: "Doanh thu",
      value: overview.totalRevenue.toLocaleString() + "₫",
      icon: DollarSign,
      iconStyle: "bg-green-100 text-green-600",
    },
    {
      label: "Đơn hàng",
      value: overview.totalOrders,
      icon: ShoppingCart,
      iconStyle: "bg-blue-100 text-blue-600",
    },
    {
      label: "Người dùng",
      value: overview.totalUsers,
      icon: Users,
      iconStyle: "bg-purple-100 text-purple-600",
    },
    {
      label: "Sản phẩm",
      value: overview.totalProducts,
      icon: Package,
      iconStyle: "bg-orange-100 text-orange-600",
    },
    {
      label: "Đánh giá",
      value: overview.totalReviews,
      icon: Star,
      iconStyle: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item, i) => {
        const Icon = item.icon;

        return (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            {/* Top */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{item.label}</p>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconStyle} `}
              >
                <Icon size={18} />
              </div>
            </div>

            {/* Value */}
            <h2 className="mt-4 text-2xl font-bold break-all text-gray-800">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}
