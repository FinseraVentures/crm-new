import { Navigate } from "react-router-dom";
import { hasRouteAccess, getCurrentUser, UserRole } from "@/lib/rbac";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  routePath: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  routePath,
}) => {
  const { isAuthenticated, role } = getCurrentUser();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has access to this route
  if (!hasRouteAccess(routePath, role)) {
    // User doesn't have access - redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User has access - render the component
  return <>{children}</>;
};
