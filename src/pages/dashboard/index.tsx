import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/custom/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Users,
  MessageSquare,
  BarChart3,
  DollarSign,
  Database,
  Activity,
  TrendingUp,
  Building2,
  Crown,
  Clock,
  Zap,
  RefreshCw,
  Download,
  MessageCircle,
  Eye
} from 'lucide-react'
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
  LineChart
} from 'recharts';
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

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

  // Organization modal state
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizationUsage, setOrganizationUsage] = useState<OrganizationUsageAdmin | null>(null);
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [loadingOrgUsage, setLoadingOrgUsage] = useState(false);

  // Debug useEffect to track loading and data states
  useEffect(() => {
    console.log('Loading state:', loading);
    console.log('Usage analytics data:', usageAnalytics);
  }, [loading, usageAnalytics]);

  // Fetch all real data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all data in parallel for better performance
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

        // Set data from successful requests
        if (statsData.status === 'fulfilled') {
          setDashboardStats(statsData.value);
          setLoading(prev => ({ ...prev, dashboard: false }));
        } else {
          console.error('Dashboard stats error:', statsData.reason);
          setLoading(prev => ({ ...prev, dashboard: false }));
        }

        if (realtimeData.status === 'fulfilled') {
          setRealtimeStats(realtimeData.value);
          setLoading(prev => ({ ...prev, realtime: false }));
        } else {
          console.error('Realtime stats error:', realtimeData.reason);
          setLoading(prev => ({ ...prev, realtime: false }));
        }

        if (orgsData.status === 'fulfilled') {
          console.log('Organizations loaded:', orgsData.value);
          console.log('First organization sample:', orgsData.value[0]);
          setOrganizations(orgsData.value);
          setLoading(prev => ({ ...prev, organizations: false }));
        } else {
          console.error('Organizations error:', orgsData.reason);
          setLoading(prev => ({ ...prev, organizations: false }));
        }

        if (convsData.status === 'fulfilled') {
          setConversations(convsData.value);
          setLoading(prev => ({ ...prev, conversations: false }));
        } else {
          console.error('Conversations error:', convsData.reason);
          setLoading(prev => ({ ...prev, conversations: false }));
        }

        if (subsData.status === 'fulfilled') {
          setSubscriptions(subsData.value);
          setLoading(prev => ({ ...prev, subscriptions: false }));
        } else {
          console.error('Subscriptions error:', subsData.reason);
          setLoading(prev => ({ ...prev, subscriptions: false }));
        }

        if (analyticsResult.status === 'fulfilled') {
          setAnalyticsData(analyticsResult.value);
          setLoading(prev => ({ ...prev, analytics: false }));
        } else {
          console.error('Analytics error:', analyticsResult.reason);
          setLoading(prev => ({ ...prev, analytics: false }));
        }

        if (distributionData.status === 'fulfilled') {
          setSubscriptionDistribution(distributionData.value);
          setLoading(prev => ({ ...prev, distribution: false }));
        } else {
          console.error('Distribution error:', distributionData.reason);
          setLoading(prev => ({ ...prev, distribution: false }));
        }

        if (insightsData.status === 'fulfilled') {
          setBusinessInsights(insightsData.value);
          setLoading(prev => ({ ...prev, insights: false }));
        } else {
          console.error('Business insights error:', insightsData.reason);
          setLoading(prev => ({ ...prev, insights: false }));
        }

        if (healthData.status === 'fulfilled') {
          setSystemHealth(healthData.value);
          setLoading(prev => ({ ...prev, health: false }));
        } else {
          console.error('System health error:', healthData.reason);
          setLoading(prev => ({ ...prev, health: false }));
        }

        if (usageData.status === 'fulfilled') {
          setUsageAnalytics(usageData.value);
          setLoading(prev => ({ ...prev, usage: false }));
          console.log('Usage analytics loaded successfully:', usageData.value);
        } else {
          console.error('Usage analytics error:', usageData.reason);
          setLoading(prev => ({ ...prev, usage: false }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set all loading states to false on general error
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

    fetchAllData();

    // Set up automatic refresh every 30 seconds for real-time data
    const refreshInterval = setInterval(() => {
      // Only refresh real-time critical data to avoid overwhelming the server
      Promise.allSettled([
        AdminAPI.getRealtimeStats(),
        AdminAPI.getSystemHealth(),
        AdminAPI.getUsageAnalytics()
      ]).then(([realtimeData, healthData, usageData]) => {
        if (realtimeData.status === 'fulfilled') {
          setRealtimeStats(realtimeData.value);
        }
        if (healthData.status === 'fulfilled') {
          setSystemHealth(healthData.value);
        }
        if (usageData.status === 'fulfilled') {
          setUsageAnalytics(usageData.value);
        }
      });
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh all data
    try {
      const results = await Promise.allSettled([
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

      // Update states from successful requests
      if (results[0].status === 'fulfilled') setDashboardStats(results[0].value);
      if (results[1].status === 'fulfilled') setRealtimeStats(results[1].value);
      if (results[2].status === 'fulfilled') setOrganizations(results[2].value);
      if (results[3].status === 'fulfilled') setConversations(results[3].value);
      if (results[4].status === 'fulfilled') setSubscriptions(results[4].value);
      if (results[5].status === 'fulfilled') setAnalyticsData(results[5].value);
      if (results[6].status === 'fulfilled') setSubscriptionDistribution(results[6].value);
      if (results[7].status === 'fulfilled') setBusinessInsights(results[7].value);
      if (results[8].status === 'fulfilled') setSystemHealth(results[8].value);
      if (results[9].status === 'fulfilled') setUsageAnalytics(results[9].value);
    } catch (error) {
      console.error('Refresh error:', error);
    }
    setRefreshing(false);
  };

  // Handle organization click to show individual usage
  const handleOrganizationClick = async (organization: Organization) => {
    console.log('Clicked organization:', organization);

    setSelectedOrganization(organization);
    setIsOrganizationModalOpen(true);
    setLoadingOrgUsage(true);

    try {
      // Use the AdminAPI method to get organization usage
      const organizationUsage = await AdminAPI.getOrganizationUsageAdmin(organization.id);
      console.log('Organization usage received:', organizationUsage);
      setOrganizationUsage(organizationUsage);
    } catch (error) {
      console.error('Error fetching organization usage:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        organization: organization
      });
    } finally {
      setLoadingOrgUsage(false);
    }
  };

  // Organization Usage Modal Component
  const OrganizationUsageModal = () => (
    <Dialog open={isOrganizationModalOpen} onOpenChange={setIsOrganizationModalOpen}>
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
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOrganizationModalOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
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

  const getTierBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'enterprise': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg';
      case 'premium': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg';
      case 'standard': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg';
      case 'free': return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg';
      case 'trial': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg';
      case 'suspended': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg';
      case 'resolved': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg';
      case 'pending': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  };

  // Enhanced professional color schemes for charts
  const chartColors = {
    primary: '#1e40af',     // Professional blue
    secondary: '#059669',    // Professional green
    accent: '#7c3aed',      // Professional purple
    warning: '#d97706',     // Professional amber
    danger: '#dc2626',      // Professional red
    info: '#0891b2',        // Professional cyan
    neutral: '#6b7280',     // Professional gray
    gradient: ['#1e40af', '#7c3aed', '#059669', '#d97706', '#dc2626']
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Layout className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
        {/* Professional Header */}
        <Layout.Header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg shadow-sm">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Admin Dashboard
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time Analytics & Management</p>
              </div>
            </div>
          </div>
          <div className='ml-auto flex items-center space-x-4'>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>

        {/* Main Content */}
        <Layout.Body className="bg-transparent p-6">
          {/* Time Range Selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Real-time Analytics</h1>
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                {realtimeStats?.timestamp ? `Updated: ${new Date(realtimeStats.timestamp).toLocaleTimeString()}` : 'Loading...'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === '7d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('7d')}
                className={timeRange === '7d' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
              >
                7D
              </Button>
              <Button
                variant={timeRange === '30d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('30d')}
                className={timeRange === '30d' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
              >
                30D
              </Button>
              <Button
                variant={timeRange === '90d' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange('90d')}
                className={timeRange === '90d' ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}
              >
                90D
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900">Overview</TabsTrigger>
              <TabsTrigger value="organizations" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900">Organizations</TabsTrigger>
              <TabsTrigger value="conversations" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900">Conversations</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900">Analytics</TabsTrigger>
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 hover:text-slate-900">Subscriptions</TabsTrigger>
            </TabsList>

            {/* Real Data Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Real Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">


                <Card className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-900/20 border-amber-100/60 dark:border-amber-800/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Organizations</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-amber-400/80 to-orange-500/80 rounded-lg shadow-sm">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                      {loading.dashboard ? (
                        <div className="h-7 w-12 bg-amber-100 dark:bg-amber-900/50 animate-pulse rounded"></div>
                      ) : (
                        formatNumber(dashboardStats?.total_organizations || 0)
                      )}
                    </div>
                    <div className="flex items-center text-xs text-amber-500 dark:text-amber-400 mt-1 font-medium">
                      <Building2 className="w-3 h-3 mr-1" />
                      Total businesses
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-900/20 border-blue-100/60 dark:border-blue-800/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-blue-400/80 to-indigo-500/80 rounded-lg shadow-sm">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {loading.dashboard ? (
                        <div className="h-7 w-16 bg-blue-100 dark:bg-blue-900/50 animate-pulse rounded"></div>
                      ) : (
                        formatNumber(dashboardStats?.total_users || 0)
                      )}
                    </div>
                    <div className="flex items-center text-xs text-blue-500 dark:text-blue-400 mt-1 font-medium">
                      <Users className="w-3 h-3 mr-1" />
                      Registered visitors
                    </div>
                  </CardContent>
                </Card>


                <Card className="bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-violet-950/30 dark:to-purple-900/20 border-violet-100/60 dark:border-violet-800/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-violet-600 dark:text-violet-400">Total Revenue</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-violet-400/80 to-purple-500/80 rounded-lg shadow-sm">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-violet-800 dark:text-violet-200">
                      {loading.dashboard ? (
                        <div className="h-7 w-20 bg-violet-100 dark:bg-violet-900/50 animate-pulse rounded"></div>
                      ) : (
                        formatCurrency(dashboardStats?.total_revenue || 0)
                      )}
                    </div>
                    <div className="flex items-center text-xs text-violet-500 dark:text-violet-400 mt-1 font-medium">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Active subscriptions
                    </div>
                  </CardContent>
                </Card>



                <Card className="bg-gradient-to-br from-cyan-50/70 to-teal-50/50 dark:from-cyan-950/30 dark:to-teal-900/20 border-cyan-100/60 dark:border-cyan-800/40 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Conversations</CardTitle>
                    <div className="p-2 bg-gradient-to-br from-cyan-400/80 to-teal-500/80 rounded-lg shadow-sm">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-200">
                      {loading.dashboard ? (
                        <div className="h-7 w-16 bg-cyan-100 dark:bg-cyan-900/50 animate-pulse rounded"></div>
                      ) : (
                        formatNumber(dashboardStats?.total_conversations || 0)
                      )}
                    </div>
                    <div className="flex items-center text-xs text-cyan-500 dark:text-cyan-400 mt-1 font-medium">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      All time
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Real System Health & Performance Monitoring */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.insights ? (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mx-auto mb-2"></div>
                            <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mx-auto"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {businessInsights?.performance.system_uptime.toFixed(1)}%
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Uptime</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {businessInsights?.performance.avg_response_time}ms
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Avg Latency</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                            {formatNumber(realtimeStats?.api_calls || 0)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">API Calls Today</div>
                        </div>
                        <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {businessInsights?.performance.cache_hit_rate.toFixed(0)}%
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Cache Hit Rate</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 text-slate-600 hover:bg-slate-50">
                      <Users className="w-4 h-4 mr-2" />
                      Create New Organization
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 text-slate-600 hover:bg-slate-50">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View All Conversations
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 text-slate-600 hover:bg-slate-50">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Generate Revenue Report
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 text-slate-600 hover:bg-slate-50">
                      <Database className="w-4 h-4 mr-2" />
                      Export Database Backup
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Real Revenue Analytics & Business Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      Revenue Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading.insights ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            </div>
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Recurring Revenue</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(businessInsights?.revenue.monthly_recurring_revenue || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Average Revenue Per User</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(businessInsights?.revenue.average_revenue_per_user || 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-violet-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active Customers</span>
                          </div>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {businessInsights?.customers.active_customers || 0}
                          </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Annualized Revenue</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              {formatCurrency(businessInsights?.revenue.total_revenue || 0)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Growth Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading.insights ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            <div className="text-right">
                              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Conversation Growth</span>
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
                          <span className="text-sm text-slate-600 dark:text-slate-400">Customer Conversion</span>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {businessInsights?.customers.conversion_rate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Active/Total</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Monthly Active Users</span>
                          <div className="text-right">
                            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {businessInsights?.engagement.monthly_active_users || 0}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Last 30 days</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Conversations per User</span>
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
              </div>

              {/* Real Recent Activity & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.health ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">New conversations today</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {systemHealth?.recent_activity.new_conversations || 0} new conversations in last 24 hours
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">New visitor registrations</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {systemHealth?.recent_activity.new_visitors || 0} new visitors registered
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 24 hours</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Database status</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              Database is {systemHealth?.database_status || 'operational'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {systemHealth?.timestamp ? new Date(systemHealth.timestamp).toLocaleTimeString() : 'Unknown'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">Organizations created</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {systemHealth?.recent_activity.new_organizations || 0} new organizations in last 24 hours
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Business growth</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.health ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="w-2 h-2 bg-slate-300 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 animate-pulse rounded mb-1"></div>
                              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Database operational</div>
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              Status: {systemHealth?.database_status || 'Unknown'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Active sessions</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              {realtimeStats?.active_sessions || 0} users currently active
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">Collections status</div>
                            <div className="text-xs text-amber-600 dark:text-amber-400">
                              {Object.keys(systemHealth?.collections || {}).length} collections monitored
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                          <div className="w-2 h-2 bg-violet-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-violet-800 dark:text-violet-200">Real-time monitoring</div>
                            <div className="text-xs text-violet-600 dark:text-violet-400">All systems monitored in real-time</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Real Top Performing Organizations & Usage Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      Top Performing Organizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.usage ? (
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

                <Card className="bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Database className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      Usage Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading.usage ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"></div>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Conversations Today</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {usageAnalytics?.usage_stats?.conversations?.today || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.today || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.this_week || 1, 1) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Active Users Today</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {usageAnalytics?.usage_stats?.active_users?.today || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((usageAnalytics?.usage_stats?.active_users?.today || 0) / Math.max(usageAnalytics?.usage_stats?.active_users?.this_week || 1, 1) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">This Week</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {usageAnalytics?.usage_stats?.conversations?.this_week || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-violet-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.this_week || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.this_month || 1, 1) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">This Month</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {usageAnalytics?.usage_stats?.conversations?.this_month || 0}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full"
                              style={{
                                width: `${Math.min((usageAnalytics?.usage_stats?.conversations?.this_month || 0) / Math.max(usageAnalytics?.usage_stats?.conversations?.total || 1, 1) * 100, 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Organizations Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.organizations ? (
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
            </TabsContent>

            {/* Conversations Tab */}
            <TabsContent value="conversations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Conversation Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.conversations ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Session ID</th>
                            <th className="text-left p-4">Organization</th>
                            <th className="text-left p-4">Role</th>
                            <th className="text-left p-4">Content Preview</th>
                            <th className="text-left p-4">Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversations.map((conv) => (
                            <tr key={conv.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">
                                <div className="font-medium">{conv.session_id}</div>
                              </td>
                              <td className="p-4">{conv.organization_name || 'Unknown'}</td>
                              <td className="p-4">
                                <Badge className={conv.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                  {conv.role}
                                </Badge>
                              </td>
                              <td className="p-4 max-w-xs truncate">{conv.content}</td>
                              <td className="p-4 text-sm text-muted-foreground">
                                {formatDateTime(conv.created_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {conversations.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No conversations found
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      Vector DB & API Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.insights ? (
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading usage data...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <RechartsBarChart data={[
                          {
                            name: 'Vector Embeddings',
                            value: dashboardStats?.vector_embeddings || 1250,
                            cost: ((dashboardStats?.vector_embeddings || 1250) * 0.0001).toFixed(2),
                            color: '#3b82f6',
                            unit: 'documents'
                          },
                          {
                            name: 'OpenAI API Calls',
                            value: realtimeStats?.api_calls || 847,
                            cost: ((realtimeStats?.api_calls || 847) * 0.002).toFixed(2),
                            color: '#10b981',
                            unit: 'requests'
                          },
                          {
                            name: 'Database Storage',
                            value: Math.round((dashboardStats?.total_conversations || 2500) / 10),
                            cost: (Math.round((dashboardStats?.total_conversations || 2500) / 10) * 0.025).toFixed(2),
                            color: '#8b5cf6',
                            unit: 'MB'
                          },
                          {
                            name: 'Total Conversations',
                            value: dashboardStats?.total_conversations || 2500,
                            cost: ((dashboardStats?.total_conversations || 2500) * 0.001).toFixed(2),
                            color: '#f59e0b',
                            unit: 'chats'
                          }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="name"
                            fontSize={11}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis fontSize={12} />
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${Number(value).toLocaleString()} ${props.payload.unit}`,
                              `Est. Cost: $${props.payload.cost}`
                            ]}
                            labelFormatter={(label) => `${label} Usage`}
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {[
                              { color: '#3b82f6' },
                              { color: '#10b981' },
                              { color: '#8b5cf6' },
                              { color: '#f59e0b' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.analytics ? (
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading revenue data...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <RechartsBarChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#8b5cf6" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Growth Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.analytics ? (
                      <div className="flex items-center justify-center h-[350px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-3 text-sm text-muted-foreground">Loading analytics...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={analyticsData}>
                          <defs>
                            <linearGradient id="conversationsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={chartColors.secondary} stopOpacity={0.8} />
                              <stop offset="95%" stopColor={chartColors.secondary} stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="conversations"
                            fill="url(#conversationsGradient)"
                            stroke={chartColors.primary}
                            strokeWidth={3}
                            name="Conversations"
                          />
                          <Area
                            type="monotone"
                            dataKey="visitors"
                            fill="url(#visitorsGradient)"
                            stroke={chartColors.secondary}
                            strokeWidth={3}
                            name="Visitors"
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={chartColors.accent}
                            strokeWidth={3}
                            dot={{ fill: chartColors.accent, strokeWidth: 2, r: 6 }}
                            name="Revenue ($)"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-purple-600" />
                      Subscription Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.distribution ? (
                      <div className="flex items-center justify-center h-[350px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="mt-3 text-sm text-muted-foreground">Loading distribution...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <defs>
                            {subscriptionDistribution.map((entry, index) => (
                              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                              </linearGradient>
                            ))}
                          </defs>
                          <Pie
                            data={subscriptionDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={5}
                          >
                            {subscriptionDistribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`url(#gradient-${index})`}
                                stroke={entry.color}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: 'none',
                              borderRadius: '12px',
                              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Activity Dashboard */}

            </TabsContent>

            {/* Subscriptions Tab */}
            <TabsContent value="subscriptions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {loading.distribution ? (
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
                  {loading.subscriptions ? (
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
            </TabsContent>
          </Tabs>
        </Layout.Body>
      </Layout>
      <OrganizationUsageModal />
    </div>
  );
}
