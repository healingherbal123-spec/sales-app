// types/roles.ts
export type UserRole = 'boss' | 'admin' | 'manager' | 'sales_rep' | 'viewer';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    companyId: string;
    permissions: string[];
    salesTarget?: number;
    salesAchieved?: number;
    joinedAt: string;
}

export interface Permission {
    resource: string;
    actions: ('view' | 'create' | 'edit' | 'delete')[];
}

// Role-based permissions with company customization
export const ROLE_PERMISSIONS = {
    boss: {
        view: ['all'],
        create: ['all'],
        edit: ['all'],
        delete: ['all'],
        manage_users: true,
        manage_roles: true,
        view_financials: true,
        export_data: true,
        view_all_sales: true,
        manage_company: true,
    },
    admin: {
        view: ['all'],
        create: ['all'],
        edit: ['all'],
        delete: ['all'],
        manage_users: true,
        manage_roles: false,
        view_financials: true,
        export_data: true,
        view_all_sales: true,
        manage_company: false,
    },
    manager: {
        view: ['all'],
        create: ['sales', 'orders', 'customers'],
        edit: ['sales', 'orders', 'customers'],
        delete: ['sales'],
        manage_users: false,
        manage_roles: false,
        view_financials: true,
        export_data: true,
        view_all_sales: true,
        manage_company: false,
        can_approve: true,
        view_team_performance: true,
    },
    sales_rep: {
        view: ['own_sales', 'customers', 'products'],
        create: ['sales', 'customers'],
        edit: ['own_sales'],
        delete: [],
        manage_users: false,
        manage_roles: false,
        view_financials: false,
        export_data: false,
        view_all_sales: false,
        manage_company: false,
        can_approve: false,
        view_team_performance: false,
        upload_payment_evidence: true,
        view_own_target: true,
    },
    viewer: {
        view: ['orders'],
        create: [],
        edit: [],
        delete: [],
        manage_users: false,
        manage_roles: false,
        view_financials: false,
        export_data: false,
        view_all_sales: false,
        manage_company: false,
    }
} as const;

export type RolePermissions = typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS];

// Helper to check permissions
export function hasPermission(
    role: UserRole,
    action: 'view' | 'create' | 'edit' | 'delete',
    resource: string
): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    if (!permissions) return false;
    
    if (permissions.view.includes('all')) return true;
    return permissions[action]?.includes(resource) || false;
}