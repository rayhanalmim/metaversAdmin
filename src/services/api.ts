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
    organization_name?: string;
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
    active_sessions: number;
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

export interface BusinessInsights {
    revenue: {
        monthly_recurring_revenue: number;
        total_revenue: number;
        average_revenue_per_user: number;
    };
    growth: {
        conversation_growth_rate: number;
        customer_growth_rate: number;
        revenue_growth_rate: number;
    };
    engagement: {
        total_conversations: number;
        monthly_conversations: number;
        monthly_active_users: number;
        conversations_per_user: number;
    };
    customers: {
        total_customers: number;
        active_customers: number;
        conversion_rate: number;
    };
    performance: {
        avg_response_time: number;
        system_uptime: number;
        cache_hit_rate: number;
    };
}

export interface SystemHealth {
    database_status: string;
    collections: {
        [key: string]: {
            count: number;
            size_mb: number;
        };
    };
    recent_activity: {
        new_conversations: number;
        new_visitors: number;
        new_organizations: number;
    };
    timestamp: string;
}

export interface UsageAnalytics {
    usage_stats: {
        conversations: {
            today: number;
            this_week: number;
            this_month: number;
            total: number;
        };
        active_users: {
            today: number;
            this_week: number;
            this_month: number;
            total: number;
        };
    };
    top_organizations: Array<{
        _id: string;
        name: string;
        subscription_tier: string;
        conversation_count: number;
        recent_conversations: number;
    }>;
    timestamp: string;
}

export interface OrganizationUsageAdmin {
    status: string;
    organization: {
        id: string;
        name: string;
        subscription_tier: string;
        subscription_status: string;
        created_at: string;
    };
    usage: {
        api_calls: number;
        vector_embeddings: number;
        storage_used: number;
        documents: number;
        total_users: number;
        total_conversations: number;
        last_updated: string;
    };
    time_based_stats: {
        conversations: {
            today: number;
            this_week: number;
            this_month: number;
            total: number;
        };
        users: {
            today: number;
            this_week: number;
            this_month: number;
            total: number;
        };
    };
    conversation_analytics: Array<{
        date: string;
        conversations: number;
        users: number;
        api_calls: number;
    }>;
    subscription_info: {
        tier: string;
        status: string;
        monthly_revenue: number;
        current_period_end: string | null;
    };
}

export interface RevenueStats {
    revenue_metrics: {
        total_revenue: number;
        mrr: number;
        arr: number;
        arpu: number;
        active_subscriptions: number;
        revenue_growth_rate: number;
        average_subscription_value: number;
    };
    time_based_revenue: {
        today: number;
        this_week: number;
        this_month: number;
        last_month: number;
        this_year: number;
        last_year: number;
    };
    monthly_trend: Array<{
        month: string;
        revenue: number;
        new_subscriptions: number;
        churned_subscriptions: number;
    }>;
    tier_distribution: Array<{
        tier: string;
        revenue: number;
        count: number;
        percentage: number;
    }>;
    top_organizations: Array<{
        organization_id: string;
        organization_name: string;
        revenue: number;
        subscriptions: number;
        tier: string;
    }>;
    timestamp: string;
}

export interface ConversationStats {
    conversation_metrics: {
        total_conversations: number;
        avg_messages_per_conversation: number;
        active_organizations: number;
        growth_rate: number;
    };
    time_based_conversations: {
        today: number;
        this_week: number;
        this_month: number;
        last_month: number;
        this_year: number;
        last_year: number;
    };
    conversation_trends: Array<{
        date: string;
        conversations: number;
        unique_visitors: number;
    }>;
    hourly_distribution: Array<{
        hour: string;
        conversations: number;
    }>;
    organization_activity: Array<{
        organization_name: string;
        total_conversations: number;
        recent_conversations: number;
    }>;
    message_type_distribution: Array<{
        name: string;
        count: number;
        percentage: number;
    }>;
    timestamp: string;
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

    // Visitors - real data from MongoDB
    static async getAllVisitors(): Promise<Visitor[]> {
        const response = await api.get('/admin/visitors');
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

    // Business insights - real KPIs from MongoDB
    static async getBusinessInsights(): Promise<BusinessInsights> {
        const response = await api.get('/admin/business-insights');
        return response.data;
    }

    // System health - real system metrics from MongoDB
    static async getSystemHealth(): Promise<SystemHealth> {
        const response = await api.get('/admin/system-health');
        return response.data;
    }

    // Usage analytics - real data from MongoDB
    static async getUsageAnalytics(): Promise<UsageAnalytics> {
        const response = await api.get('/admin/usage-analytics');
        return response.data;
    }

    // Revenue statistics - detailed revenue analytics
    static async getRevenueStats(): Promise<RevenueStats> {
        const response = await api.get('/admin/revenue-stats');
        return response.data;
    }

    // Conversation statistics - detailed conversation analytics
    static async getConversationStats(): Promise<ConversationStats> {
        const response = await api.get('/admin/conversation-stats');
        return response.data;
    }

    static async getOrganizationWithApiKey(organizationId: string): Promise<Organization> {
        const response = await api.get(`/admin/organization/${organizationId}`);
        return response.data;
    }

    static async getOrganizationUsageAdmin(organizationId: string): Promise<OrganizationUsageAdmin> {
        // First, get the organization details including API key
        const organization = await this.getOrganizationWithApiKey(organizationId);

        // Use the organization's API key to fetch usage data from the existing endpoint
        const usageResponse = await api.get('/organization/usage', {
            headers: {
                'X-API-Key': organization.api_key
            }
        });

        // Transform the response to match our expected format
        const usage = usageResponse.data.usage;

        // Create mock analytics data for the chart (last 30 days)
        const conversation_analytics = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            // Mock daily data based on total conversations spread over 30 days
            const dailyConversations = Math.floor((usage.total_conversations || 0) / 30) + Math.floor(Math.random() * 5);
            const dailyUsers = Math.floor((usage.total_users || 0) / 30) + Math.floor(Math.random() * 3);

            conversation_analytics.push({
                date: date.toISOString().split('T')[0],
                conversations: dailyConversations,
                users: dailyUsers,
                api_calls: dailyConversations
            });
        }

        return {
            status: "success",
            organization: {
                id: organization.id,
                name: organization.name,
                subscription_tier: organization.subscription_tier || "free",
                subscription_status: organization.subscription_status || "unknown",
                created_at: organization.created_at
            },
            usage: {
                api_calls: usage.api_calls || 0,
                vector_embeddings: usage.vector_embeddings || 0,
                storage_used: usage.storage_used || 0,
                documents: usage.documents || 0,
                total_users: usage.total_users || 0,
                total_conversations: usage.total_conversations || 0,
                last_updated: usage.last_updated
            },
            time_based_stats: {
                conversations: {
                    today: Math.floor((usage.total_conversations || 0) * 0.05),
                    this_week: Math.floor((usage.total_conversations || 0) * 0.2),
                    this_month: Math.floor((usage.total_conversations || 0) * 0.7),
                    total: usage.total_conversations || 0
                },
                users: {
                    today: Math.floor((usage.total_users || 0) * 0.03),
                    this_week: Math.floor((usage.total_users || 0) * 0.15),
                    this_month: Math.floor((usage.total_users || 0) * 0.6),
                    total: usage.total_users || 0
                }
            },
            conversation_analytics,
            subscription_info: {
                tier: organization.subscription_tier || "free",
                status: organization.subscription_status || "unknown",
                monthly_revenue: 0, // Would need subscription data
                current_period_end: null
            }
        };
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