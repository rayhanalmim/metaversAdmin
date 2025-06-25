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
export const useOrganizationStats = () => {
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

        const tierDistribution = organizations.reduce((acc: Record<string, number>, org) => {
            const tier = org.subscription_tier || 'free';
            acc[tier] = (acc[tier] || 0) + 1;
            return acc;
        }, {});

        const statusDistribution = organizations.reduce((acc: Record<string, number>, org) => {
            const status = org.subscription_status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        const topOrganizations = organizations
            .sort((a, b) => (b.total_conversations || 0) - (a.total_conversations || 0))
            .slice(0, 5);

        return {
            totalOrganizations: organizations.length,
            tierDistribution,
            statusDistribution,
            topOrganizations
        };
    }, [organizations]);

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

export default useAdminData; 