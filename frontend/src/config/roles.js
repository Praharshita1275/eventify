// User Roles
export const ROLES = {
  ADMIN: 'admin',
  FACULTY: 'faculty',
  STUDENT: 'student',
  VISITOR: 'visitor',
  AEC: 'AEC'
};

// Define authorized roles that can access protected routes
export const AUTHORIZED_ROLES = [ROLES.ADMIN, ROLES.FACULTY, ROLES.AEC];

// Role-based permissions
export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'create_event',
    'edit_event',
    'delete_event',
    'approve_event',
    'create_resource',
    'edit_resource',
    'delete_resource',
    'manage_circular',
    'view_analytics'
  ],
  [ROLES.FACULTY]: [
    'create_event',
    'edit_own_event',
    'delete_own_event',
    'approve_event',
    'create_resource',
    'edit_own_resource',
    'delete_own_resource',
    'view_circular'
  ],
  [ROLES.STUDENT]: [
    'view_events',
    'view_resources',
    'view_circular'
  ],
  [ROLES.VISITOR]: [
    'view_events',
    'view_resources'
  ],
  [ROLES.AEC]: [
    'create_event',
    'edit_event',
    'delete_event',
    'approve_event',
    'create_resource',
    'edit_resource',
    'delete_resource',
    'manage_circular',
    'view_analytics'
  ]
};

// Predefined user credentials for testing
export const PREDEFINED_CREDENTIALS = {
  'admin@cbit.ac.in': {
    password: 'admin123',
    role: ROLES.ADMIN
  },
  'faculty@cbit.ac.in': {
    password: 'faculty123',
    role: ROLES.FACULTY
  },
  'student@cbit.ac.in': {
    password: 'student123',
    role: ROLES.STUDENT
  },
  'aec@cbit.ac.in': {
    password: 'aec123456',
    role: ROLES.AEC
  }
};

// Helper function to check if a user has a specific permission
export const hasPermission = (userRole, permission) => {
  if (!userRole || !PERMISSIONS[userRole]) return false;
  return PERMISSIONS[userRole].includes(permission);
}; 