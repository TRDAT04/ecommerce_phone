import { useEffect, useState } from "react";
import { getRecentOrders } from "../api/dashboardService";

import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  ShieldCheck,
} from "lucide-react";

const STATUS = {
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock3,
  },

  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-purple-100 text-purple-700",
    icon: ShieldCheck,
  },

  SHIPPING: {
    label: "Đang giao",
    color: "bg-blue-100 text-blue-700",
    icon: Truck,
  },

  DONE: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },

  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const formatDate = (date) => new Date(date).toLocaleString("vi-VN");

const formatPrice = (price) => price?.toLocaleString("vi-VN") + "₫";

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentOrders()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi API recent-order", err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 h-5 w-40 rounded bg-gray-200"></div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  // Empty
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-center text-gray-500 shadow-sm">
        <div className="mb-3 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
        </div>
        Không có đơn hàng gần đây
      </div>
    );
  }

  return (
    <div className="rounded-2xl  bg-white p-6 ">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} className="text-green-600" />

          <h2 className="text-lg font-semibold text-gray-800">
            Đơn hàng gần đây
          </h2>
        </div>

        <span className="text-sm text-gray-400">{orders.length} đơn</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500">
              <th className="py-3 text-left font-medium">Mã đơn</th>

              <th className="text-left font-medium">Khách hàng</th>

              <th className="text-left font-medium">Tổng tiền</th>

              <th className="text-left font-medium">Trạng thái</th>

              <th className="text-left font-medium">Ngày tạo</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => {
              const status = STATUS[o.status] || {
                label: o.status,
                color: "bg-gray-100 text-gray-700",
                icon: Clock3,
              };

              const StatusIcon = status.icon;

              return (
                <tr
                  key={o.id}
                  className="border-b border-gray-100 transition-all hover:bg-gray-50"
                >
                  {/* Order ID */}
                  <td className="py-4 font-semibold text-gray-800">#{o.id}</td>

                  {/* Customer */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-xs font-semibold text-white">
                        {o.customerName?.charAt(0) || "?"}
                      </div>

                      <span className="text-gray-700">{o.customerName}</span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="font-semibold text-gray-800">
                    {formatPrice(o.totalPrice)}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.color} `}
                    >
                      <StatusIcon size={13} />
                      {status.label}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap text-gray-500">
                    {formatDate(o.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
