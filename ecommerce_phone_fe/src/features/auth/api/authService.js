import axios from "axios";
import axiosClient from "../../../service/axiosClient";

export const login = async (email, password) => {
  const res = await axiosClient.post(`/api/auth/login`, { email, password });
  return res.data;
};

export const register = async (data) => {
  const res = await axiosClient.post(`/api/auth/register`, data);
  return res.data;
};

// Không cần gửi refreshToken trong body - cookie tự đính kèm
export const refreshTokenApi = async () => {
  const res = await axiosClient.post(`/api/auth/refresh`, {});
  return res.data;
};

// Gọi API logout: BE sẽ blacklist access token + xóa refresh cookie
export const logoutApi = async () => {
  try {
    await axiosClient.post(`/api/auth/logout`);
  } catch (e) {
    // Bỏ qua lỗi network khi logout - vẫn clear store phía FE
  }
};