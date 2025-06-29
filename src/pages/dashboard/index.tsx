import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download } from 'lucide-react';
import AdminAPI, {
    DashboardStats,
    RealtimeStats,
    Organization,
    Conversation,
    Subscription,
    AnalyticsData,
    SubscriptionDistribution,
    BusinessInsights,
    SystemHealth,
    UsageAnalytics,
    OrganizationUsageAdmin
} from '@/services/api';

import { OrganizationDetails } from './components/OrganizationDetails';
import { OverviewTab } from './components/OverviewTab';
import { OrganizationsTab } from './components/OrganizationsTab';
import { ConversationsTab } from './components/ConversationsTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { SubscriptionsTab } from './components/SubscriptionsTab';
import { OrganizationStatsPage } from './components/OrganizationStatsPage';
import { UserStatsPage } from './components/UserStatsPage';
import { RevenueStatsPage } from './components/RevenueStatsPage';
import { ConversationStatsPage } from './components/ConversationStatsPage';
import { downloadCSV, generateCSV, formatDateTime, formatCurrency } from './utils';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [refreshing, setRefreshing] = useState(false);
    const [showOrgStats, setShowOrgStats] = useState(false);
    const [showUserStats, setShowUserStats] = useState(false);
    const [showRevenueStats, setShowRevenueStats] = useState(false);
    const [showConversationStats, setShowConversationStats] = useState(false);

    // State for API data
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
    const [subscriptionDistribution, setSubscriptionDistribution] = useState<SubscriptionDistribution[]>([]);
    const [businessInsights, setBusinessInsights] = useState<BusinessInsights | null>(null);
    const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
    const [usageAnalytics, setUsageAnalytics] = useState<UsageAnalytics | null>(null);

    // Loading states
    const [loading, setLoading] = useState({
        dashboard: true,
        realtime: true,
        organizations: true,
        conversations: true,
        subscriptions: true,
        analytics: true,
        distribution: true,
        insights: true,
        health: true,
        usage: true
    });

    // Organization state
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [organizationUsage, setOrganizationUsage] = useState<OrganizationUsageAdmin | null>(null);
    const [loadingOrgUsage, setLoadingOrgUsage] = useState(false);

    const fetchAllData = async () => {
        try {
            const [
                statsData,
                realtimeData,
                orgsData,
                convsData,
                subsData,
                analyticsResult,
                distributionData,
                insightsData,
                healthData,
                usageData
            ] = await Promise.allSettled([
                AdminAPI.getDashboardStats(),
                AdminAPI.getRealtimeStats(),
                AdminAPI.getAllOrganizations(),
                AdminAPI.getAllConversations(),
                AdminAPI.getAllSubscriptions(),
                AdminAPI.getAnalytics(),
                AdminAPI.getSubscriptionDistribution(),
                AdminAPI.getBusinessInsights(),
                AdminAPI.getSystemHealth(),
                AdminAPI.getUsageAnalytics()
            ]);

            if (statsData.status === 'fulfilled') setDashboardStats(statsData.value);
            if (realtimeData.status === 'fulfilled') setRealtimeStats(realtimeData.value);
            if (orgsData.status === 'fulfilled') setOrganizations(orgsData.value);
            if (convsData.status === 'fulfilled') setConversations(convsData.value);
            if (subsData.status === 'fulfilled') setSubscriptions(subsData.value);
            if (analyticsResult.status === 'fulfilled') setAnalyticsData(analyticsResult.value);
            if (distributionData.status === 'fulfilled') setSubscriptionDistribution(distributionData.value);
            if (insightsData.status === 'fulfilled') setBusinessInsights(insightsData.value);
            if (healthData.status === 'fulfilled') setSystemHealth(healthData.value);
            if (usageData.status === 'fulfilled') setUsageAnalytics(usageData.value);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading({
                dashboard: false,
                realtime: false,
                organizations: false,
                conversations: false,
                subscriptions: false,
                analytics: false,
                distribution: false,
                insights: false,
                health: false,
                usage: false
            });
        }
    };

    useEffect(() => {
        fetchAllData();

        const refreshInterval = setInterval(() => {
            Promise.allSettled([
                AdminAPI.getRealtimeStats(),
                AdminAPI.getSystemHealth(),
                AdminAPI.getUsageAnalytics()
            ]).then(([realtimeData, healthData, usageData]) => {
                if (realtimeData.status === 'fulfilled') setRealtimeStats(realtimeData.value);
                if (healthData.status === 'fulfilled') setSystemHealth(healthData.value);
                if (usageData.status === 'fulfilled') setUsageAnalytics(usageData.value);
            });
        }, 30000); // 30 seconds

        return () => clearInterval(refreshInterval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    const handleOrganizationClick = async (organization: Organization) => {
        setSelectedOrganization(organization);
        setLoadingOrgUsage(true);
        try {
            const usage = await AdminAPI.getOrganizationUsageAdmin(organization.id);
            setOrganizationUsage(usage);
        } catch (error) {
            console.error(`Error fetching usage for organization ${organization.id}:`, error);
        } finally {
            setLoadingOrgUsage(false);
        }
    };

    const handleBackToOrganizations = () => {
        setSelectedOrganization(null);
        setOrganizationUsage(null);
    };

    const handleExport = () => {
        let data;
        let filename;

        // Prepare data structures
        const orgData = [
            // Header row
            {
                'ORGANIZATION DETAILS': '',
                '': '',
                'SUBSCRIPTION INFO': '',
                ' ': '',
                'USAGE METRICS': '',
                '  ': ''
            },
            // Column headers
            {
                'ORGANIZATION DETAILS': 'Organization Name',
                '': 'Organization ID',
                'SUBSCRIPTION INFO': 'Subscription Tier',
                ' ': 'Status',
                'USAGE METRICS': 'Total Users',
                '  ': 'Total Conversations'
            },
            // Data rows
            ...organizations.map(org => ({
                'ORGANIZATION DETAILS': org.name,
                '': org.id,
                'SUBSCRIPTION INFO': org.subscription_tier?.toUpperCase() || 'FREE',
                ' ': org.subscription_status?.toUpperCase() || 'INACTIVE',
                'USAGE METRICS': org.total_users || '0',
                '  ': org.total_conversations || '0'
            }))
        ];

        const convData = [
            // Header row
            {
                'CONVERSATION DETAILS': '',
                '': '',
                'MESSAGE INFO': '',
                ' ': '',
                'TIMESTAMP': ''
            },
            // Column headers
            {
                'CONVERSATION DETAILS': 'Session ID',
                '': 'Organization',
                'MESSAGE INFO': 'Role',
                ' ': 'Content',
                'TIMESTAMP': 'Created At'
            },
            // Data rows
            ...conversations.map(conv => ({
                'CONVERSATION DETAILS': conv.session_id,
                '': conv.organization_name || 'N/A',
                'MESSAGE INFO': conv.role?.toUpperCase() || 'SYSTEM',
                ' ': conv.content,
                'TIMESTAMP': formatDateTime(conv.created_at)
            }))
        ];

        const subData = [
            // Header row
            {
                'ORGANIZATION INFO': '',
                '': '',
                'SUBSCRIPTION DETAILS': '',
                ' ': '',
                'BILLING': '',
                '  ': ''
            },
            // Column headers
            {
                'ORGANIZATION INFO': 'Organization',
                '': 'Status',
                'SUBSCRIPTION DETAILS': 'Tier',
                ' ': 'Period Start',
                'BILLING': 'Period End',
                '  ': 'Monthly Revenue'
            },
            // Data rows
            ...subscriptions.map(sub => ({
                'ORGANIZATION INFO': sub.organization_name || 'N/A',
                '': sub.subscription_status?.toUpperCase() || 'INACTIVE',
                'SUBSCRIPTION DETAILS': sub.subscription_tier?.toUpperCase() || 'FREE',
                ' ': formatDateTime(sub.current_period_start),
                'BILLING': formatDateTime(sub.current_period_end),
                '  ': formatCurrency(sub.payment_amount)
            }))
        ];

        switch (activeTab) {
            case 'organizations':
                data = generateCSV(orgData as unknown as Record<string, unknown>[]);
                filename = `organizations_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            case 'conversations':
                data = generateCSV(convData as unknown as Record<string, unknown>[]);
                filename = `conversations_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            case 'subscriptions':
                data = generateCSV(subData as unknown as Record<string, unknown>[]);
                filename = `subscriptions_export_${new Date().toISOString().split('T')[0]}.csv`;
                break;

            default:
                return;
        }

        downloadCSV(data, filename);
    };


    return (
        <Layout>
            <Layout.Header>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>

            <Layout.Body className='max-w-[2000px] mx-auto'>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div className=''>
                        <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
                        <p className='text-muted-foreground'>
                            Welcome to your AI Platform Analytics Hub - Monitor usage, conversations, and business insights in real-time.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                        <Button onClick={handleExport} disabled={!['organizations', 'conversations', 'subscriptions'].includes(activeTab)}>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className='my-3'>
                    <TabsList className='mb-3'>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="organizations">Organizations</TabsTrigger>
                        <TabsTrigger value="conversations">Conversations</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        {showOrgStats ? (
                            <OrganizationStatsPage onBack={() => setShowOrgStats(false)} />
                        ) : showUserStats ? (
                            <UserStatsPage onBack={() => setShowUserStats(false)} />
                        ) : showRevenueStats ? (
                            <RevenueStatsPage onBack={() => setShowRevenueStats(false)} />
                        ) : showConversationStats ? (
                            <ConversationStatsPage onBack={() => setShowConversationStats(false)} />
                        ) : (
                            <OverviewTab
                                dashboardStats={dashboardStats}
                                realtimeStats={realtimeStats}
                                businessInsights={businessInsights}
                                systemHealth={systemHealth}
                                usageAnalytics={usageAnalytics}
                                loading={loading}
                                onShowOrgStats={() => setShowOrgStats(true)}
                                onShowUserStats={() => setShowUserStats(true)}
                                onShowRevenueStats={() => setShowRevenueStats(true)}
                                onShowConversationStats={() => setShowConversationStats(true)}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="organizations" className="space-y-4">
                        {selectedOrganization ? (
                            <OrganizationDetails
                                organization={selectedOrganization}
                                organizationUsage={organizationUsage}
                                loading={loadingOrgUsage}
                                onBack={handleBackToOrganizations}
                            />
                        ) : (
                            <OrganizationsTab
                                organizations={organizations}
                                loading={loading.organizations}
                                handleOrganizationClick={handleOrganizationClick}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="conversations" className="space-y-4">
                        <ConversationsTab conversations={conversations} loading={loading.conversations} />
                    </TabsContent>
                    <TabsContent value="analytics" className="space-y-4">
                        <AnalyticsTab
                            analyticsData={analyticsData}
                            subscriptionDistribution={subscriptionDistribution}
                            loadingAnalytics={loading.analytics}
                            loadingDistribution={loading.distribution}
                            dashboardStats={dashboardStats}
                            realtimeStats={realtimeStats}
                            loadingInsights={loading.insights}
                        />
                    </TabsContent>
                    <TabsContent value="subscriptions" className="space-y-4">
                        <SubscriptionsTab
                            subscriptions={subscriptions}
                            loadingSubscriptions={loading.subscriptions}
                            subscriptionDistribution={subscriptionDistribution}
                            loadingDistribution={loading.distribution}
                        />
                    </TabsContent>
                </Tabs>
            </Layout.Body>
        </Layout>
    );
}