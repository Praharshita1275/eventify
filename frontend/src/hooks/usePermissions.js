import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../config/roles';

export const usePermissions = () => {
  const { user } = useAuth();

  const checkPermission = (permission) => {
    return hasPermission(user?.role, permission);
  };

  return {
    canCreateEvent: () => checkPermission('create_event'),
    canEditEvent: () => checkPermission('edit_event'),
    canDeleteEvent: () => checkPermission('delete_event'),
    canCreateResource: () => checkPermission('create_resource'),
    canEditResource: () => checkPermission('edit_resource'),
    canDeleteResource: () => checkPermission('delete_resource'),
    canManageCircular: () => checkPermission('manage_circular'),
    canViewAnalytics: () => checkPermission('view_analytics'),
    canViewCircular: () => checkPermission('view_circular'),
    // Helper method to check any custom permission
    checkPermission
  };
}; 