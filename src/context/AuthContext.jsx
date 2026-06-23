import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Ref to expose navigate to the event listener without stale closures
  const navigateRef = useRef(navigate);
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  // On mount: verify the session is still valid server-side.
  // Don't just trust localStorage — cookies may have expired.
  useEffect(() => {
    const verifySession = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }
      try {
        // This call will attempt a token refresh via the interceptor if needed.
        // If both access + refresh are expired, the interceptor fires softLogout().
        const userResponse = await api.get("user/me/");
        setUser(userResponse.data);
        // Keep localStorage in sync with latest server data
        localStorage.setItem("user", JSON.stringify(userResponse.data));
      } catch {
        // Session is invalid — clear stale data silently.
        // The interceptor already handled the redirect via softLogout().
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  // Listen for the 'auth:session-expired' event fired by axios.js
  // and perform a soft React Router redirect — no hard page reload.
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      navigateRef.current("/login", { replace: true });
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  const login = async (email, pass) => {
    try {
      // Step 1: Login — backend sets access_token & refresh_token as HttpOnly cookies
      await api.post("auth/login/", {
        email: email,
        password: pass,
      });

      const userResponse = await api.get("user/me/");

      setUser(userResponse.data);
      localStorage.setItem("user", JSON.stringify(userResponse.data));

      return true;
    } catch (error) {
      console.error("Login error", error.response?.data || error.message);
      return false;
    }
  };

  const register = async (
    name,
    email,
    password,
    adminCode = "",
    confirmPassword = "",
  ) => {
    try {
      const role = adminCode === "ADMIN_SECRET_123" ? "admin" : "customer";
      const newUser = {
        name,
        email,
        password,
        role,
        confirm_password: confirmPassword,
      };

      // Call the real backend register API
      const response = await api.post("auth/register/", newUser);

      return { success: true, status: response.status };
    } catch (error) {
      console.error(
        "Registration error",
        error.response?.data || error.message,
      );
      return { success: false, status: error.response?.status };
    }
  };

  const logout = async (resetCart) => {
    try {
      await api.post("auth/logout/");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error", error.response?.data || error.message);
    } finally {
      setUser(null);
      resetCart?.();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_staff,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
