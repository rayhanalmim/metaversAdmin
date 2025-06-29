import { useState, useEffect } from 'react';
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
import DashboardCache from '@/services/cache';

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
            // Try to load data from cache first
            const cachedDashboardStats = DashboardCache.getDashboardStats();
            const cachedRealtimeStats = DashboardCache.getRealtimeStats();
            const cachedOrganizations = DashboardCache.getOrganizations();
            const cachedConversations = DashboardCache.getConversations();
            const cachedSubscriptions = DashboardCache.getSubscriptions();
            const cachedAnalytics = DashboardCache.getAnalytics();
            const cachedDistribution = DashboardCache.getDistribution();
            const cachedInsights = DashboardCache.getBusinessInsights();
            const cachedHealth = DashboardCache.getSystemHealth();
            const cachedUsage = DashboardCache.getUsageAnalytics();

            // Log cache hits
            console.log('Cache Status:', {
                dashboardStats: cachedDashboardStats ? 'HIT' : 'MISS',
                realtimeStats: cachedRealtimeStats ? 'HIT' : 'MISS',
                organizations: cachedOrganizations ? 'HIT' : 'MISS',
                conversations: cachedConversations ? 'HIT' : 'MISS',
                subscriptions: cachedSubscriptions ? 'HIT' : 'MISS',
                analytics: cachedAnalytics ? 'HIT' : 'MISS',
                distribution: cachedDistribution ? 'HIT' : 'MISS',
                insights: cachedInsights ? 'HIT' : 'MISS',
                health: cachedHealth ? 'HIT' : 'MISS',
                usage: cachedUsage ? 'HIT' : 'MISS'
            });

            // Set cached data if available
            if (cachedDashboardStats) {
                console.log('Using cached dashboard stats');
                setDashboardStats(cachedDashboardStats);
            }
            if (cachedRealtimeStats) {
                console.log('Using cached realtime stats');
                setRealtimeStats(cachedRealtimeStats);
            }
            if (cachedOrganizations) {
                console.log('Using cached organizations');
                setOrganizations(cachedOrganizations);
            }
            if (cachedConversations) {
                console.log('Using cached conversations');
                setConversations(cachedConversations);
            }
            if (cachedSubscriptions) {
                console.log('Using cached subscriptions');
                setSubscriptions(cachedSubscriptions);
            }
            if (cachedAnalytics) {
                console.log('Using cached analytics');
                setAnalyticsData(cachedAnalytics);
            }
            if (cachedDistribution) {
                console.log('Using cached distribution');
                setSubscriptionDistribution(cachedDistribution);
            }
            if (cachedInsights) {
                console.log('Using cached insights');
                setBusinessInsights(cachedInsights);
            }
            if (cachedHealth) {
                console.log('Using cached health data');
                setSystemHealth(cachedHealth);
            }
            if (cachedUsage) {
                console.log('Using cached usage data');
                setUsageAnalytics(cachedUsage);
            }

            console.log('Fetching fresh data from API...');

            // Fetch fresh data
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

            console.log('dashboardData', DashboardCache);

            // Update state and cache with fresh data
            if (statsData.status === 'fulfilled') {
                console.log('Updating cache: dashboard stats');
                setDashboardStats(statsData.value);
                DashboardCache.setDashboardStats(statsData.value);
            }
            if (realtimeData.status === 'fulfilled') {
                console.log('Updating cache: realtime stats');
                setRealtimeStats(realtimeData.value);
                DashboardCache.setRealtimeStats(realtimeData.value);
            }
            if (orgsData.status === 'fulfilled') {
                console.log('Updating cache: organizations');
                setOrganizations(orgsData.value);
                DashboardCache.setOrganizations(orgsData.value);
            }
            if (convsData.status === 'fulfilled') {
                console.log('Updating cache: conversations');
                setConversations(convsData.value);
                DashboardCache.setConversations(convsData.value);
            }
            if (subsData.status === 'fulfilled') {
                console.log('Updating cache: subscriptions');
                setSubscriptions(subsData.value);
                DashboardCache.setSubscriptions(subsData.value);
            }
            if (analyticsResult.status === 'fulfilled') {
                console.log('Updating cache: analytics');
                setAnalyticsData(analyticsResult.value);
                DashboardCache.setAnalytics(analyticsResult.value);
            }
            if (distributionData.status === 'fulfilled') {
                console.log('Updating cache: distribution');
                setSubscriptionDistribution(distributionData.value);
                DashboardCache.setDistribution(distributionData.value);
            }
            if (insightsData.status === 'fulfilled') {
                console.log('Updating cache: insights');
                setBusinessInsights(insightsData.value);
                DashboardCache.setBusinessInsights(insightsData.value);
            }
            if (healthData.status === 'fulfilled') {
                console.log('Updating cache: health');
                setSystemHealth(healthData.value);
                DashboardCache.setSystemHealth(healthData.value);
            }
            if (usageData.status === 'fulfilled') {
                console.log('Updating cache: usage');
                setUsageAnalytics(usageData.value);
                DashboardCache.setUsageAnalytics(usageData.value);
            }

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

        // Set up interval for real-time updates of specific data
        const refreshInterval = setInterval(async () => {
            try {
                const [realtimeData, healthData, usageData] = await Promise.all([
                    AdminAPI.getRealtimeStats(),
                    AdminAPI.getSystemHealth(),
                    AdminAPI.getUsageAnalytics()
                ]);

                setRealtimeStats(realtimeData);
                setSystemHealth(healthData);
                setUsageAnalytics(usageData);

                // Update cache for real-time data
                DashboardCache.setRealtimeStats(realtimeData);
                DashboardCache.setSystemHealth(healthData);
                DashboardCache.setUsageAnalytics(usageData);
            } catch (error) {
                console.error('Error updating real-time data:', error);
            }
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
            <Layout.Header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between w-full gap-4 px-6">
                    {/* Left section */}
                    <div className="flex items-center gap-4 flex-1">
                        <Search />

                    </div>

                    {/* Right section */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="outline" size="sm">
                                Documentation
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="relative">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
                        </Button>

                        {/* Quick Actions */}
                        <Button variant="ghost" size="icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="19" cy="12" r="1" />
                                <circle cx="5" cy="12" r="1" />
                            </svg>
                        </Button>

                        {/* Theme Switch */}
                        <ThemeSwitch />

                        {/* Divider */}
                        <div className="h-6 w-px bg-border"></div>

                        {/* User Navigation */}
                        <UserNav />
                    </div>
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