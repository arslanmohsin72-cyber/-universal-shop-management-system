import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block shadow-sm p-4 rounded-3">
          <i className="bi bi-shield-lock-fill fs-1 text-danger mb-2 d-block"></i>
          <h4>Access Denied</h4>
          <p className="text-muted m-0">You do not have permission to view this page ({user.role}).</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
