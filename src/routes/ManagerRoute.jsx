import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ManagerRoute = ({ children }) => {
  const { user, dbUser, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (dbUser?.role !== "clubManager" && dbUser?.role !== "admin")
    return <Navigate to="/dashboard/member" replace />;
  return children;
};

export default ManagerRoute;
