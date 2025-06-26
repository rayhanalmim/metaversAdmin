import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, DollarSign } from 'lucide-react';
import { Subscription, SubscriptionDistribution } from '@/services/api';
import { formatCurrency, formatDateTime, getStatusBadgeColor, getTierBadgeColor } from '../utils';

interface SubscriptionsTabProps {
    subscriptions: Subscription[];
    loadingSubscriptions: boolean;
    subscriptionDistribution: SubscriptionDistribution[];
    loadingDistribution: boolean;
}

export const SubscriptionsTab = ({
    subscriptions,
    loadingSubscriptions,
    subscriptionDistribution,
    loadingDistribution,
}: SubscriptionsTabProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {loadingDistribution ? (
                    <div className="col-span-4 text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading subscription data...</p>
                    </div>
                ) : (
                    subscriptionDistribution.map((sub, index) => (
                        <Card key={index} className={`
                  ${sub.name === 'Standard' ? 'bg-gradient-to-br from-emerald-50/70 to-green-50/50 dark:from-emerald-950/30 dark:to-green-900/20 border-emerald-100/60 dark:border-emerald-800/40' : ''}
                  ${sub.name === 'Trial' ? 'bg-gradient-to-br from-orange-50/70 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-900/20 border-orange-100/60 dark:border-orange-800/40' : ''}
                  ${sub.name === 'Professional' ? 'bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-900/20 border-violet-100/60 dark:border-violet-800/40' : ''}
                  ${sub.name === 'Free' ? 'bg-gradient-to-br from-slate-50/70 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-900/20 border-slate-100/60 dark:border-slate-800/40' : ''}
                  shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5
                `}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className={`text-sm font-medium
                      ${sub.name === 'Standard' ? 'text-emerald-600 dark:text-emerald-400' : ''}
                      ${sub.name === 'Trial' ? 'text-orange-600 dark:text-orange-400' : ''}
                      ${sub.name === 'Professional' ? 'text-violet-600 dark:text-violet-400' : ''}
                      ${sub.name === 'Free' ? 'text-slate-600 dark:text-slate-400' : ''}
                    `}>{sub.name} Plan</CardTitle>
                                <div className={`p-2 rounded-lg shadow-sm
                      ${sub.name === 'Standard' ? 'bg-gradient-to-br from-emerald-400/80 to-green-500/80' : ''}
                      ${sub.name === 'Trial' ? 'bg-gradient-to-br from-orange-400/80 to-amber-500/80' : ''}
                      ${sub.name === 'Professional' ? 'bg-gradient-to-br from-violet-400/80 to-purple-500/80' : ''}
                      ${sub.name === 'Free' ? 'bg-gradient-to-br from-slate-400/80 to-gray-500/80' : ''}
                    `}>
                                    <Crown className="h-4 w-4 text-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold mb-1
                      ${sub.name === 'Standard' ? 'text-emerald-700 dark:text-emerald-300' : ''}
                      ${sub.name === 'Trial' ? 'text-orange-700 dark:text-orange-300' : ''}
                      ${sub.name === 'Professional' ? 'text-violet-700 dark:text-violet-300' : ''}
                      ${sub.name === 'Free' ? 'text-slate-700 dark:text-slate-300' : ''}
                    `}>{sub.value}</div>
                                <p className={`text-xs font-medium
                      ${sub.name === 'Standard' ? 'text-emerald-500 dark:text-emerald-400' : ''}
                      ${sub.name === 'Trial' ? 'text-orange-500 dark:text-orange-400' : ''}
                      ${sub.name === 'Professional' ? 'text-violet-500 dark:text-violet-400' : ''}
                      ${sub.name === 'Free' ? 'text-slate-500 dark:text-slate-400' : ''}
                    `}>subscribers</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Subscription Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loadingSubscriptions ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-sm text-muted-foreground">Loading subscriptions...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">Organization</th>
                                        <th className="text-left p-4">Plan</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Monthly Revenue</th>
                                        <th className="text-left p-4">Current Period End</th>
                                        <th className="text-left p-4">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">{sub.organization_name || 'Unknown'}</td>
                                            <td className="p-4">
                                                <Badge className={getTierBadgeColor(sub.subscription_tier)}>
                                                    {sub.subscription_tier}
                                                </Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getStatusBadgeColor(sub.subscription_status)}>
                                                    {sub.subscription_status}
                                                </Badge>
                                            </td>
                                            <td className="p-4">{formatCurrency(sub.payment_amount)}</td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDateTime(sub.current_period_end)}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {formatDateTime(sub.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {subscriptions.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No subscriptions found
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}; 