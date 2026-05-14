import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import axiosClient from "../../../service/axiosClient";
import toast from "react-hot-toast";

const validateEmail = (email) => {
  if (!email) return "Email không được để trống";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email không đúng định dạng";
  return "";
};

const validatePassword = (password) => {
  if (!password) return "Mật khẩu không được để trống";
  if (password.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
  return "";
};

export const useLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const setTokens = useAuthStore((s) => s.setTokens);

  const fieldErrors = {
    email: touched.email ? validateEmail(form.email) : "",
    password: touched.password ? validatePassword(form.password) : "",
  };

  const hasFieldError = (name) => Boolean(fieldErrors[name]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const toggleShowPass = () => setShowPass((v) => !v);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setTouched({ email: true, password: true });
    
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    if (emailErr || passErr) return;

    try {
      setLoading(true);
      setError("");

      const res = await axiosClient.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const { accessToken, refreshToken } = res.data;
      setTokens({ accessToken, refreshToken });

      const userRes = await axiosClient.get("/api/users/me");
      
      setAuth({
        user: userRes.data,
        accessToken,
        refreshToken,
      });
toast.success("Đăng nhập thành công")
      const role = userRes.data.role;
      if (role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sai tài khoản hoặc mật khẩu!");
      setError("Sai tài khoản hoặc mật khẩu!");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    touched,
    showPass,
    loading,
    error,
    fieldErrors,
    hasFieldError,
    handleChange,
    handleBlur,
    toggleShowPass,
    handleSubmit,
  };
};
