import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Track in-flight refresh to avoid concurrent refresh storms
let isRefreshing = false;
let failedQueue = [];
// Prevent multiple redirect-to-login calls in the same cycle
let isRedirecting = false;

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Cleanly log the user out without causing a hard page reload.
 * Clears localStorage so that AuthContext won't restore a stale user
 * on the next render, then fires a custom event so AuthContext can
 * perform a soft React-Router redirect to /login.
 */
const softLogout = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  // Clear stale user data so AuthContext doesn't restore it on next mount
  localStorage.removeItem("user");
  // Dispatch event — AuthContext listens and navigates via React Router
  window.dispatchEvent(new CustomEvent("auth:session-expired"));
  // Reset after a tick so future legitimate sessions work
  setTimeout(() => {
    isRedirecting = false;
  }, 3000);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Never retry auth endpoints to avoid loops
    const skipUrls = ["auth/login", "auth/logout", "auth/refresh/token"];
    if (skipUrls.some((url) => originalRequest.url.includes(url))) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue subsequent 401s while a refresh is already in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_URL}auth/refresh/token/`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        // Soft logout — no hard reload, no loop
        softLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
