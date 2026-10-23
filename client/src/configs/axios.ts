import axios from "axios";
import { safeUserMessage } from "@/lib/utils";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "http://localhost:5000",
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error && typeof error === "object") {
      const fromApi = (error as { response?: { data?: { message?: unknown } } }).response?.data?.message;
      const safe = safeUserMessage(fromApi, "");
      if (safe) {
        (error as { userMessage?: string }).userMessage = safe;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
