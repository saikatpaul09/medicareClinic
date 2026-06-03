import axios from "axios";

// Access the environment variable using import.meta.env
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientWithAuth = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies in requests
  });
};
