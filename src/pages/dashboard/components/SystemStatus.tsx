import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { SystemHealth, RealtimeStats } from '@/services/api';

interface SystemStatusProps {
    systemHealth: SystemHealth | null;
    realtimeStats: RealtimeStats | null;
    loading: boolean;
}

export const SystemStatus = ({ systemHealth, realtimeStats, loading }: SystemStatusProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    System Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mb-1"></div>
                                    <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Database operational</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                    Status: {systemHealth?.database_status || 'Unknown'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Active sessions</div>
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                    {realtimeStats?.active_sessions || 0} users currently active
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Collections status</div>
                                <div className="text-xs text-amber-600 dark:text-amber-400">
                                    {Object.keys(systemHealth?.collections || {}).length} collections monitored
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                            <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                                <div className="text-sm font-medium text-violet-800 dark:text-violet-200">Real-time monitoring</div>
                                <div className="text-xs text-violet-600 dark:text-violet-400">All systems monitored in real-time</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 