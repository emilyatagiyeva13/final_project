import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuthStore();

  // Hələ əsas yüklənmə gedirsə VƏ YA istifadəçi daxil olub amma hələ profil məlumatı bazadan çəkilməyibsə
  if (loading || (user && requiredRole && !profile)) {
    return <div>Yüklənir...</div>;
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