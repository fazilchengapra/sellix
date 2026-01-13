import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/Spinner";

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const PublicRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner size={40} />
        </div>
      );
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
  
    return <Outlet />;
};

export const ShopRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} />
      </div>
    );
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
