import axiosClient from "../../../service/axiosClient";

export const login = async (email, password) => {
  const res = await axiosClient.post(`/api/auth/login`, { email, password });
  return res.data;
};

export const register = async (data) => {
  const res = await axiosClient.post(`/api/auth/register`, data);
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axiosClient.post(`/api/auth/refresh`, { refreshToken });
  return res.data;
};