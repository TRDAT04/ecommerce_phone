import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackOrderByIdAndPhone } from "../api/orderService";

export const useTrackOrder = () => {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại");
    if (!orderId.trim()) return setError("Vui lòng nhập mã đơn hàng");

    try {
      setLoading(true);
      setError("");
      await trackOrderByIdAndPhone(orderId.trim(), phone.trim());
      navigate(`/order/${orderId.trim()}`);
    } catch {
      setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  return { phone, setPhone, orderId, setOrderId, error, setError, loading, handleSearch };
};