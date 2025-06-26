import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/custom/button';
import { ArrowLeft } from 'lucide-react';
import { Organization, OrganizationUsageAdmin } from '@/services/api';
import { formatCurrency, formatDateTime, getStatusBadgeColor, getTierBadgeColor } from '../utils';
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart
} from 'recharts';

interface OrganizationDetailsProps {
    organization: Organization;
    organizationUsage: OrganizationUsageAdmin | null;
    loading: boolean;
    onBack: () => void;
}

export const OrganizationDetails = ({
    organization,
    organizationUsage,
    loading,
    onBack
}: OrganizationDetailsProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Organizations
                    </Button>

                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-lg text-muted-foreground">Loading organization analytics...</p>
                    </div>
                </div>
            ) : organizationUsage ? (
                <div className="space-y-6 border border-border rounded-lg p-4 dark:bg-slate-900">
                    {/* Organization Info */}
                    <h2 className="text-2xl font-bold">{organization.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        <Card>
                            <CardContent className="p-4">

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {organizationUsage.usage.total_conversations}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Conversations</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {organizationUsage.usage.total_users}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Total Users</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {organizationUsage.usage.vector_embeddings}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Vector Embeddings</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {organizationUsage.usage.documents}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Documents</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Time-based Statistics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Conversations Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={organizationUsage.conversation_analytics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="conversations"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Conversations"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="New Users"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                                            <div className="text-lg font-bold text-blue-600">
                                                {organizationUsage.time_based_stats.conversations.today}
                                            </div>
                                            <div className="text-xs text-blue-500">Conversations Today</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 dark:bg-green-950/50 rounded-lg">
                                            <div className="text-lg font-bold text-green-600">
                                                {organizationUsage.time_based_stats.users.today}
                                            </div>
                                            <div className="text-xs text-green-500">New Users Today</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                                            <div className="text-lg font-bold text-purple-600">
                                                {organizationUsage.time_based_stats.conversations.this_week}
                                            </div>
                                            <div className="text-xs text-purple-500">This Week</div>
                                        </div>
                                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                                            <div className="text-lg font-bold text-orange-600">
                                                {organizationUsage.time_based_stats.conversations.this_month}
                                            </div>
                                            <div className="text-xs text-orange-500">This Month</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Subscription Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-lg font-bold">
                                        <Badge className={getTierBadgeColor(organizationUsage.subscription_info.tier)}>
                                            {organizationUsage.subscription_info.tier}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">Plan</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-lg font-bold">
                                        <Badge className={getStatusBadgeColor(organizationUsage.subscription_info.status)}>
                                            {organizationUsage.subscription_info.status}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">Status</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {formatCurrency(organizationUsage.subscription_info.monthly_revenue)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">Monthly Revenue</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <div className="text-sm font-bold">
                                        {organizationUsage.subscription_info.current_period_end ?
                                            formatDateTime(organizationUsage.subscription_info.current_period_end) :
                                            'N/A'
                                        }
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-2">Period End</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-lg text-muted-foreground">
                        {organizationUsage === null ? 'Failed to load organization data' : 'No data available'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please check if the organization has a valid API key configured.
                    </p>
                </div>
            )}
        </div>
    );
}; 