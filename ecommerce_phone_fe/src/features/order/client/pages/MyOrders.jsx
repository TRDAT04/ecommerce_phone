import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../service/axiosClient";
import {
  Receipt,
  PackageSearch,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const navigate = useNavigate();

  // ================= LOAD ORDERS =================
  const fetchMyOrders = async () => {
    try {
      const res = await axiosClient.get("/api/orders/user/me");
      console.log(res.data);
      console.log("RES", res.data);
  
      const raw = res.data;
  
      const safeOrders = Array.isArray(raw)
        ? raw
        : raw?.orders || raw?.data || [];
  
      console.log("SAFE", safeOrders);
  
      setOrders(safeOrders);
    } catch (err) {
      console.error("ERR", err);
      console.error(err.response);
  
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // ================= STATUS CONFIG =================
  const statusMap = {
    PENDING: {
      text: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    CONFIRMED: {
      text: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700",
      icon: PackageSearch,
    },
    SHIPPING: {
      text: "Đang giao",
      color: "bg-purple-100 text-purple-700",
      icon: Truck,
    },
    DONE: {
      text: "Hoàn thành",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle2,
    },
    CANCELLED: {
      text: "Đã hủy",
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
  };

  // ================= FILTER =================
  const tabs = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    { key: "DONE", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  const filteredOrders =
    activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  // ================= EMPTY =================
  if (orders.length === 0) {
    return (
      <div className="py-20 text-center">
        <PackageSearch className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <h1 className="mb-2 text-xl font-semibold">Bạn chưa có đơn hàng nào</h1>
        <p className="text-gray-500">Hãy mua sắm để trải nghiệm nhé 😉</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Receipt className="h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
      </div>

      {/* FILTER TABS */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeTab === tab.key
                ? "border-red-500 bg-red-500 text-white shadow"
                : "bg-white hover:bg-gray-100"
            } `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {filteredOrders.map((o) => {
          const status = statusMap[o.status] || {
            text: o.status,
            color: "bg-gray-100 text-gray-700",
            icon: Clock,
          };

          const Icon = status.icon;

          return (
            <div
              key={o.id}
              onClick={() => navigate(`/order/${o.id}`)}
              className="cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">Đơn #{o.id}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${status.color}`}
                >
                  <Icon size={16} />
                  {status.text}
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <p className="text-sm text-gray-500">Tổng tiền</p>

                <p className="text-lg font-bold text-red-500">
                  {o.totalPrice?.toLocaleString()} đ
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
