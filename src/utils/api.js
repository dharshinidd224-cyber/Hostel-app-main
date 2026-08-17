import axios from "axios";

const API_URL = "http://192.168.99.25:5000";

console.log("🔥 ACTUAL API URL:", API_URL);

const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;