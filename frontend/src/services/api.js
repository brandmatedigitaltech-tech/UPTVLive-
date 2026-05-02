import axios from "axios";

// 🌍 BASE URL
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.uptvlive.com/api";

// 🔥 AXIOS INSTANCE
const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 🔥 60 sec (IMPORTANT)
});

// ================= REQUEST INTERCEPTOR =================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    if (req.data instanceof FormData) {
      req.headers["Content-Type"] = "multipart/form-data";
    }

    return req;
  },
  (error) => Promise.reject(error),
);

// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;

    console.error("API Error:", error?.response?.data?.msg || error.message);

    // 🔐 AUTO LOGOUT
// 🔐 AUTO LOGOUT
if (status === 401) {
  localStorage.clear();

  if (!window.location.pathname.includes("/admin")) {
    window.location.href = "/admin";
  }
}

    // 🔥 SERVER SLEEP HANDLE (NO ALERT)
   if (!error.response && !error.config._retry) {
  console.log("Server waking up... retrying ⏳");

  error.config._retry = true;

  await new Promise((res) => setTimeout(res, 5000));

  return API.request(error.config);
}
    return Promise.reject(error);
  },
);

export default API;
