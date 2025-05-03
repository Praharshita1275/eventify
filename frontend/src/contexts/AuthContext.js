import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for auth events from the API service
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('Session expired event received');
      setAuthError('Your session has expired. Please log in again.');
      logout();
    };
    
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Parse stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Verify token is still valid with the server
          try {
            await api.get('/auth/me');
            // Token is valid, do nothing
          } catch (error) {
            // Only logout if it's truly an auth error
            if (error.response && error.response.status === 401) {
              console.error('Invalid token, clearing auth state');
              logout();
            } else {
              // For other errors (network, server down), keep the user logged in
              console.warn('Could not verify token, but keeping user logged in:', error);
            }
          }
        } catch (error) {
          // Invalid stored user data
          console.error('Error restoring auth state:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userId', userData.id || userData._id);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    authError,
    setAuthError,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 