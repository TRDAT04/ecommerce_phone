import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminOrderById, updateOrderStatus, deleteAdminOrder } from "../api/adminOrderService";
import toast from "react-hot-toast";

export const useAdminOrderDetail = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteAdminOrder(id);
      toast.success("Đã xóa đơn hàng thành công");
      navigate("/admin/orders");
    } catch {
      toast.error("Xóa đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    loading,
    handleUpdateStatus,
    handleDelete,
    canCancel: order?.status === "PENDING",
  };
};