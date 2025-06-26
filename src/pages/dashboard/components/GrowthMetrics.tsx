import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { BusinessInsights } from '@/services/api';

interface GrowthMetricsProps {
    businessInsights: BusinessInsights | null;
    loading: boolean;
}

export const GrowthMetrics = ({ businessInsights, loading }: GrowthMetricsProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Growth Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 animate-pulse rounded"></div>
                                <div className="text-right">
                                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-600 animate-pulse rounded mb-1"></div>
                                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-600 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Conversation Growth</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {businessInsights?.engagement.monthly_conversations || 0}
                                </div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                                    {businessInsights?.growth.conversation_growth_rate && businessInsights.growth.conversation_growth_rate > 0 ? '+' : ''}{businessInsights?.growth.conversation_growth_rate?.toFixed(1) || '0'}% MoM
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Customer Conversion</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {businessInsights?.customers.conversion_rate.toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Active/Total</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Monthly Active Users</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {businessInsights?.engagement.monthly_active_users || 0}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Last 30 days</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-300">Conversations per User</span>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {businessInsights?.engagement.conversations_per_user.toFixed(1) || '0'}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Average</div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 