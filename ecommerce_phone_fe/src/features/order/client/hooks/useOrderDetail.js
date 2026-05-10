import { useState, useEffect } from "react";
import { getOrderById, cancelOrder } from "../api/orderService";

export const useOrderDetail = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch {
      alert("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng?")) return;
    try {
      setLoading(true);
      await cancelOrder(id);
      await fetchOrder();
    } catch {
      alert("Hủy đơn thất bại");
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, handleCancel, canCancel: order?.status === "PENDING" };
};