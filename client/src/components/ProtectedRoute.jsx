import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Never render protected content while auth state is being resolved
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = { admin: '/admin', worker: '/job-requests', customer: '/my-bookings' };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
