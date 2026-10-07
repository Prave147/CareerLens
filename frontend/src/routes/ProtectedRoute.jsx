import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRole, redirectUnauthTo }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-content-secondary">Verifying authentication session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectUnauthTo || '/student/login'} state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // If student attempts to view placement or vice versa, redirect to their home dashboard
    return <Navigate to={user.role === 'STUDENT' ? '/dashboard' : '/placement'} replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'STUDENT' ? '/dashboard' : '/placement'} replace />;
  }

  return children;
};
