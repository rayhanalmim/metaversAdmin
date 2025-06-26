import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Organization, OrganizationUsageAdmin } from '@/services/api';
import { formatCurrency, formatDateTime, getStatusBadgeColor, getTierBadgeColor } from '../utils';

interface OrganizationUsageModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    selectedOrganization: Organization | null;
    organizationUsage: OrganizationUsageAdmin | null;
    loadingOrgUsage: boolean;
}

export const OrganizationUsageModal = ({
    isOpen,
    onOpenChange,
    selectedOrganization,
    organizationUsage,
    loadingOrgUsage
}: OrganizationUsageModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {selectedOrganization?.name || 'Organization'} Usage Analytics
                            </DialogTitle>
                            <DialogDescription>
                                Detailed usage statistics and analytics for this organization
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {loadingOrgUsage ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-lg text-muted-foreground">Loading organization analytics...</p>
                        </div>
                    </div>
                ) : organizationUsage ? (
                    <div className="space-y-6">
                        {/* Organization Info */}
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
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-lg font-bold text-blue-600">
                                                    {organizationUsage.time_based_stats.conversations.today}
                                                </div>
                                                <div className="text-xs text-blue-500">Conversations Today</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-lg font-bold text-green-600">
                                                    {organizationUsage.time_based_stats.users.today}
                                                </div>
                                                <div className="text-xs text-green-500">New Users Today</div>
                                            </div>
                                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                                                <div className="text-lg font-bold text-purple-600">
                                                    {organizationUsage.time_based_stats.conversations.this_week}
                                                </div>
                                                <div className="text-xs text-purple-500">This Week</div>
                                            </div>
                                            <div className="text-center p-3 bg-orange-50 rounded-lg">
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
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <div className="text-lg font-bold">
                                            <Badge className={getTierBadgeColor(organizationUsage.subscription_info.tier)}>
                                                {organizationUsage.subscription_info.tier}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">Plan</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <div className="text-lg font-bold">
                                            <Badge className={getStatusBadgeColor(organizationUsage.subscription_info.status)}>
                                                {organizationUsage.subscription_info.status}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">Status</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">
                                            {formatCurrency(organizationUsage.subscription_info.monthly_revenue)}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2">Monthly Revenue</div>
                                    </div>
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
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
            </DialogContent>
        </Dialog>
    );
}; 