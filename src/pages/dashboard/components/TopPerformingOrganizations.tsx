import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { UsageAnalytics } from '@/services/api';

interface TopPerformingOrganizationsProps {
    usageAnalytics: UsageAnalytics | null;
    loading: boolean;
}

export const TopPerformingOrganizations = ({ usageAnalytics, loading }: TopPerformingOrganizationsProps) => {
    return (
        <Card className="lg:col-span-2 bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Top Performing Organizations
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Organization</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Plan</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Messages</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Recent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                            </div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                        </td>
                                        <td className="p-2">
                                            <div className="h-4 w-8 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Organization</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Plan</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Messages</th>
                                    <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Recent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usageAnalytics?.top_organizations && usageAnalytics.top_organizations.length > 0 ? (
                                    usageAnalytics.top_organizations.slice(0, 5).map((org, index) => (
                                        <tr key={org._id || index} className="border-b border-slate-100 dark:border-slate-700/50">
                                            <td className="p-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium">
                                                        {(index + 1)}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{org.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td className="p-2">
                                                <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                                    {org.subscription_tier || 'Free'}
                                                </Badge>
                                            </td>
                                            <td className="p-2 text-sm text-slate-600 dark:text-slate-400">
                                                {org.conversation_count || 0}
                                            </td>
                                            <td className="p-2 text-sm text-slate-600 dark:text-slate-400">
                                                {org.recent_conversations || 0}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                                            No organization data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 