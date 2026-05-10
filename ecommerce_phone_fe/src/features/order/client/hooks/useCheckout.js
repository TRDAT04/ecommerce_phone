import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/authStore";
import { createOrder } from "../api/orderService";

export const useCheckout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod",
  });

  const isBuyNow = new URLSearchParams(window.location.search).get("type") === "buyNow";

  useEffect(() => {
    if (isBuyNow) {
      const item = JSON.parse(localStorage.getItem("buyNow"));
      setCart({ items: item ? [item] : [] });
    } else {
      const data = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      setCart(data);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      customerName: prev.customerName || user.name || user.fullName || "",
      phone: prev.phone || user.phone || "",
      address: prev.address || user.address || "",
    }));
  }, [user]);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  const validate = () => {
    if (!form.customerName.trim()) return "Vui lòng nhập họ tên";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!form.address.trim()) return "Vui lòng nhập địa chỉ";
    if (cart.items.length === 0) return "Không có sản phẩm để thanh toán";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      setLoading(true);
      const res = await createOrder({
        ...form,
        totalPrice: total,
        items: cart.items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
      });

      if (isBuyNow) {
        localStorage.removeItem("buyNow");
      } else {
        localStorage.removeItem("cart");
        window.dispatchEvent(new Event("cartUpdated"));
      }

      navigate(`/success/${res.data.orderId}`);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  return { cart, form, setForm, loading, subtotal, shipping, total, handleSubmit };
};