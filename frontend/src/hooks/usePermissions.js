import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../config/roles';
import { ROLES } from '../config/roles';

export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (permission) => {
    const role = user?.role || localStorage.getItem('userRole');
    console.log('Checking permission:', {
      permission,
      role,
      hasPermission: hasPermission(role, permission)
    });
    return hasPermission(role, permission);
  };
  
  // Check if user is an admin
  const isAdmin = () => {
    const role = user?.role || localStorage.getItem('userRole');
    return role === ROLES.ADMIN;
  };

  return {
    canCreateEvent: () => checkPermission('create_event'),
    canEditEvent: () => checkPermission('edit_event'),
    canDeleteEvent: () => checkPermission('delete_event'),
    canApproveEvent: () => checkPermission('approve_event'),
    canCreateResource: () => checkPermission('create_resource'),
    canEditResource: () => checkPermission('edit_resource'),
    canDeleteResource: () => checkPermission('delete_resource'),
    canManageCircular: () => checkPermission('manage_circular'),
    canViewAnalytics: () => checkPermission('view_analytics'),
    canViewCircular: () => checkPermission('view_circular'),
    // Helper method to check any custom permission
    checkPermission,
    // Check if user is an admin
    isAdmin
  };
}; 