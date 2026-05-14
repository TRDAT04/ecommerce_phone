import { useState, useEffect } from "react";
import { getOrderById, cancelOrder } from "../api/orderService";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const useOrderDetail = (id) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(id);
      setOrder(res.data);
    } catch {
      toast.error("Không tải được đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Xác nhận",
      text: "Bạn có chắc muốn hủy đơn hàng?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Không"
    });
    if (!result.isConfirmed) return;
    
    try {
      setLoading(true);
      await cancelOrder(id);
      await fetchOrder();
      toast.success("Hủy đơn thành công");
    } catch {
      toast.error("Hủy đơn thất bại");
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, handleCancel, canCancel: order?.status === "PENDING" };
};