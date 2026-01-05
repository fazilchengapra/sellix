import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import api from "../api/axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const login = async (email) => {
    try {
      const response = await api.get(`/users?email=${email}`);
      if (response.data.length > 0) {
        const loggedInUser = response.data[0];
        setUser(loggedInUser);
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const register = async (name, email) => {
    try {
      const checkUser = await api.get(`/users?email=${email}`);
      if (checkUser.data.length > 0) {
        return false; // User already exists
      }

      const newUser = { name, email }; 

      const response = await api.post("/users", newUser);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      return true;
    } catch (error) {
      console.error("Registration error", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
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
