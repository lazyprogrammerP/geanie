import axios from "axios";
import { toast } from "react-toastify";

const service = axios.create({
  baseURL: "http://127.0.0.1:8080",
});

service.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    {
      if (error.response.status == 401) {
        toast.error("Unauthorized. Please login again.");
        window.location.href = "/auth/sign-in";
      }

      if (
        error.response.status == 400 ||
        error.response.status == 404 ||
        error.response.status == 500
      ) {
        toast.error(error.response.data.message);
      }

      return error.response;
    }
  },
);

export default service;
