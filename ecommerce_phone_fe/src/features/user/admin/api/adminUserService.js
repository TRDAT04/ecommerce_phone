import axiosClient from "../../../../service/axiosClient";

export const getAdminUsers = () =>
  axiosClient.get("/api/admin/users");

export const getAdminUserById = (id) =>
  axiosClient.get(`/api/admin/users/${id}`);

export const updateAdminUser = (id, data) =>
  axiosClient.put(`/api/admin/users/${id}`, data);

export const deleteAdminUser = (id) =>
  axiosClient.delete(`/api/admin/users/${id}`);

export const resetUserPassword = (id, password) =>
  axiosClient.put(`/api/admin/users/${id}/password`, { password });