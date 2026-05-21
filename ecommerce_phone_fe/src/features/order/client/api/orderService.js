import axiosClient from "../../../../service/axiosClient";

export const getMyOrders = () =>
  axiosClient.get("/api/orders/user/me");

export const getOrderById = (id) =>
  axiosClient.get(`/api/orders/${id}`);

export const createOrder = (payload) =>
  axiosClient.post("/api/orders", payload);

export const cancelOrder = (id) =>
  axiosClient.put(`/api/orders/${id}/cancel`);

export const getOrdersByPhone = (phone) =>
  axiosClient.get(`/api/orders/phone/${phone}`);

export const trackOrderByIdAndPhone = (id, phone) =>
  axiosClient.get(`/api/orders/${id}/track`, { params: { phone } });