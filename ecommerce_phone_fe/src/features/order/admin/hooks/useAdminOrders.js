import { useState, useEffect } from "react";
import { getAdminOrders } from "../api/adminOrderService";

export const useAdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [phone, setPhone] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders({ status, phone });
      const data = res.data.content ? res.data.content : res.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi load orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, status, setStatus, phone, setPhone, fetchOrders };
};