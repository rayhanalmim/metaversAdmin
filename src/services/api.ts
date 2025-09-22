import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session-based auth
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
            // Redirect to sign-in on unauthorized
            window.location.href = '/sign-in';
        }
        throw error;
    }
);

// Metaverse Dashboard Type Definitions
export interface MetaverseDashboardStats {
    totalUsers: number;
    totalAvatars: number;
    totalItems: number;
    totalNFTs: number;
    activeListings: number;
    activeUsers: number;
    totalWallets: number;
    totalNFTTypes: number;
    totalRevenue: number;
    lastUpdated: string;
}

export interface MetaverseRealtimeStats {
    newUsersToday: number;
    newNFTsToday: number;
    newListingsToday: number;
    salesCompletedToday: number;
    timestamp: string;
}

export interface MetaverseUser {
    id: number;
    username: string;
    email: string;
    wallet_address: string;
    last_room: string;
    avatar_id: number;
    last_login_time: string;
    created_at: string;
    updated_at: string;
    admin_role?: 'user' | 'admin' | 'superadmin';
    property_ids?: number[];
    property_count?: number;
    total_nfts?: number;
    avatar?: {
        id: number;
        name: string;
        gender: string;
        avatar_url: string;
    };
    wallets?: Array<{
        wallet_address: string;
    }>;
}

export interface MetaverseNFT {
    id: number;
    token_address: string;
    token_id: string;
    owner: string;
    metadata: any;
    created_at: number;
    selling?: {
        price: string;
        is_closed: boolean;
        seller: string;
        buyer: string;
    };
}

export interface MarketplaceAnalytics {
    totalListings: number;
    activeListings: number;
    completedSales: number;
    totalVolume: number;
    averagePrice: number;
    topSellers: Array<{
        seller: string;
        salesCount: number;
        totalRevenue: number;
    }>;
}

export interface UserAnalytics {
    registrationTrend: Array<{
        date: string;
        count: number;
    }>;
    avatarDistribution: Array<{
        avatar_id: number;
        count: number;
        avatar?: {
            name: string;
            gender: string;
        };
    }>;
}

export interface Property {
    id: number;
    token_address: string;
    token_id: number;
    chain_id: string;
    token_uri: string;
    metadata: any;
    owner: string;
    is_sync_metadata: boolean;
    created_at: number;
    last_sync: number;
    is_for_rent: boolean;
    rent_price?: string;
    rent_period_days?: number;
    tenant_wallet?: string;
    rent_due_at?: number;
    grace_until?: number;
    rental_status?: 'listed' | 'active' | 'late' | 'evicted' | 'ended';
}

export interface PropertyAssignmentResponse {
    success: boolean;
    message: string;
    data?: {
        user: MetaverseUser;
        assignedProperties: Property[];
    };
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: number;
            username: string;
            email: string;
            isAdmin: boolean;
        };
        session: {
            sessionId: string;
            expiresAt: string;
        };
    };
}

// Admin API functions for Metaverse Dashboard
export class AdminAPI {
    // Token management methods
    static setToken(token: string): void {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    static clearToken(): void {
        delete api.defaults.headers.common['Authorization'];
    }

    // Authentication methods
    static async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post('/api/admin/login', credentials);
        return response.data;
    }

    static async logout(): Promise<void> {
        await api.post('/api/admin/logout');
    }

    static async verifyToken(token: string): Promise<boolean> {
        try {
            const response = await api.get('/api/admin/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data.success;
        } catch {
            return false;
        }
    }

    static async verifySession(): Promise<boolean> {
        try {
            const response = await api.get('/api/admin/verify');
            return response.data.success;
        } catch {
            return false;
        }
    }

    // Dashboard data methods
    static async getDashboardStats(): Promise<MetaverseDashboardStats> {
        const response = await api.get('/api/admin/dashboard/stats');
        return response.data.data;
    }

    static async getRealtimeStats(): Promise<MetaverseRealtimeStats> {
        const response = await api.get('/api/admin/dashboard/realtime');
        return response.data.data;
    }

    static async getAllUsers(): Promise<MetaverseUser[]> {
        const response = await api.get('/api/admin/users');
        return response.data.data;
    }

    static async getAllNFTs(): Promise<MetaverseNFT[]> {
        const response = await api.get('/api/admin/nfts');
        return response.data.data;
    }

    static async getMarketplaceAnalytics(): Promise<MarketplaceAnalytics> {
        const response = await api.get('/api/admin/marketplace/analytics');
        return response.data.data;
    }

    static async getUserAnalytics(): Promise<UserAnalytics> {
        const response = await api.get('/api/admin/users/analytics');
        return response.data.data;
    }

    // User role management methods
    static async getUsersWithRoles(): Promise<MetaverseUser[]> {
        const response = await api.get('/api/admin/users-with-roles');
        return response.data.data;
    }

    static async updateUserRole(userId: number, adminRole: 'user' | 'admin' | 'superadmin'): Promise<MetaverseUser> {
        const response = await api.put(`/api/admin/users/${userId}/role`, { admin_role: adminRole });
        return response.data.data.user;
    }

    // Property management methods
    static async getAllProperties(): Promise<Property[]> {
        const response = await api.get('/api/admin/properties');
        return response.data.data;
    }

    static async getAvailableProperties(): Promise<Property[]> {
        const response = await api.get('/api/admin/properties/available');
        return response.data.data;
    }

    static async getUserProperties(userId: number): Promise<Property[]> {
        const response = await api.get(`/api/admin/users/${userId}/properties`);
        return response.data.data;
    }

    static async assignPropertyToUser(userId: number, propertyId: number): Promise<PropertyAssignmentResponse> {
        const response = await api.post(`/api/admin/users/${userId}/properties`, { property_id: propertyId });
        return response.data;
    }

    static async removePropertyFromUser(userId: number, propertyId: number): Promise<PropertyAssignmentResponse> {
        const response = await api.delete(`/api/admin/users/${userId}/properties/${propertyId}`);
        return response.data;
    }

    static async searchProperties(query: string): Promise<Property[]> {
        const response = await api.get(`/api/admin/properties/search?q=${encodeURIComponent(query)}`);
        return response.data.data;
    }

    // Legacy methods for compatibility (return empty data)
    static async getAllOrganizations(): Promise<any[]> {
        return [];
    }

    static async getAllConversations(): Promise<any[]> {
        return [];
    }

    static async getAllSubscriptions(): Promise<any[]> {
        return [];
    }

    static async getAnalytics(): Promise<any[]> {
        return [];
    }

    static async getSubscriptionDistribution(): Promise<any[]> {
        return [];
    }

    static async getBusinessInsights(): Promise<any> {
        return null;
    }

    static async getSystemHealth(): Promise<any> {
        return null;
    }

    static async getUsageAnalytics(): Promise<any> {
        return null;
    }
}

export default AdminAPI;

// Export types for backward compatibility
export type DashboardStats = MetaverseDashboardStats;
export type RealtimeStats = MetaverseRealtimeStats;
export type Organization = any;
export type Conversation = any;
export type Subscription = any;
export type AnalyticsData = any;
export type SubscriptionDistribution = any;
export type BusinessInsights = any;
export type SystemHealth = any;
export type UsageAnalytics = any;
export type OrganizationUsageAdmin = any;