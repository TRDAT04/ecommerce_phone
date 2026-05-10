import { useState, useEffect } from "react";
import { getMyOrders } from "../api/orderService";

export const useMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        const raw = res.data;
        setOrders(Array.isArray(raw) ? raw : raw?.orders || raw?.data || []);
      })
      .catch(() => setOrders([]));
  }, []);

  const filteredOrders =
    activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  return { orders, filteredOrders, activeTab, setActiveTab };
};