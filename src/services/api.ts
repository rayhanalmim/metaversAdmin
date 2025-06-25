import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds should be sufficient for the optimized server
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add admin token
api.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response?.status === 401) {
            // Clear invalid token
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
        throw error;
    }
);

// Type definitions
export interface Organization {
    _id: string;
    id: string;
    name: string;
    api_key: string;
    user_id: string;
    subscription_tier: string;
    subscription_status: string;
    stripe_subscription_id?: string;
    created_at: string;
    updated_at: string;
    pinecone_namespace: string;
    total_users?: number;
    total_conversations?: number;
    subscription_info?: Subscription;
    chat_widget_settings: {
        name: string;
        selectedColor: string;
        leadCapture: boolean;
        botBehavior: string;
        avatarUrl?: string;
        is_bot_connected: boolean;
        ai_behavior: string;
    };
}

export interface Visitor {
    _id: string;
    id: string;
    organization_id: string;
    session_id: string;
    name?: string;
    email?: string;
    phone?: string;
    created_at: string;
    last_active: string;
    metadata: Record<string, unknown>;
    is_agent_mode: boolean;
    agent_takeover_at?: string;
    agent_id?: string;
}

export interface Conversation {
    _id: string;
    id: string;
    organization_id: string;
    visitor_id: string;
    session_id: string;
    role: string;
    content: string;
    created_at: string;
    metadata?: Record<string, unknown>;
    organization_name?: string;
}

export interface Subscription {
    _id: string;
    id: string;
    user_id: string;
    organization_id: string;
    stripe_subscription_id: string;
    payment_amount: number;
    subscription_tier: string;
    subscription_status: string;
    current_period_start: string;
    current_period_end: string;
    created_at: string;
    updated_at: string;
    organization_name?: string;
}

export interface AnalyticsData {
    name: string;
    conversations: number;
    lastYearConversations: number;
    visitors: number;
    lastYearVisitors: number;
    revenue: number;
    lastYearRevenue: number;
}

export interface DashboardStats {
    total_organizations: number;
    total_users: number;
    total_conversations: number;
    total_revenue: number;
    active_conversations: number;
    vector_embeddings: number;
    api_calls: number;
    last_updated: string;
}

export interface RealtimeStats {
    active_conversations: number;
    api_calls: number;
    timestamp: string;
}

export interface SubscriptionDistribution {
    name: string;
    value: number;
    color: string;
}

export interface OrganizationUsage {
    api_calls: number;
    vector_embeddings: number;
    storage_used: number;
    documents: number;
    total_users: number;
    total_conversations: number;
    last_updated: string;
}

export interface TrafficSource {
    name: string;
    percentage: number;
}

export interface Notification {
    id: number;
    icon: string;
    title: string;
    time: string;
}

export interface ActiveUser {
    id: number;
    name: string;
    avatar: string;
    status: string;
    initials: string;
}

export interface SubscriptionDetails {
    id: string;
    status: string;
    current_period_end: number;
    cancel_at_period_end: boolean;
    plan: {
        id: string;
        amount: number;
        currency: string;
        interval: string;
    };
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    is_admin: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user: AdminUser;
}

// Admin API functions
export class AdminAPI {
    // Authentication methods
    static async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await api.post('/auth/admin/login', credentials);
        return response.data;
    }

    static async googleAuth(): Promise<LoginResponse> {
        // For Google OAuth, we'd typically redirect to Google's OAuth URL
        // For now, we'll simulate this - in a real app you'd use Google's OAuth flow
        const response = await api.post('/auth/admin/google', {
            // This would contain Google OAuth data
        });
        return response.data;
    }

    static async verifyToken(token: string): Promise<boolean> {
        try {
            const response = await api.get('/admin/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.status === 200;
        } catch {
            return false;
        }
    }

    static setToken(token: string): void {
        localStorage.setItem('adminToken', token);
    }

    static clearToken(): void {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    }

    // Dashboard statistics - real data from MongoDB
    static async getDashboardStats(): Promise<DashboardStats> {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    }

    // Real-time stats from MongoDB
    static async getRealtimeStats(): Promise<RealtimeStats> {
        const response = await api.get('/admin/realtime-stats');
        return response.data;
    }

    // Organizations - real data from MongoDB
    static async getAllOrganizations(): Promise<Organization[]> {
        const response = await api.get('/admin/organizations');
        return response.data;
    }

    // Conversations - real data from MongoDB
    static async getAllConversations(): Promise<Conversation[]> {
        const response = await api.get('/admin/conversations');
        return response.data;
    }

    // Subscriptions - real data from MongoDB
    static async getAllSubscriptions(): Promise<Subscription[]> {
        const response = await api.get('/admin/subscriptions');
        return response.data;
    }

    // Analytics - real monthly data from MongoDB
    static async getAnalytics(): Promise<AnalyticsData[]> {
        const response = await api.get('/admin/analytics');
        return response.data;
    }

    // Subscription distribution - real data from MongoDB
    static async getSubscriptionDistribution(): Promise<SubscriptionDistribution[]> {
        const response = await api.get('/admin/subscription-distribution');
        return response.data;
    }

    // Mock data endpoints for features not yet implemented in backend
    static async getTrafficSources(): Promise<TrafficSource[]> {
        // Mock data - implement this endpoint in backend if needed
        return [
            { name: 'Direct', percentage: 45 },
            { name: 'Social Media', percentage: 25 },
            { name: 'Search Engines', percentage: 20 },
            { name: 'Referrals', percentage: 10 }
        ];
    }

    static async getNotifications(): Promise<Notification[]> {
        // Mock data - implement this endpoint in backend if needed
        return [
            { id: 1, icon: '👤', title: 'New user signed up', time: '2 minutes ago' },
            { id: 2, icon: '💰', title: 'Payment received', time: '1 hour ago' },
            { id: 3, icon: '📧', title: 'Support ticket created', time: '3 hours ago' },
            { id: 4, icon: '🚀', title: 'New organization created', time: '1 day ago' }
        ];
    }

    static async getActiveUsers(): Promise<ActiveUser[]> {
        // Mock data - implement this endpoint in backend if needed
        return [
            { id: 1, name: 'John Doe', avatar: '', status: 'online', initials: 'JD' },
            { id: 2, name: 'Jane Smith', avatar: '', status: 'away', initials: 'JS' },
            { id: 3, name: 'Bob Johnson', avatar: '', status: 'online', initials: 'BJ' },
            { id: 4, name: 'Alice Brown', avatar: '', status: 'offline', initials: 'AB' }
        ];
    }

    // Individual organization/user methods
    static async getOrganization(): Promise<Organization> {
        const response = await api.get('/organization/me');
        return response.data;
    }

    static async getOrganizationUsage(): Promise<OrganizationUsage> {
        const response = await api.get('/organization/usage');
        return response.data.usage;
    }

    static async getConversations(): Promise<Conversation[]> {
        const response = await api.get('/api/conversations');
        return response.data;
    }

    static async getConversation(conversationId: string): Promise<Conversation> {
        const response = await api.get(`/api/conversations/${conversationId}`);
        return response.data;
    }

    static async getConversationsBySession(sessionId: string): Promise<Conversation[]> {
        const response = await api.get(`/api/conversations/session/${sessionId}`);
        return response.data;
    }

    static async getUserSubscription(userId: string): Promise<Subscription> {
        const response = await api.get(`/payment/user-subscription/${userId}`);
        return response.data;
    }

    static async getSubscription(subscriptionId: string): Promise<SubscriptionDetails> {
        const response = await api.get(`/payment/subscription/${subscriptionId}`);
        return response.data;
    }
}

export default AdminAPI; 