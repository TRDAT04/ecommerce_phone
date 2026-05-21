import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackOrderByCodeAndPhone } from "../api/orderService";

export const useTrackOrder = () => {
  const [phone, setPhone] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!phone.trim()) return setError("Vui lòng nhập số điện thoại");
    if (!orderCode.trim()) return setError("Vui lòng nhập mã đơn hàng");

    try {
      setLoading(true);
      setError("");
      await trackOrderByCodeAndPhone(orderCode.trim(), phone.trim());
      navigate(`/order/${orderCode.trim()}`);
    } catch {
      setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn và số điện thoại.");
    } finally {
      setLoading(false);
    }
  };

  return { phone, setPhone, orderCode, setOrderCode, error, setError, loading, handleSearch };
};