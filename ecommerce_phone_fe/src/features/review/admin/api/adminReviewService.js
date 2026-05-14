import axiosClient from "../../../../service/axiosClient";

export const getAdminReviews = async (params) => {
  return await axiosClient.get("/api/admin/reviews", { params });
};

export const deleteAdminReview = async (id) => {
  return await axiosClient.delete(`/api/admin/reviews/${id}`);
};
