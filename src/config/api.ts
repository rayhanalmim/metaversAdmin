// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    // Analytics endpoints
    analytics: `${API_BASE_URL}/admin/analytics`,
    dashboardStats: `${API_BASE_URL}/admin/dashboard-stats`,
    realtimeStats: `${API_BASE_URL}/admin/realtime-stats`,

    // Admin management endpoints
    organizations: `${API_BASE_URL}/admin/organizations`,
    conversations: `${API_BASE_URL}/admin/conversations`,
    subscriptions: `${API_BASE_URL}/admin/subscriptions`,
    subscriptionDistribution: `${API_BASE_URL}/admin/subscription-distribution`,

    // Authentication endpoints
    adminVerify: `${API_BASE_URL}/admin/verify`,
    adminLogin: `${API_BASE_URL}/auth/admin/login`,

    // User management endpoints
    usersWithRoles: `${API_BASE_URL}/api/admin/users-with-roles`,
    updateUserRole: `${API_BASE_URL}/api/admin/users`,

    // Legacy endpoints (for backwards compatibility)
    trafficSources: `${API_BASE_URL}/api/traffic-sources`,
    notifications: `${API_BASE_URL}/api/notifications`,
    activeUsers: `${API_BASE_URL}/api/active-users`,
} as const;