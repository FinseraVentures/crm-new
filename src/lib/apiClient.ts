// utils/apiClient.ts
import axios from "axios";
import { getApiUrl } from "@/config/env";

const apiClient = axios.create({
  baseURL: getApiUrl(""), // will be appended by endpoints
  timeout: 15000,
});

// Auto-attach token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

export default apiClient;
