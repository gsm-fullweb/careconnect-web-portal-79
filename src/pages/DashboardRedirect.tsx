
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

const DashboardRedirect = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-careconnect-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecionando para sua dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect based on user role
  switch (role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'cuidador':
      return <Navigate to="/painel-cuidador" replace />;
    case 'cliente':
      return <Navigate to="/cliente-dashboard" replace />;
    default:
      return <Navigate to="/admin/login" replace />;
  }
};

export default DashboardRedirect;
