import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "./Loader";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuthStore();

  if (loading || (user && requiredRole && !profile)) {
    return <div><Loader/></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;