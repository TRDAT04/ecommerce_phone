import axiosClient from "../../../../service/axiosClient";

export const createProduct = (formData) =>
  axiosClient.post("/api/products", formData);

export const getProductById = (id) =>
  axiosClient.get(`/api/products/${id}`);

export const updateProduct = (id, formData) =>
  axiosClient.put(`/api/products/${id}`, formData);