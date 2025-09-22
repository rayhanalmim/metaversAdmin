import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Gamepad2, ShoppingBag, MapPin, Crown, TrendingUp } from 'lucide-react';
import { MetaverseDashboardStats, MetaverseRealtimeStats } from '@/services/api';
import { formatNumber, formatCurrency } from '../utils';

interface MetaverseStatsCardsProps {
    dashboardStats: MetaverseDashboardStats | null;
    realtimeStats: MetaverseRealtimeStats | null;
    loading: {
        dashboard: boolean;
        realtime: boolean;
    };
    onShowUserStats: () => void;
    onShowRevenueStats: () => void;
}

export const MetaverseStatsCards = ({
    dashboardStats,
    realtimeStats,
    loading,
    onShowUserStats,
    onShowRevenueStats
}: MetaverseStatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Avatars */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onShowUserStats}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Avatars</CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading.dashboard ? (
                            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.totalAvatars || 0)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {loading.realtime ? '...' : `+${realtimeStats?.newUsersToday || 0} today`}
                    </p>
                </CardContent>
            </Card>

            {/* Total Items */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Virtual Items</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading.dashboard ? (
                            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.totalItems || 0)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {loading.realtime ? '...' : `+${realtimeStats?.newNFTsToday || 0} new today`}
                    </p>
                </CardContent>
            </Card>

            {/* Active Listings */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                    <MapPin className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading.dashboard ? (
                            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.activeListings || 0)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {loading.realtime ? '...' : `${dashboardStats?.activeUsers || 0} users online`}
                    </p>
                </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onShowRevenueStats}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {loading.dashboard ? (
                            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                            formatCurrency(dashboardStats?.totalRevenue || 0)
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {loading.realtime ? '...' : `+${formatCurrency(0)} today`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};