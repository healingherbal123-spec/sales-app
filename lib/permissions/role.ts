import { UserRole } from '@/types';

// ============================================
// ROLE CONFIGURATION
// ============================================
export const ROLES = {
  owner: {
    id: 'owner',
    label: 'Company Owner',
    icon: '👑',
    description: 'Full access to everything',
    dashboard: '/dashboard/owner',
    permissions: ['*'],
    priority: 1,
  },
  admin: {
    id: 'admin',
    label: 'Company Admin',
    icon: '🏢',
    description: 'Manage company and staff',
    dashboard: '/dashboard/admin',
    permissions: [
      'manage_staff',
      'manage_company',
      'view_all_sales',
      'view_all_orders',
      'view_all_inventory',
      'view_all_deliveries',
      'view_all_payments',
      'view_reports',
    ],
    priority: 2,
  },
  manager: {
    id: 'manager',
    label: 'Manager',
    icon: '👔',
    description: 'Oversee operations and team',
    dashboard: '/dashboard/manager',
    permissions: [
      'view_all_sales',
      'view_all_orders',
      'view_all_inventory',
      'view_all_deliveries',
      'view_all_payments',
      'view_staff',
      'approve_orders',
      'view_reports',
    ],
    priority: 3,
  },
  sales: {
    id: 'sales',
    label: 'Sales Staff',
    icon: '💰',
    description: 'Manage customers and sales',
    dashboard: '/dashboard/sales',
    permissions: [
      'view_own_sales',
      'create_orders',
      'view_customers',
      'create_customers',
      'edit_customers',
      'view_inventory',
      'create_payments',
    ],
    priority: 4,
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory Staff',
    icon: '📦',
    description: 'Manage stock and inventory',
    dashboard: '/dashboard/inventory',
    permissions: [
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'view_orders',
      'view_deliveries',
    ],
    priority: 4,
  },
  dispatcher: {
    id: 'dispatcher',
    label: 'Dispatcher',
    icon: '📋',
    description: 'Manage deliveries and drivers',
    dashboard: '/dashboard/dispatcher',
    permissions: [
      'view_deliveries',
      'create_deliveries',
      'edit_deliveries',
      'view_orders',
      'view_drivers',
    ],
    priority: 4,
  },
  delivery_agent: {
    id: 'delivery_agent',
    label: 'Delivery Agent',
    icon: '🚚',
    description: 'Execute deliveries',
    dashboard: '/dashboard/delivery',
    permissions: [
      'view_own_deliveries',
      'update_delivery_status',
      'view_orders',
    ],
    priority: 5,
  },
  accountant: {
    id: 'accountant',
    label: 'Accountant',
    icon: '💳',
    description: 'Manage finances and payments',
    dashboard: '/dashboard/accountant',
    permissions: [
      'view_payments',
      'verify_payments',
      'create_payments',
      'view_reports',
      'view_orders',
      'view_customers',
    ],
    priority: 4,
  },
  hr: {
    id: 'hr',
    label: 'HR Staff',
    icon: '👥',
    description: 'Manage staff and attendance',
    dashboard: '/dashboard/hr',
    permissions: [
      'view_staff',
      'edit_staff',
      'create_staff',
      'view_attendance',
      'manage_leave_requests',
    ],
    priority: 4,
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getRoleConfig(role: UserRole) {
  return ROLES[role];
}

export function getUserDashboard(role: UserRole): string {
  return ROLES[role]?.dashboard || '/dashboard/sales';
}

export function getRoleLabel(role: UserRole): string {
  return ROLES[role]?.label || 'User';
}

export function getRoleIcon(role: UserRole): string {
  return ROLES[role]?.icon || '👤';
}

export function getRolePriority(role: UserRole): number {
  return ROLES[role]?.priority || 99;
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;
  
  // Owner has all permissions
  if (roleConfig.permissions.includes('*')) return true;
  
  return roleConfig.permissions.includes(permission);
}

export function getRolePermissions(role: UserRole): string[] {
  const roleConfig = ROLES[role];
  if (!roleConfig) return [];
  
  if (roleConfig.permissions.includes('*')) {
    // Return all possible permissions for owner
    return [
      'manage_staff',
      'manage_company',
      'view_all_sales',
      'view_all_orders',
      'view_all_inventory',
      'view_all_deliveries',
      'view_all_payments',
      'view_reports',
      'view_own_sales',
      'create_orders',
      'view_customers',
      'create_customers',
      'edit_customers',
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'create_payments',
      'view_payments',
      'verify_payments',
      'view_deliveries',
      'create_deliveries',
      'edit_deliveries',
      'view_staff',
      'edit_staff',
      'create_staff',
      'view_attendance',
      'manage_leave_requests',
      'approve_orders',
      'view_drivers',
      'view_own_deliveries',
      'update_delivery_status',
    ];
  }
  
  return roleConfig.permissions;
}

export function getAllRoles(): UserRole[] {
  return Object.keys(ROLES) as UserRole[];
}

export function getRolesByPriority(): UserRole[] {
  return getAllRoles().sort((a, b) => getRolePriority(a) - getRolePriority(b));
}

export function getStaffRoles(): UserRole[] {
  return ['sales', 'inventory', 'dispatcher', 'delivery_agent', 'accountant', 'hr'];
}

export function getManagementRoles(): UserRole[] {
  return ['owner', 'admin', 'manager'];
}