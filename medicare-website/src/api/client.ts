import axios from "axios";
import useAuthStore from "../store";
import { REFRESH_TOKEN } from "./apiRoutes";

// Access the environment variable using import.meta.env
export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientWithAuth = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// Secondary isolated instance specifically for handling refreshes
// This prevents infinite loop traps if the refresh endpoint itself throws a 401
const apiRefresh = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 1. Request Interceptor: Attach the current memory token to every outgoing request
apiClientWithAuth.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().login?.userInfo?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
// 2. Response Interceptor: Catch 401s and handle token recovery
apiClientWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await apiRefresh.post(REFRESH_TOKEN);
        const newAccessToken = response.data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClientWithAuth(originalRequest);
      } catch (refreshError) {
        console.log(refreshError, "Error in refreshing");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
