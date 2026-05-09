import axiosClient from "../../../service/axiosClient";

export const getOverview = () =>
  axiosClient.get("/api/admin/dashboard/overview");

export const getRevenue = () =>
  axiosClient.get("/api/admin/dashboard/revenue");

export const getRecentOrders = () =>
  axiosClient.get("/api/admin/dashboard/recent-orders");

export const getTopProducts=()=>
  axiosClient.get("/api/admin/dashboard/top-products")