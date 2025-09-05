import type { RoleOption } from '../types/user';

export interface Permission {
    roles: RoleOption[];
}

export const PERMISSIONS = {
    // User Management
    USER_MANAGEMENT: {
        LIST: { roles: ['admin', 'superadmin'] as RoleOption[] },
        ADD: { roles: ['admin', 'superadmin'] as RoleOption[] },
        EDIT: { roles: ['admin', 'superadmin'] as RoleOption[] },
        DELETE: { roles: ['admin', 'superadmin'] as RoleOption[] },
        ADD_ADMIN: { roles: ['superadmin'] as RoleOption[] }, // Only superadmin can add admins
    },

    // Ticket Management
    TICKET_MANAGEMENT: {
        CREATE: { roles: ['user'] as RoleOption[] },
        EDIT_OWN: { roles: ['user'] as RoleOption[] },
        DELETE_OWN: { roles: ['user'] as RoleOption[] },
        VIEW_OWN: { roles: ['user'] as RoleOption[] },
        VIEW_ASSIGNED: { roles: ['agent'] as RoleOption[] },
        VIEW_ALL: { roles: ['admin', 'superadmin'] as RoleOption[] },
        ASSIGN: { roles: ['admin', 'agent'] as RoleOption[] },
        REASSIGN: { roles: ['admin', 'agent'] as RoleOption[] },
        UPDATE_STATUS: { roles: ['user', 'agent'] as RoleOption[] },
        UPDATE_PRIORITY: { roles: ['agent', 'admin'] as RoleOption[] },
    },

    // Reporting & Analytics
    REPORTING: {
        TICKET_SUMMARY: { roles: ['admin', 'superadmin'] as RoleOption[] },
    },

    // Settings & Preferences
    SETTINGS: {
        PERSONAL_PREFERENCES: { roles: ['user', 'agent'] as RoleOption[] },
        SYSTEM_SETTINGS: { roles: ['admin', 'superadmin'] as RoleOption[] },
    },

    // Access Control
    ACCESS_CONTROL: {
        ROLE_MANAGEMENT: { roles: ['superadmin', 'admin'] as RoleOption[] },
    },

    // Knowledge Base
    KNOWLEDGE_BASE: {
        CREATE_ARTICLE: { roles: ['agent', 'admin'] as RoleOption[] },
        EDIT_ARTICLE: { roles: ['agent', 'admin'] as RoleOption[] },
        DELETE_ARTICLE: { roles: ['admin'] as RoleOption[] }, // Only admin to avoid random removals
        VIEW_ARTICLES: { roles: ['user', 'agent', 'admin', 'superadmin'] as RoleOption[] },
    },

    // Customer Feedback
    FEEDBACK: {
        SUBMIT: { roles: ['user'] as RoleOption[] },
        VIEW: { roles: ['agent', 'admin', 'superadmin'] as RoleOption[] },
    },
} as const;

/**
 * Check if a user role has permission for a specific action
 */
export const hasPermission = (userRole: RoleOption | null, permission: Permission): boolean => {
    if (!userRole) return false;
    return permission.roles.includes(userRole);
};

/**
 * Get user-friendly role display name
 */
export const getRoleDisplayName = (role: RoleOption): string => {
    const roleLabels: Record<RoleOption, string> = {
        'user': 'Standard User',
        'admin': 'Administrator',
        'agent': 'Support Agent',
        'staff': 'Staff Member',
        'superadmin': 'Super Administrator'
    };
    return roleLabels[role] || 'Unknown Role';
};

/**
 * Check if user can manage other users
 */
export const canManageUsers = (userRole: RoleOption | null): boolean => {
    return hasPermission(userRole, PERMISSIONS.USER_MANAGEMENT.LIST);
};

/**
 * Check if user can view all tickets
 */
export const canViewAllTickets = (userRole: RoleOption | null): boolean => {
    return hasPermission(userRole, PERMISSIONS.TICKET_MANAGEMENT.VIEW_ALL);
};

/**
 * Check if user can manage knowledge base articles
 */
export const canManageArticles = (userRole: RoleOption | null): boolean => {
    return hasPermission(userRole, PERMISSIONS.KNOWLEDGE_BASE.CREATE_ARTICLE);
};

/**
 * Check if user can delete articles
 */
export const canDeleteArticles = (userRole: RoleOption | null): boolean => {
    return hasPermission(userRole, PERMISSIONS.KNOWLEDGE_BASE.DELETE_ARTICLE);
};

/**
 * Check if user can view system reports
 */
export const canViewReports = (userRole: RoleOption | null): boolean => {
    return hasPermission(userRole, PERMISSIONS.REPORTING.TICKET_SUMMARY);
};
