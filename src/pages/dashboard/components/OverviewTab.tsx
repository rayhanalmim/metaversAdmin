import { DashboardStats, RealtimeStats, BusinessInsights, SystemHealth, UsageAnalytics } from '@/services/api';
import { OverviewStatsCards } from './OverviewStatsCards';
import { SystemPerformance } from './SystemPerformance';
import { QuickActions } from './QuickActions';
import { RevenueBreakdown } from './RevenueBreakdown';
// import { GrowthMetrics } from './GrowthMetrics';
// import { RecentActivity } from './RecentActivity';
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
        <div className="flex flex-col gap-4">
            {/* Stats Cards */}
            <div className="w-full">
                <OverviewStatsCards
                    dashboardStats={dashboardStats}
                    loading={loading.dashboard}
                    onShowOrgStats={onShowOrgStats}
                    onShowUserStats={onShowUserStats}
                    onShowRevenueStats={onShowRevenueStats}
                    onShowConversationStats={onShowConversationStats}
                />
            </div>

            {/* System Performance, Quick Actions, Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="w-full h-full">
                    <SystemPerformance
                        businessInsights={businessInsights}
                        realtimeStats={realtimeStats}
                        loading={loading.insights}
                    />
                </div>
                <div className="w-full h-full">
                    <QuickActions />
                </div>
                <div className="w-full h-full">
                    <RevenueBreakdown
                        businessInsights={businessInsights}
                        loading={loading.insights}
                    />
                </div>
            </div>

      

            {/* Organizations and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="w-full h-full">
                    <TopPerformingOrganizations
                        usageAnalytics={usageAnalytics}
                        loading={loading.usage}
                    />
                </div>
                <div className="w-full h-full">
                    <SystemStatus
                        systemHealth={systemHealth}
                        realtimeStats={realtimeStats}
                        loading={loading.health}
                    />
                </div>
            </div>

            {/* Usage Statistics */}
            <div className="w-full">
                <UsageStatistics
                    usageAnalytics={usageAnalytics}
                    loading={loading.usage}
                />
            </div>
        </div>
    );
}; 