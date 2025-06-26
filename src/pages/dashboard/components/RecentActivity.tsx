import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { SystemHealth } from '@/services/api';

interface RecentActivityProps {
    systemHealth: SystemHealth | null;
    loading: boolean;
}

export const RecentActivity = ({ systemHealth, loading }: RecentActivityProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-48 bg-slate-200 dark:bg-slate-600 animate-pulse rounded mb-1"></div>
                                    <div className="h-3 w-32 bg-slate-200 dark:bg-slate-600 animate-pulse rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-slate-200 dark:bg-slate-600 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">New conversations today</div>
                                <div className="text-xs text-slate-600 dark:text-slate-300">
                                    {systemHealth?.recent_activity.new_conversations || 0} new conversations in last 24 hours
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">New visitor registrations</div>
                                <div className="text-xs text-slate-600 dark:text-slate-300">
                                    {systemHealth?.recent_activity.new_visitors || 0} new visitors registered
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 24 hours</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">New organizations</div>
                                <div className="text-xs text-slate-600 dark:text-slate-300">
                                    {systemHealth?.recent_activity.new_organizations || 0} businesses joined recently
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">This week</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Database status</div>
                                <div className="text-xs text-slate-600 dark:text-slate-300">
                                    System health: <span className="capitalize text-emerald-600 dark:text-emerald-400">{systemHealth?.database_status || 'checking...'}</span>
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Live monitoring</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
