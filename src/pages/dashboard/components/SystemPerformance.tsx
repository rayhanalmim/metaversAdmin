import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { BusinessInsights, RealtimeStats } from '@/services/api';
import { formatNumber } from '../utils';

interface SystemPerformanceProps {
    businessInsights: BusinessInsights | null;
    realtimeStats: RealtimeStats | null;
    loading: boolean;
}

export const SystemPerformance = ({ businessInsights, realtimeStats, loading }: SystemPerformanceProps) => {
    return (
        <Card className="h-full bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    System Performance
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-600 animate-pulse rounded mx-auto mb-2"></div>
                                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-600 animate-pulse rounded mx-auto"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {businessInsights?.performance.system_uptime.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300">Uptime</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {businessInsights?.performance.avg_response_time}ms
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300">Avg Latency</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                                {formatNumber(realtimeStats?.api_calls || 0)}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300">API Calls Today</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {businessInsights?.performance.cache_hit_rate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-300">Cache Hit Rate</div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 