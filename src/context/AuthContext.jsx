import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, pass) => {
    try {
      const response = await api.post("auth/login/", {
        email: email,
        password: pass,
      });

      const { access, refresh } = response.data;

      // ✅ store tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Fetch user profile using the access token
      const userResponse = await api.get("user/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

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

  const logout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        await api.post("auth/logout/", { refresh });
      }
    } catch (error) {
      console.error("Logout error", error.response?.data || error.message);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
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
