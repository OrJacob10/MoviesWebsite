import { Navigate, Outlet } from "react-router-dom";
import { usePermissions } from "../components/PermissionGuard";

const ProtectedRoute = ({ requiredPermission, children}) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  const { hasPermission } = usePermissions();

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/main" replace />;
  }

  return children;
};

export default ProtectedRoute;
