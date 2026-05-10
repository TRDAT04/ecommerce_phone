import { useState } from "react";
import { getOrdersByPhone } from "../api/orderService";

export const useTrackOrder = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại");
    try {
      setError("");
      const res = await getOrdersByPhone(phone);
      const list = Array.isArray(res.data) ? res.data : [];
      setOrders(list);
      if (list.length === 0) setError("Không tìm thấy đơn hàng");
    } catch {
      setError("Có lỗi xảy ra khi tra cứu");
    }
  };

  return { phone, setPhone, orders, error, setError, handleSearch };
};