import axiosClient from "../../../../service/axiosClient";

export const getMyOrders = () =>
  axiosClient.get("/api/orders/user/me");

export const getOrderByCode = (orderCode) =>
  axiosClient.get(`/api/orders/${orderCode}`);

export const createOrder = (payload) =>
  axiosClient.post("/api/orders", payload);

export const cancelOrder = (id) =>
  axiosClient.put(`/api/orders/${id}/cancel`);

export const getOrdersByPhone = (phone) =>
  axiosClient.get(`/api/orders/phone/${phone}`);

export const trackOrderByCodeAndPhone = (orderCode, phone) =>
  axiosClient.get(`/api/orders/${orderCode}/track`, { params: { phone } });