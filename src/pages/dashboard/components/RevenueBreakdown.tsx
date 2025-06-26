import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { BusinessInsights } from '@/services/api';
import { formatCurrency } from '../utils';

interface RevenueBreakdownProps {
    businessInsights: BusinessInsights | null;
    loading: boolean;
}

export const RevenueBreakdown = ({ businessInsights, loading }: RevenueBreakdownProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Revenue Breakdown
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-slate-300 dark:bg-slate-500 rounded-full"></div>
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-600 animate-pulse rounded"></div>
                                </div>
                                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-600 animate-pulse rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Monthly Recurring Revenue</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(businessInsights?.revenue.monthly_recurring_revenue || 0)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Average Revenue Per User</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {formatCurrency(businessInsights?.revenue.average_revenue_per_user || 0)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/70 rounded-lg border dark:border-slate-600/50">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Active Customers</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {businessInsights?.customers.active_customers || 0}
                            </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mt-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Annualized Revenue</span>
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                    {formatCurrency(businessInsights?.revenue.total_revenue || 0)}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}; 