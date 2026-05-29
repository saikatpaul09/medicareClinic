import axios from "axios";

// Access the environment variable using import.meta.env
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
