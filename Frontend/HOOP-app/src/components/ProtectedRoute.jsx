import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has at least one of them
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = roles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      // Redirect to home if they don't have permission
      return <Navigate to="/" replace />;
    }
  }

  // Authorized
  return children;
}
