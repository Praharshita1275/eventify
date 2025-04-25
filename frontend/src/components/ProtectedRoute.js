import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission } from '../config/roles';

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');

  if (!userRole) {
    // If no role is set, redirect to home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasPermission(userRole, requiredRole)) {
    // If user doesn't have required role, redirect to home page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute; 