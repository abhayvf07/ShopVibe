import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — guards routes that require authentication
 * Redirects to /login if user is not authenticated
 * Optionally checks for admin role
 * 
 * @param {ReactNode} children - The protected page content
 * @param {boolean} adminOnly - If true, requires admin role
 */
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
