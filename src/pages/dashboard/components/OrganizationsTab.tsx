import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/custom/button';
import { Building2, Eye } from 'lucide-react';
import { Organization } from '@/services/api';
import { formatDateTime, getStatusBadgeColor, getTierBadgeColor } from '../utils';

interface OrganizationsTabProps {
    organizations: Organization[];
    loading: boolean;
    handleOrganizationClick: (organization: Organization) => void;
}

export const OrganizationsTab = ({ organizations, loading, handleOrganizationClick }: OrganizationsTabProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Building2 className="w-5 h-5" />
                    Organizations Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading organizations...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Organization</th>
                                    <th className="text-left p-4">Subscription</th>
                                    <th className="text-left p-4">Users</th>
                                    <th className="text-left p-4">Conversations</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizations.map((org) => (
                                    <tr
                                        key={org.id}
                                        className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                                        onClick={() => handleOrganizationClick(org)}
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">{org.name}</div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOrganizationClick(org);
                                                    }}
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{org.id}</div>
                                        </td>
                                        <td className="p-4">
                                            <Badge className={getTierBadgeColor(org.subscription_tier)}>
                                                {org.subscription_tier || 'Free'}
                                            </Badge>
                                        </td>
                                        <td className="p-4">{org.total_users || 0}</td>
                                        <td className="p-4">{org.total_conversations || 0}</td>
                                        <td className="p-4">
                                            <Badge className={getStatusBadgeColor(org.subscription_status)}>
                                                {org.subscription_status || 'Unknown'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {org.created_at ? formatDateTime(org.created_at) : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {organizations.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No organizations found
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 