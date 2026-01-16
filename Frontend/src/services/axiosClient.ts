// src/services/axiosClient.ts
import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/token.utils';
import type { ApiResponse, TokenDto } from '../types/auth.types';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5293/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa từng thử lại request này
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang có tiến trình refresh rồi, thì đưa request này vào hàng đợi
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      const accessToken = getAccessToken();

      if (!refreshToken || !accessToken) {
        // Không có token để refresh -> Logout
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Gọi API Refresh Token (Sử dụng instance axios mới để tránh loop interceptor)
        const response = await axios.post<ApiResponse<TokenDto>>(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5293/api'}/auth/refresh-token`,
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
          }
        );

        if (response.data.success && response.data.data) {
          const newTokens = response.data.data;
          
          // 1. Lưu token mới
          setTokens(newTokens);
          
          // 2. Cập nhật header mặc định cho instance hiện tại
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`;
          
          // 3. Xử lý các request đang đợi trong hàng đợi
          processQueue(null, newTokens.accessToken);
          
          // 4. Gọi lại request ban đầu bị lỗi
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return axiosClient(originalRequest);
        } else {
            throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;