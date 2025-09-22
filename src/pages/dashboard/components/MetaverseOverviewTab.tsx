import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad2, ShoppingBag, MapPin, Crown, TrendingUp, Activity, Zap } from 'lucide-react';
import { MetaverseDashboardStats, MetaverseRealtimeStats, MarketplaceAnalytics, UserAnalytics } from '@/services/api';
import { formatNumber, formatCurrency } from '../utils';
import { MetaverseStatsCards } from './MetaverseStatsCards';

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
                            Virtual World Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active Users</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeUsers || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Online Now</span>
                            <span className="font-semibold text-green-600">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeUsers || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">New Users Today</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.newUsersToday || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Users</span>
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
                            Avatar & Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Avatars</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalAvatars || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Virtual Items</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalItems || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total NFTs</span>
                            <span className="font-semibold text-blue-600">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalNFTs || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">NFT Types</span>
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
                            Marketplace Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active Listings</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.activeListings || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Wallets</span>
                            <span className="font-semibold">
                                {loading.dashboard ? '...' : formatNumber(dashboardStats?.totalWallets || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">New Listings Today</span>
                            <span className="font-semibold text-green-600">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.newListingsToday || 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Revenue</span>
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
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <Users className="w-6 h-6 text-blue-600 mb-2" />
                            <span className="text-sm font-medium">Manage Users</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <Crown className="w-6 h-6 text-purple-600 mb-2" />
                            <span className="text-sm font-medium">NFT Analytics</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin className="w-6 h-6 text-green-600 mb-2" />
                            <span className="text-sm font-medium">Land Management</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <ShoppingBag className="w-6 h-6 text-orange-600 mb-2" />
                            <span className="text-sm font-medium">Marketplace</span>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Real-time System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Virtual World Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Server Uptime</span>
                            <span className="font-semibold text-green-600">
                                {loading.realtime ? '...' : `${realtimeStats?.server_uptime || '99.9'}%`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg Response Time</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : `${realtimeStats?.avg_response_time || 45}ms`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Active Rooms</span>
                            <span className="font-semibold">
                                {loading.realtime ? '...' : formatNumber(realtimeStats?.active_rooms || 0)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">New user registered</span>
                            <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">NFT listed for sale</span>
                            <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">Land purchased</span>
                            <span className="text-xs text-muted-foreground ml-auto">8m ago</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm">Avatar customized</span>
                            <span className="text-xs text-muted-foreground ml-auto">12m ago</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};