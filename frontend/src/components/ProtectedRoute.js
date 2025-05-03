import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission } from '../config/roles';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const userRole = user?.role || localStorage.getItem('userRole');

  if (!isAuthenticated || !userRole) {
    // If user is not authenticated, redirect to auth page with a message
    return (
      <Navigate 
        to="/auth" 
        state={{ 
          from: location,
          message: "Please sign in to access this page. Only authorized users can access this feature." 
        }} 
        replace 
      />
    );
  }

  if (requiredRole && !hasPermission(userRole, requiredRole)) {
    // If user doesn't have required role, redirect to home page with an unauthorized message
    return (
      <Navigate 
        to="/home" 
        state={{ 
          from: location,
          unauthorized: true,
          message: "You don't have permission to access this page. Please contact an administrator." 
        }} 
        replace 
      />
    );
  }

  return children;
}

export default ProtectedRoute; 