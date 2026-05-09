import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Handle refresh + retry (FIXED)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("auth/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) throw error;

        const res = await axios.post(
          "http://localhost:8000/api/auth/refresh/token/",
          { refresh },
        );

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        // 🔥 IMPORTANT FIX: preserve full request
        return api({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccess}`,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
