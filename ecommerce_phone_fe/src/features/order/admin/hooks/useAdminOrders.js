import { useState, useEffect } from "react";
import { getAdminOrders } from "../api/adminOrderService";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders({ status, phone });
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi load orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, status, setStatus, phone, setPhone, fetchOrders };
};