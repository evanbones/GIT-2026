import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

function PrivateRoute({ children, allowedRoles = null, redirectTo = '/login' }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (allowedRoles && !allowedRoles.includes(user.user_type)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
