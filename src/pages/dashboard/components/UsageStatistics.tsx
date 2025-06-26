import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { UsageAnalytics } from '@/services/api';

interface UsageStatisticsProps {
    usageAnalytics: UsageAnalytics | null;
    loading: boolean;
}

export const UsageStatistics = ({ usageAnalytics, loading }: UsageStatisticsProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Database className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    Usage Statistics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                    <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Conversations Today</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {usageAnalytics?.usage_stats?.conversations?.today || 0}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.today || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.this_week || 1, 1) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Active Users Today</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {usageAnalytics?.usage_stats?.active_users?.today || 0}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((usageAnalytics?.usage_stats?.active_users?.today || 0) / Math.max(usageAnalytics?.usage_stats?.active_users?.this_week || 1, 1) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {usageAnalytics?.usage_stats?.conversations?.this_week || 0}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-violet-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.this_week || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.this_month || 1, 1) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {usageAnalytics?.usage_stats?.conversations?.this_month || 0}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-amber-500 h-2 rounded-full"
                                    style={{
                                        width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.this_month || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.total || 1, 1) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 