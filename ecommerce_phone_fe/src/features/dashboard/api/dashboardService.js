import axiosClient from "../../../service/axiosClient";

export const getOverview = () =>
  axiosClient.get("/api/admin/dashboard/overview");

// Lọc theo năm: ?year=2026
export const getRevenue = (year) =>
  axiosClient.get("/api/admin/dashboard/revenue", { params: { year } });

// KPI tổng hợp theo năm
export const getRevenueSummary = (year) =>
  axiosClient.get("/api/admin/dashboard/revenue/summary", { params: { year } });


export const getRecentOrders = () =>
  axiosClient.get("/api/admin/dashboard/recent-orders");

export const getTopProducts = () =>
  axiosClient.get("/api/admin/dashboard/top-products");