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
}

export const OverviewTab = ({
    dashboardStats,
    realtimeStats,
    businessInsights,
    systemHealth,
    usageAnalytics,
    loading,
}: OverviewTabProps) => {
    return (
        <div className="space-y-6">
            <OverviewStatsCards dashboardStats={dashboardStats} loading={loading.dashboard} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SystemPerformance businessInsights={businessInsights} realtimeStats={realtimeStats} loading={loading.insights} />
                <QuickActions />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueBreakdown businessInsights={businessInsights} loading={loading.insights} />
                <GrowthMetrics businessInsights={businessInsights} loading={loading.insights} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity systemHealth={systemHealth} loading={loading.health} />
                <SystemStatus systemHealth={systemHealth} realtimeStats={realtimeStats} loading={loading.health} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <TopPerformingOrganizations usageAnalytics={usageAnalytics} loading={loading.usage} />
                <UsageStatistics usageAnalytics={usageAnalytics} loading={loading.usage} />
            </div>
        </div>
    );
}; 