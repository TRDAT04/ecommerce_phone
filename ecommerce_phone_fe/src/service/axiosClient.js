import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { refreshToken as refreshApi } from "../features/auth/api/authService";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

// ================= REQUEST =================
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= RESPONSE =================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    // Nếu không phải lỗi 401 thì trả lỗi luôn
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Nếu đang refresh → đưa request vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            resolve(axiosClient(originalRequest));
          },
          reject,
        });
      });
    }

    // Nếu chưa retry → bắt đầu refresh
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshApi(store.refreshToken);
        const newAccessToken = res.accessToken;
        const newRefreshToken = res.refreshToken;

        // Lưu token mới
        useAuthStore.getState().setTokens({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        // Giải quyết queue
        processQueue(null, newAccessToken);

        // Gắn token mới vào request bị lỗi
        originalRequest.headers.Authorization =
          "Bearer " + newAccessToken;

        return axiosClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;