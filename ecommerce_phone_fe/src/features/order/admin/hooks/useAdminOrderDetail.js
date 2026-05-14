import { useState, useEffect } from "react";
import { getAdminOrderById, updateOrderStatus } from "../api/adminOrderService";
import toast from "react-hot-toast";

export const useAdminOrderDetail = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await getAdminOrderById(id);
      setOrder(res.data);
    } catch (err) {
      console.error("Lỗi load order:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(id, newStatus);
      await fetchOrder();
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    handleUpdateStatus,
    canCancel: order?.status === "PENDING",
  };
};