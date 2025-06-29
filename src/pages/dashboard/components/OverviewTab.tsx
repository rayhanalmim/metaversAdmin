import { DashboardStats, RealtimeStats, BusinessInsights, SystemHealth, UsageAnalytics } from '@/services/api';
import { OverviewStatsCards } from './OverviewStatsCards';
import { SystemPerformance } from './SystemPerformance';
import { QuickActions } from './QuickActions';
import { RevenueBreakdown } from './RevenueBreakdown';
import { GrowthMetrics } from './GrowthMetrics';
import { RecentActivity } from './RecentActivity';
import { SystemStatus } from './SystemStatus';
import { TopPerformingOrganizations } from './TopPerformingOrganizations';
import { UsageStatistics } from './UsageStatistics';

interface OverviewTabProps {
    dashboardStats: DashboardStats | null;
    realtimeStats: RealtimeStats | null;
    businessInsights: BusinessInsights | null;
    systemHealth: SystemHealth | null;
    usageAnalytics: UsageAnalytics | null;
    loading: {
        dashboard: boolean;
        realtime: boolean;
        insights: boolean;
        health: boolean;
        usage: boolean;
    };
    onShowOrgStats: () => void;
    onShowUserStats: () => void;
    onShowRevenueStats: () => void;
    onShowConversationStats: () => void;
}

export const OverviewTab = ({
    dashboardStats,
    realtimeStats,
    businessInsights,
    systemHealth,
    usageAnalytics,
    loading,
    onShowOrgStats,
    onShowUserStats,
    onShowRevenueStats,
    onShowConversationStats
}: OverviewTabProps) => {
    return (
        <div className="space-y-4">
            <OverviewStatsCards
                dashboardStats={dashboardStats}
                loading={loading.dashboard}
                onShowOrgStats={onShowOrgStats}
                onShowUserStats={onShowUserStats}
                onShowRevenueStats={onShowRevenueStats}
                onShowConversationStats={onShowConversationStats}
            />

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <SystemPerformance
                    businessInsights={businessInsights}
                    realtimeStats={realtimeStats}
                    loading={loading.insights}
                />
                <QuickActions />
                <RevenueBreakdown
                    businessInsights={businessInsights}
                    loading={loading.insights}
                />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <GrowthMetrics
                    businessInsights={businessInsights}
                    loading={loading.insights}
                />
                <RecentActivity
                    systemHealth={systemHealth}
                    loading={loading.health}
                />
            </div>

            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                <TopPerformingOrganizations
                    usageAnalytics={usageAnalytics}
                    loading={loading.usage}
                />
                <SystemStatus
                    systemHealth={systemHealth}
                    realtimeStats={realtimeStats}
                    loading={loading.health}
                />
            </div>

            <UsageStatistics
                usageAnalytics={usageAnalytics}
                loading={loading.usage}
            />
        </div>
    );
}; 