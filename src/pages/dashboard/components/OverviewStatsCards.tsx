import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, DollarSign, MessageCircle } from 'lucide-react';
import { DashboardStats } from '@/services/api';
import { formatCurrency, formatNumber } from '../utils';

interface OverviewStatsCardsProps {
    dashboardStats: DashboardStats | null;
    loading: boolean;
    onShowOrgStats: () => void;
    onShowUserStats: () => void;
    onShowRevenueStats: () => void;
    onShowConversationStats: () => void;
}

export const OverviewStatsCards = ({ dashboardStats, loading, onShowOrgStats, onShowUserStats, onShowRevenueStats, onShowConversationStats }: OverviewStatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card
                className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-amber-100/60 dark:border-slate-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:shadow-slate-900/30 cursor-pointer"
                onClick={onShowOrgStats}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-300">Organizations</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-amber-400/80 to-orange-500/80 dark:from-amber-500/90 dark:to-orange-600/90 rounded-lg shadow-sm">
                        <Building2 className="h-4 w-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-amber-800 dark:text-amber-100">
                        {loading ? (
                            <div className="h-7 w-12 bg-amber-100 dark:bg-slate-600 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.total_organizations || 0)
                        )}
                    </div>
                    <div className="flex items-center text-xs text-amber-500 dark:text-amber-300 mt-1 font-medium">
                        <Building2 className="w-3 h-3 mr-1" />
                        Total businesses
                    </div>
                </CardContent>
            </Card>

            <Card
                className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-blue-100/60 dark:border-slate-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:shadow-slate-900/30 cursor-pointer"
                onClick={onShowUserStats}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">Total Users</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-blue-400/80 to-indigo-500/80 dark:from-blue-500/90 dark:to-indigo-600/90 rounded-lg shadow-sm">
                        <Users className="h-4 w-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                        {loading ? (
                            <div className="h-7 w-16 bg-blue-100 dark:bg-slate-600 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.total_users || 0)
                        )}
                    </div>
                    <div className="flex items-center text-xs text-blue-500 dark:text-blue-300 mt-1 font-medium">
                        <Users className="w-3 h-3 mr-1" />
                        Registered visitors
                    </div>
                </CardContent>
            </Card>

            <Card
                className="bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-violet-100/60 dark:border-slate-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:shadow-slate-900/30 cursor-pointer"
                onClick={onShowRevenueStats}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-600 dark:text-violet-300">Total Revenue</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-violet-400/80 to-purple-500/80 dark:from-violet-500/90 dark:to-purple-600/90 rounded-lg shadow-sm">
                        <DollarSign className="h-4 w-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-violet-800 dark:text-violet-100">
                        {loading ? (
                            <div className="h-7 w-20 bg-violet-100 dark:bg-slate-600 animate-pulse rounded"></div>
                        ) : (
                            formatCurrency(dashboardStats?.total_revenue || 0)
                        )}
                    </div>
                    <div className="flex items-center text-xs text-violet-500 dark:text-violet-300 mt-1 font-medium">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Active subscriptions
                    </div>
                </CardContent>
            </Card>

            <Card
                className="bg-gradient-to-br from-cyan-50/70 to-teal-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-cyan-100/60 dark:border-slate-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] dark:shadow-slate-900/30 cursor-pointer"
                onClick={onShowConversationStats}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-cyan-600 dark:text-cyan-300">Conversations</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-cyan-400/80 to-teal-500/80 dark:from-cyan-500/90 dark:to-teal-600/90 rounded-lg shadow-sm">
                        <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-100">
                        {loading ? (
                            <div className="h-7 w-16 bg-cyan-100 dark:bg-slate-600 animate-pulse rounded"></div>
                        ) : (
                            formatNumber(dashboardStats?.total_conversations || 0)
                        )}
                    </div>
                    <div className="flex items-center text-xs text-cyan-500 dark:text-cyan-300 mt-1 font-medium">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        All time
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 