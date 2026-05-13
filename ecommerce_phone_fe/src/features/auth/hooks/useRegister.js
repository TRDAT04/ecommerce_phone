import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authService";

const VALIDATORS = {
  name: (v) => {
    if (!v.trim()) return "Họ tên không được để trống";
    if (v.trim().length < 2) return "Họ tên tối thiểu 2 ký tự";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email không được để trống";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email không đúng định dạng";
    return "";
  },
  phone: (v) => {
    if (!v.trim()) return "Số điện thoại không được để trống";
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(v.trim()))
      return "Số điện thoại không hợp lệ (VD: 0912345678)";
    return "";
  },
  address: (v) => {
    if (!v.trim()) return "Địa chỉ không được để trống";
    if (v.trim().length < 5) return "Địa chỉ tối thiểu 5 ký tự";
    return "";
  },
  password: (v) => {
    if (!v) return "Mật khẩu không được để trống";
    if (v.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    return "";
  },
  confirmPassword: (v, form) => {
    if (!v) return "Vui lòng nhập lại mật khẩu";
    if (v !== form.password) return "Mật khẩu nhập lại không khớp";
    return "";
  },
};

export const useRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "",
    password: "", confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const getError = (name) => {
    if (!touched[name]) return "";
    if (name === "confirmPassword") return VALIDATORS.confirmPassword(form[name], form);
    return VALIDATORS[name]?.(form[name]) || "";
  };

  const hasError = (name) => Boolean(getError(name));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (apiError) setApiError("");
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const toggleShowPwd = () => setShowPwd(v => !v);
  const toggleShowConfirm = () => setShowConfirm(v => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Touch all fields
    const allTouched = Object.fromEntries(
      Object.keys(form).map((k) => [k, true])
    );
    setTouched(allTouched);

    // Check all errors
    const errors = Object.keys(VALIDATORS).map((k) =>
      k === "confirmPassword"
        ? VALIDATORS.confirmPassword(form[k], form)
        : VALIDATORS[k]?.(form[k]) || ""
    );
    if (errors.some(Boolean)) return;

    try {
      setLoading(true);
      setApiError("");
      const { confirmPassword, ...payload } = form;
      await register(payload);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data || "Email đã tồn tại hoặc dữ liệu không hợp lệ!";
      setApiError(typeof msg === "string" ? msg : "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const validCount = Object.keys(VALIDATORS).filter((k) =>
    k === "confirmPassword"
      ? !VALIDATORS.confirmPassword(form[k], form)
      : !VALIDATORS[k]?.(form[k])
  ).length;
  const totalFields = Object.keys(VALIDATORS).length;

  return {
    form,
    touched,
    showPwd,
    showConfirm,
    loading,
    apiError,
    validCount,
    totalFields,
    getError,
    hasError,
    handleChange,
    handleBlur,
    toggleShowPwd,
    toggleShowConfirm,
    handleSubmit
  };
};
