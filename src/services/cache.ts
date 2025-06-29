import {
    DashboardStats,
    RealtimeStats,
    Organization,
    Conversation,
    Subscription,
    AnalyticsData,
    SubscriptionDistribution,
    BusinessInsights,
    SystemHealth,
    UsageAnalytics
} from './api';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
}

class DashboardCache {
    private static CACHE_PREFIX = 'admin_dashboard_';
    private static DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes
    private static LONG_EXPIRY = 30 * 60 * 1000;   // 30 minutes

    private static getCacheKey(key: string): string {
        return `${this.CACHE_PREFIX}${key}`;
    }

    static set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRY): void {
        const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            expiresIn
        };
        localStorage.setItem(this.getCacheKey(key), JSON.stringify(cacheItem));
    }

    static get<T>(key: string): T | null {
        try {
            const cached = localStorage.getItem(this.getCacheKey(key));
            if (!cached) return null;

            const cacheItem: CacheItem<T> = JSON.parse(cached);
            const isExpired = Date.now() - cacheItem.timestamp > cacheItem.expiresIn;

            if (isExpired) {
                this.remove(key);
                return null;
            }

            return cacheItem.data;
        } catch {
            return null;
        }
    }

    static remove(key: string): void {
        localStorage.removeItem(this.getCacheKey(key));
    }

    static clearAll(): void {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.CACHE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }

    // Specific dashboard data caching methods
    static setDashboardStats(data: DashboardStats): void {
        this.set('dashboard_stats', data, this.DEFAULT_EXPIRY);
    }

    static setRealtimeStats(data: RealtimeStats): void {
        this.set('realtime_stats', data, 30 * 1000); // 30 seconds for realtime data
    }

    static setOrganizations(data: Organization[]): void {
        this.set('organizations', data, this.LONG_EXPIRY);
    }

    static setConversations(data: Conversation[]): void {
        this.set('conversations', data, this.DEFAULT_EXPIRY);
    }

    static setSubscriptions(data: Subscription[]): void {
        this.set('subscriptions', data, this.LONG_EXPIRY);
    }

    static setAnalytics(data: AnalyticsData[]): void {
        this.set('analytics', data, this.LONG_EXPIRY);
    }

    static setDistribution(data: SubscriptionDistribution[]): void {
        this.set('distribution', data, this.LONG_EXPIRY);
    }

    static setBusinessInsights(data: BusinessInsights): void {
        this.set('business_insights', data, this.DEFAULT_EXPIRY);
    }

    static setSystemHealth(data: SystemHealth): void {
        this.set('system_health', data, 60 * 1000); // 1 minute
    }

    static setUsageAnalytics(data: UsageAnalytics): void {
        this.set('usage_analytics', data, this.DEFAULT_EXPIRY);
    }

    // Getters
    static getDashboardStats(): DashboardStats | null {
        return this.get('dashboard_stats');
    }

    static getRealtimeStats(): RealtimeStats | null {
        return this.get('realtime_stats');
    }

    static getOrganizations(): Organization[] | null {
        return this.get('organizations');
    }

    static getConversations(): Conversation[] | null {
        return this.get('conversations');
    }

    static getSubscriptions(): Subscription[] | null {
        return this.get('subscriptions');
    }

    static getAnalytics(): AnalyticsData[] | null {
        return this.get('analytics');
    }

    static getDistribution(): SubscriptionDistribution[] | null {
        return this.get('distribution');
    }

    static getBusinessInsights(): BusinessInsights | null {
        return this.get('business_insights');
    }

    static getSystemHealth(): SystemHealth | null {
        return this.get('system_health');
    }

    static getUsageAnalytics(): UsageAnalytics | null {
        return this.get('usage_analytics');
    }
}

export default DashboardCache; 