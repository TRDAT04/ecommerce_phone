import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/register`, data);
  return res.data;
};

export const refreshToken = async (refreshToken) => {
  const res = await axios.post(`${API_URL}/refresh`, { refreshToken });
  return res.data;
};