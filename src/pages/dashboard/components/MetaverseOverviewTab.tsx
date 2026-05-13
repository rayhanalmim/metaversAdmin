import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad2, ShoppingBag, MapPin, Crown, TrendingUp, Activity, Zap } from 'lucide-react';
import { MetaverseDashboardStats, MetaverseRealtimeStats, MarketplaceAnalytics, UserAnalytics } from '@/services/api';
import { formatNumber, formatCurrency } from '../utils';
import { MetaverseStatsCards } from './MetaverseStatsCards';
import { useT } from '@/i18n/I18nContext';

interface MetaverseOverviewTabProps {
    dashboardStats: MetaverseDashboardStats | null;
    realtimeStats: MetaverseRealtimeStats | null;
    marketplaceAnalytics: MarketplaceAnalytics | null;
    userAnalytics: UserAnalytics | null;
    loading: {
        dashboard: boolean;
        realtime: boolean;
        marketplace: boolean;
        userAnalytics: boolean;
    };
    onShowUserStats: () => void;
    onShowRevenueStats: () => void;
}

export const MetaverseOverviewTab = ({
    dashboardStats,
    realtimeStats,
    marketplaceAnalytics,
    userAnalytics,
    loading,
    onShowUserStats,
    onShowRevenueStats
}: MetaverseOverviewTabProps) => {
    const t = useT();
    return (
        <div className="flex flex-col gap-6">
            {/* Metaverse Stats Cards */}
            <MetaverseStatsCards
                dashboardStats={dashboardStats}
                realtimeStats={realtimeStats}
                loading={{ dashboard: loading.dashboard, realtime: loading.realtime }}
                onShowUserStats={onShowUserStats}
                onShowRevenueStats={onShowRevenueStats}
            />

            {/* Metaverse Activity Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Virtual World Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            {t('overview.virtual_world_activity')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.active_users')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeUsers || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.online_now')}</span>
                            <span className="font-semibold text-green-600">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeUsers || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.new_users_today')}</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.newUsersToday || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.total_users')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalUsers || 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Avatar & Items Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gamepad2 className="w-5 h-5 text-purple-600" />
                            {t('overview.avatar_items')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.total_avatars')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalAvatars || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.virtual_items')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalItems || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.total_nfts')}</span>
                            <span className="font-semibold text-blue-600">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalNFTs || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.nft_types')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalNFTTypes || 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Marketplace Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-green-600" />
                            {t('overview.marketplace_insights')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.active_listings')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeListings || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.total_wallets')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalWallets || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.new_listings_today')}</span>
                            <span className="font-semibold text-green-600">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.newListingsToday || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.total_revenue')}</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatCurrency(dashboardStats?.totalRevenue || 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions for Metaverse Management */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        {t('overview.quick_actions')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <Users className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm font-medium">{t('overview.manage_users')}</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <Crown className="w-6 h-6 text-purple-600 mb-2" />
                            <span className="text-sm font-medium">{t('overview.nft_analytics')}</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin className="w-6 h-6 text-green-600 mb-2" />
                            <span className="text-sm font-medium">{t('overview.land_management')}</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-orange-600 mb-2" />
                            <span className="text-sm font-medium">{t('overview.marketplace')}</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Real-time System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('overview.performance')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.server_uptime')}</span>
                            <span className="font-semibold text-green-600">
                                {loading.realtime ? '...' : `${realtimeStats?.server_uptime || '99.9'}%`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.avg_response_time')}</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : `${realtimeStats?.avg_response_time || 45}ms`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">{t('overview.active_rooms')}</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.active_rooms || 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('overview.recent_activity')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{t('overview.activity.new_user')}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{t('overview.activity.minutes_ago', { n: 2 })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{t('overview.activity.nft_listed')}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{t('overview.activity.minutes_ago', { n: 5 })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">{t('overview.activity.land_purchased')}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{t('overview.activity.minutes_ago', { n: 8 })}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">{t('overview.activity.avatar_customized')}</span>
                            <span className="text-xs text-muted-foreground ml-auto">{t('overview.activity.minutes_ago', { n: 12 })}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};