import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

export const usePermissions = () => {
  const token = useSelector(state => state.auth.token);
  
  if (!token) return { hasPermission: () => false, isAdmin: false };
  
  try {
    const decoded = jwtDecode(token);
    return {
      hasPermission: (permission) => 
        decoded.isAdmin || decoded.permissions?.includes(permission),
      isAdmin: decoded.isAdmin,
      permissions: decoded.permissions || []
    };
  } catch {
    return { hasPermission: () => false, isAdmin: false };
  }
};

export const PermissionGuard = ({ requiredPermission, children }) => {
  const { hasPermission } = usePermissions();
  return hasPermission(requiredPermission) ? children : null;
} 