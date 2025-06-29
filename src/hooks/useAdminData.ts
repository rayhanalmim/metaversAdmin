import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import AdminAPI from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// Custom hook for admin dashboard data
export const useAdminData = () => {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    // Dashboard statistics
    const {
        data: dashboardStats,
        isLoading: statsLoading,
        error: statsError
    } = useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: AdminAPI.getDashboardStats,
        enabled: isAuthenticated, // Only run when authenticated
        refetchInterval: 30000, // Refetch every 30 seconds
        staleTime: 10000, // Consider data stale after 10 seconds
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Organizations data
    const {
        data: organizations,
        isLoading: orgsLoading,
        error: orgsError
    } = useQuery({
        queryKey: ['admin-organizations'],
        queryFn: AdminAPI.getAllOrganizations,
        enabled: isAuthenticated,
        refetchInterval: 60000, // Refetch every minute
        staleTime: 30000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Conversations data
    const {
        data: conversations,
        isLoading: convsLoading,
        error: convsError
    } = useQuery({
        queryKey: ['admin-conversations'],
        queryFn: AdminAPI.getAllConversations,
        enabled: isAuthenticated,
        refetchInterval: 30000,
        staleTime: 15000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Visitors data
    const {
        data: visitors,
        isLoading: visitorsLoading,
        error: visitorsError
    } = useQuery({
        queryKey: ['admin-visitors'],
        queryFn: AdminAPI.getAllVisitors,
        enabled: isAuthenticated,
        refetchInterval: 60000, // Refetch every minute
        staleTime: 30000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Subscriptions data
    const {
        data: subscriptions,
        isLoading: subsLoading,
        error: subsError
    } = useQuery({
        queryKey: ['admin-subscriptions'],
        queryFn: AdminAPI.getAllSubscriptions,
        enabled: isAuthenticated,
        refetchInterval: 60000,
        staleTime: 30000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Analytics data
    const {
        data: analytics,
        isLoading: analyticsLoading,
        error: analyticsError
    } = useQuery({
        queryKey: ['admin-analytics'],
        queryFn: AdminAPI.getAnalytics,
        enabled: isAuthenticated,
        refetchInterval: 300000, // Refetch every 5 minutes
        staleTime: 120000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    // Real-time stats (more frequent updates)
    const {
        data: realtimeStats,
        isLoading: realtimeLoading
    } = useQuery({
        queryKey: ['admin-realtime-stats'],
        queryFn: AdminAPI.getRealtimeStats,
        enabled: isAuthenticated,
        refetchInterval: 10000, // Refetch every 10 seconds
        staleTime: 5000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return {
        // Dashboard stats
        dashboardStats,
        statsLoading,
        statsError,

        // Organizations
        organizations: organizations || [],
        orgsLoading,
        orgsError,

        // Conversations
        conversations: conversations || [],
        convsLoading,
        convsError,

        // Visitors
        visitors: visitors || [],
        visitorsLoading,
        visitorsError,

        // Subscriptions
        subscriptions: subscriptions || [],
        subsLoading,
        subsError,

        // Analytics
        analytics: analytics || [],
        analyticsLoading,
        analyticsError,

        // Real-time stats
        realtimeStats,
        realtimeLoading,

        // Refresh functions
        refreshStats: () => queryClient.invalidateQueries({ queryKey: ['admin-dashboard-stats'] }),
        refreshOrganizations: () => queryClient.invalidateQueries({ queryKey: ['admin-organizations'] }),
        refreshConversations: () => queryClient.invalidateQueries({ queryKey: ['admin-conversations'] }),
        refreshVisitors: () => queryClient.invalidateQueries({ queryKey: ['admin-visitors'] }),
        refreshSubscriptions: () => queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] }),
        refreshAnalytics: () => queryClient.invalidateQueries({ queryKey: ['admin-analytics'] })
    };
};

// Hook for subscription distribution data
export const useSubscriptionDistribution = () => {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['subscription-distribution'],
        queryFn: AdminAPI.getSubscriptionDistribution,
        enabled: isAuthenticated,
        refetchInterval: 300000,
        staleTime: 120000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return { data: data || [], isLoading, error };
};

// Hook for traffic sources
export const useTrafficSources = () => {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['traffic-sources'],
        queryFn: AdminAPI.getTrafficSources,
        enabled: isAuthenticated,
        refetchInterval: 300000,
        staleTime: 120000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return { data: data || [], isLoading, error };
};

// Hook for notifications
export const useNotifications = () => {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['notifications'],
        queryFn: AdminAPI.getNotifications,
        enabled: isAuthenticated,
        refetchInterval: 60000,
        staleTime: 30000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return { data: data || [], isLoading, error };
};

// Hook for active users
export const useActiveUsers = () => {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, error } = useQuery({
        queryKey: ['active-users'],
        queryFn: AdminAPI.getActiveUsers,
        enabled: isAuthenticated,
        refetchInterval: 30000,
        staleTime: 15000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return { data: data || [], isLoading, error };
};

// Custom hook for organization statistics
export const useOrganizationStats = (fromDate?: Date, toDate?: Date) => {
    const { organizations, orgsLoading } = useAdminData();

    const stats = useMemo(() => {
        if (!organizations || organizations.length === 0) {
            return {
                totalOrganizations: 0,
                tierDistribution: {},
                statusDistribution: {},
                topOrganizations: []
            };
        }

        // Filter organizations based on date range if provided
        const filteredOrganizations = organizations.filter(org => {
            if (!fromDate || !toDate) return true;
            const createdAt = new Date(org.created_at);
            return createdAt >= fromDate && createdAt <= toDate;
        });

        const tierDistribution = filteredOrganizations.reduce((acc: Record<string, number>, org) => {
            const tier = org.subscription_tier || 'free';
            acc[tier] = (acc[tier] || 0) + 1;
            return acc;
        }, {});

        const statusDistribution = filteredOrganizations.reduce((acc: Record<string, number>, org) => {
            const status = org.subscription_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const topOrganizations = filteredOrganizations
            .sort((a, b) => (b.total_conversations || 0) - (a.total_conversations || 0))
            .slice(0, 5);

        return {
            totalOrganizations: filteredOrganizations.length,
            tierDistribution,
            statusDistribution,
            topOrganizations
        };
    }, [organizations, fromDate, toDate]);

    return { ...stats, loading: orgsLoading };
};

// Custom hook for conversation analytics
export const useConversationAnalytics = () => {
    const { conversations, convsLoading } = useAdminData();

    const analytics = useMemo(() => {
        if (!conversations || conversations.length === 0) {
            return {
                totalConversations: 0,
                todayConversations: 0,
                averageMessagesPerConversation: 0,
                organizationActivity: []
            };
        }

        const today = new Date().toDateString();
        const todayConversations = conversations.filter(conv =>
            new Date(conv.created_at).toDateString() === today
        ).length;

        const organizationActivity = conversations.reduce((acc: Record<string, number>, conv) => {
            const orgName = conv.organization_name || 'Unknown';
            acc[orgName] = (acc[orgName] || 0) + 1;
            return acc;
        }, {});

        return {
            totalConversations: conversations.length,
            todayConversations,
            averageMessagesPerConversation: Math.round(conversations.length / Math.max(1, conversations.length)),
            organizationActivity: Object.entries(organizationActivity)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
        };
    }, [conversations]);

    return { ...analytics, loading: convsLoading };
};

// Custom hook for visitor statistics
export const useVisitorStats = (fromDate?: Date, toDate?: Date) => {
    const { visitors, visitorsLoading } = useAdminData();

    return useMemo(() => {
        if (!visitors || visitorsLoading) {
            return {
                visitorGrowth: {},
                organizationDistribution: {},
                topActiveVisitors: [],
                loading: visitorsLoading
            };
        }

        // Filter visitors by date range if provided
        let filteredVisitors = visitors;
        if (fromDate || toDate) {
            filteredVisitors = visitors.filter(visitor => {
                const visitorDate = new Date(visitor.created_at);
                if (fromDate && visitorDate < fromDate) return false;
                if (toDate && visitorDate > toDate) return false;
                return true;
            });
        }

        // Process visitor growth data
        const visitorGrowth = filteredVisitors.reduce((acc, visitor) => {
            const date = new Date(visitor.created_at);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Organization distribution
        const organizationDistribution = filteredVisitors.reduce((acc, visitor) => {
            const orgName = visitor.organization_name || 'Unknown';
            acc[orgName] = (acc[orgName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Top 10 most active visitors (by last_active date)
        const topActiveVisitors = [...filteredVisitors]
            .sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime())
            .slice(0, 10)
            .map(visitor => ({
                ...visitor,
                days_since_active: Math.floor((Date.now() - new Date(visitor.last_active).getTime()) / (1000 * 60 * 60 * 24))
            }));

        return {
            visitorGrowth,
            organizationDistribution,
            topActiveVisitors,
            loading: false
        };
    }, [visitors, visitorsLoading, fromDate, toDate]);
};

export const useRevenueStats = (fromDate?: Date, toDate?: Date) => {
    const { isAuthenticated } = useAuth();

    const {
        data: revenueStats,
        isLoading,
        error
    } = useQuery({
        queryKey: ['admin-revenue-stats', fromDate, toDate],
        queryFn: AdminAPI.getRevenueStats,
        enabled: isAuthenticated,
        refetchInterval: 300000, // Refetch every 5 minutes
        staleTime: 120000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return useMemo(() => {
        if (!revenueStats || isLoading) {
            return {
                revenueMetrics: {
                    total_revenue: 0,
                    mrr: 0,
                    arr: 0,
                    arpu: 0,
                    active_subscriptions: 0,
                    revenue_growth_rate: 0,
                    average_subscription_value: 0,
                },
                timeBasedRevenue: {
                    today: 0,
                    this_week: 0,
                    this_month: 0,
                    last_month: 0,
                    this_year: 0,
                    last_year: 0,
                },
                monthlyTrend: [],
                tierDistribution: [],
                topOrganizations: [],
                loading: isLoading,
                error
            };
        }

        // If date filters are provided, filter monthly trend data
        let filteredMonthlyTrend = revenueStats.monthly_trend;
        if (fromDate || toDate) {
            filteredMonthlyTrend = revenueStats.monthly_trend.filter(item => {
                const itemDate = new Date(item.month + ' 1'); // Approximate date from month string
                if (fromDate && itemDate < fromDate) return false;
                if (toDate && itemDate > toDate) return false;
                return true;
            });
        }

        return {
            revenueMetrics: revenueStats.revenue_metrics,
            timeBasedRevenue: revenueStats.time_based_revenue,
            monthlyTrend: filteredMonthlyTrend,
            tierDistribution: revenueStats.tier_distribution,
            topOrganizations: revenueStats.top_organizations,
            loading: false,
            error: null
        };
    }, [revenueStats, isLoading, error, fromDate, toDate]);
};

export const useConversationStats = (fromDate?: Date, toDate?: Date) => {
    const { isAuthenticated } = useAuth();

    const {
        data: conversationStats,
        isLoading,
        error
    } = useQuery({
        queryKey: ['admin-conversation-stats', fromDate, toDate],
        queryFn: AdminAPI.getConversationStats,
        enabled: isAuthenticated,
        refetchInterval: 180000, // Refetch every 3 minutes
        staleTime: 60000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });

    return useMemo(() => {
        if (!conversationStats || isLoading) {
            return {
                conversationMetrics: {
                    total_conversations: 0,
                    avg_messages_per_conversation: 0,
                    active_organizations: 0,
                    growth_rate: 0,
                },
                timeBasedConversations: {
                    today: 0,
                    this_week: 0,
                    this_month: 0,
                    last_month: 0,
                    this_year: 0,
                    last_year: 0,
                },
                hourlyDistribution: [],
                organizationActivity: [],
                conversationTrends: [],
                messageTypeDistribution: [],
                loading: isLoading,
                error
            };
        }

        // If date filters are provided, filter trend data
        let filteredTrends = conversationStats.conversation_trends || [];
        if (fromDate || toDate) {
            filteredTrends = conversationStats.conversation_trends.filter((item: { date: string }) => {
                const itemDate = new Date(item.date);
                if (fromDate && itemDate < fromDate) return false;
                if (toDate && itemDate > toDate) return false;
                return true;
            });
        }

        return {
            conversationMetrics: conversationStats.conversation_metrics,
            timeBasedConversations: conversationStats.time_based_conversations,
            hourlyDistribution: conversationStats.hourly_distribution,
            organizationActivity: conversationStats.organization_activity,
            conversationTrends: filteredTrends,
            messageTypeDistribution: conversationStats.message_type_distribution,
            loading: false,
            error: null
        };
    }, [conversationStats, isLoading, error, fromDate, toDate]);
};

export default useAdminData; 