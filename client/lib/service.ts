import axios from "axios";

const service = axios.create({
  baseURL: "http://127.0.0.1:8080",
});

service.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export default service;
