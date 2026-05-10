import axiosClient from "../../../../service/axiosClient";

export const getAdminOrders = ({ status, phone } = {}) => {
  let url = "/api/admin/orders?";
  if (status) url += `status=${status}&`;
  if (phone) url += `phone=${phone}`;
  return axiosClient.get(url);
};

export const getAdminOrderById = (id) =>
  axiosClient.get(`/api/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  axiosClient.put(`/api/admin/orders/${id}/status`, { status });