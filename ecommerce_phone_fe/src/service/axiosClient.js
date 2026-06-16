import axios from "axios";
import { useAuthStore } from "../store/authStore";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Bắt buộc để trình duyệt tự gửi HttpOnly Cookie (refresh_token)
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
  (res) => {
    // Unwrap ApiResponse from backend automatically
    if (res.data && res.data.status !== undefined && res.data.data !== undefined) {
      res.data = res.data.data;
    }
    return res;
  },
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

    // Nếu chưa retry → bắt đầu silent refresh
    if (!originalRequest._retry) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Không cần gửi body - trình duyệt tự gửi HttpOnly Cookie refresh_token
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const data = refreshRes.data?.data ?? refreshRes.data;
        const newAccessToken = data.accessToken;

        // Chỉ cập nhật accessToken (refreshToken nằm trong cookie, không cần lưu)
        store.setTokens({ accessToken: newAccessToken });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = "Bearer " + newAccessToken;
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