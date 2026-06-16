import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/authStore";
import { createOrder } from "../api/orderService";
import { useProvinces } from "./useProvinces";
import toast from "react-hot-toast";

export const useCheckout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { provinces, wards, loadingProvinces, loadingWards, fetchWards } =
    useProvinces();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    // address fields
    province: "",       // province name
    provinceCode: "",   // province code (for fetching wards)
    ward: "",           // ward name
    wardCode: "",       // ward code
    specificAddress: "", // số nhà, tên đường
    // other
    note: "",
    email: "",
    paymentMethod: "cod",
  });

  const isBuyNow =
    new URLSearchParams(window.location.search).get("type") === "buyNow";

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
      email: prev.email || user.email || "",
    }));
  }, [user]);

  // When province changes → fetch wards & reset ward
  const handleProvinceChange = (e) => {
    const selected = provinces.find(
      (p) => p.code === parseInt(e.target.value)
    );
    setForm((prev) => ({
      ...prev,
      province: selected ? selected.name : "",
      provinceCode: selected ? selected.code : "",
      ward: "",
      wardCode: "",
    }));
    if (selected) fetchWards(selected.code);
  };

  // When ward changes
  const handleWardChange = (e) => {
    const selected = wards.find((w) => w.code === parseInt(e.target.value));
    setForm((prev) => ({
      ...prev,
      ward: selected ? selected.name : "",
      wardCode: selected ? selected.code : "",
    }));
  };

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  // Build full address string for backend
  const buildFullAddress = () => {
    const parts = [form.specificAddress, form.ward, form.province].filter(
      Boolean
    );
    return parts.join(", ");
  };

  const validate = () => {
    if (!form.customerName.trim()) return "Vui lòng nhập họ tên";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại";
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(form.phone.trim()))
      return "Số điện thoại không hợp lệ (VD: 0912345678)";
    if (!form.province) return "Vui lòng chọn tỉnh/thành phố";
    if (!form.ward) return "Vui lòng chọn phường/xã";
    if (!form.specificAddress.trim()) return "Vui lòng nhập địa chỉ cụ thể";
    if (cart.items.length === 0) return "Không có sản phẩm để thanh toán";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);
      const fullAddress = buildFullAddress();
      const res = await createOrder({
        customerName: form.customerName,
        phone: form.phone,
        address: fullAddress,
        note: form.note,
        email: form.email,
        paymentMethod: form.paymentMethod,
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

      navigate(`/success/${res.data.orderCode}`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    form,
    setForm,
    loading,
    subtotal,
    shipping,
    total,
    handleSubmit,
    user,
    // address selects
    provinces,
    wards,
    loadingProvinces,
    loadingWards,
    handleProvinceChange,
    handleWardChange,
  };
};