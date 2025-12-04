// Role-Based Access Control (RBAC) utility

export type UserRole = "admin" | "user" | "dev" | "srdev" | "bdm";

export interface RouteAccess {
  [route: string]: UserRole[];
}

// Define which roles can access which routes
export const routeAccess: RouteAccess = {
  // Dashboard - all authenticated users
  "/dashboard": ["admin", "user", "dev", "srdev" ,"bdm"],

  // All Bookings - all users can see all bookings
  "/dashboard/all-bookings": ["admin", "user", "dev", "srdev", "bdm"],

  // New Booking - all users can create
  "/dashboard/new-booking": ["admin", "user", "dev", "srdev" , "bdm"],

  // Payment Link - all users can create
  "/dashboard/payment-link": ["admin", "user" , "dev", "srdev", "bdm"],

  // UPI QR Code - all users can create
  "/dashboard/payment-qr": ["admin", "user", "dev", "srdev", "bdm"],

  // Proforma Invoice - all users can create
  "/dashboard/proforma-invoice": ["admin", "user", "dev", "srdev",  "bdm"],

  // Manage Services - admin only
  "/dashboard/manage-services": ["admin", "dev", "srdev"],

  // Manage Users - admin only
  "/dashboard/manage-users": ["admin", "dev", "srdev"],

  // Trash - admin only
  "/dashboard/trash": ["admin", "dev", "srdev"],

  // Profile - all authenticated users
  "/dashboard/profile": ["admin", "user", "dev", "srdev"],
};

/**
 * Check if a user role has access to a specific route
 */
export const hasRouteAccess = (route: string, userRole: UserRole): boolean => {
  const allowedRoles = routeAccess[route];
  if (!allowedRoles) {
    // Route not defined, allow by default (for backward compatibility)
    return true;
  }
  return allowedRoles.includes(userRole);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const isAuth = localStorage.getItem("isAuthenticated");
  return isAuth === "true";
};

/**
 * Get current user role from localStorage
 */
export const getUserRole = (): UserRole => {
  const role = localStorage.getItem("userRole") as UserRole;
  return role || "user";
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  return {
    isAuthenticated: isAuthenticated(),
    role: getUserRole(),
  };
};
