import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // Поки завантажується — спінер
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-400 border-t-transparent"></div>
      </div>
    );
  }

  // Не авторизований — на логін
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Потрібен адмін, але юзер не адмін
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
