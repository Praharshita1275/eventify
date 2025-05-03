import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext();

export const usePermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }) => {
  const { user } = useAuth();

  const checkPermission = (permission) => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        return true;
      case 'faculty':
        return ['create_event', 'edit_own_event', 'delete_own_event'].includes(permission);
      case 'student':
        return ['view_event'].includes(permission);
      default:
        return false;
    }
  };

  const canCreateEvent = () => {
    return checkPermission('create_event');
  };

  const canEditEvent = () => {
    return checkPermission('edit_event');
  };

  const canDeleteEvent = () => {
    return checkPermission('delete_event');
  };

  const value = {
    checkPermission,
    canCreateEvent,
    canEditEvent,
    canDeleteEvent
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export default PermissionsContext; 