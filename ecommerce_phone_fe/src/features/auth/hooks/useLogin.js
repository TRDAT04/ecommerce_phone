import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authService";
import axiosClient from "../../../service/axiosClient";
import { useAuthStore } from "../../../store/authStore";

export const useLogin = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);
  const setTokens = useAuthStore((state) => state.setTokens);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return false;
    }

    try {
      setLoading(true);
      setError("");

      // ================= 1. LOGIN =================
      const res = await login(email, password);
      const { accessToken, refreshToken } = res;

      // ================= 2. SET TOKEN TẠM =================
      // 👉 để axios interceptor có token khi gọi /me
      setTokens({
        accessToken,
        refreshToken,
      });

      // ================= 3. GET USER =================
      const userRes = await axiosClient.get("/api/users/me");

      // ================= 4. LƯU AUTH ĐẦY ĐỦ =================
      setAuth({
        user: userRes.data,
        accessToken,
        refreshToken,
      });

      // ================= 5. REDIRECT =================
      navigate("/");

      return true;
    } catch (err) {
      console.error(err);
      setError("Sai tài khoản hoặc mật khẩu!");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    error,
  };
};
