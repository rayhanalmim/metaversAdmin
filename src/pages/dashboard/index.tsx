import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageSquare,
  BarChart3,
  DollarSign,
  Database,
  Activity,
  TrendingUp,
  Building2,
  Crown
} from 'lucide-react'
import {
  LineChart,
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
  AreaChart,
  Area
} from 'recharts';
import AdminAPI, {
  DashboardStats,
  RealtimeStats,
  Organization,
  Conversation,
  Subscription,
  AnalyticsData,
  SubscriptionDistribution
} from '@/services/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // State for API data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [subscriptionDistribution, setSubscriptionDistribution] = useState<SubscriptionDistribution[]>([]);

  // Loading states
  const [loading, setLoading] = useState({
    dashboard: true,
    realtime: true,
    organizations: true,
    conversations: true,
    subscriptions: true,
    analytics: true,
    distribution: true
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const stats = await AdminAPI.getDashboardStats();
        setDashboardStats(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(prev => ({ ...prev, dashboard: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch real-time stats and set up periodic updates
  useEffect(() => {
    const fetchRealtimeStats = async () => {
      try {
        const stats = await AdminAPI.getRealtimeStats();
        setRealtimeStats(stats);
      } catch (error) {
        console.error('Error fetching realtime stats:', error);
      } finally {
        setLoading(prev => ({ ...prev, realtime: false }));
      }
    };

    // Initial fetch
    fetchRealtimeStats();

    // Set up periodic updates every 30 seconds
    const interval = setInterval(fetchRealtimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await AdminAPI.getAllOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      } finally {
        setLoading(prev => ({ ...prev, organizations: false }));
      }
    };

    fetchOrganizations();
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const convs = await AdminAPI.getAllConversations();
        setConversations(convs);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(prev => ({ ...prev, conversations: false }));
      }
    };

    fetchConversations();
  }, []);

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const subs = await AdminAPI.getAllSubscriptions();
        setSubscriptions(subs);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(prev => ({ ...prev, subscriptions: false }));
      }
    };

    fetchSubscriptions();
  }, []);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const analytics = await AdminAPI.getAnalytics();
        setAnalyticsData(analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(prev => ({ ...prev, analytics: false }));
      }
    };

    fetchAnalytics();
  }, []);

  // Fetch subscription distribution
  useEffect(() => {
    const fetchSubscriptionDistribution = async () => {
      try {
        const distribution = await AdminAPI.getSubscriptionDistribution();
        setSubscriptionDistribution(distribution);
      } catch (error) {
        console.error('Error fetching subscription distribution:', error);
      } finally {
        setLoading(prev => ({ ...prev, distribution: false }));
      }
    };

    fetchSubscriptionDistribution();
  }, []);

  const getTierBadgeColor = (tier: string) => {
    switch (tier?.toLowerCase()) {
      case 'enterprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'premium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'standard': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'free': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'resolved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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

  return (
    <div className="min-h-screen bg-background">
      <Layout className="dark:bg-gray-950">
        {/* Header */}
        <Layout.Header className="dark:bg-gray-950 dark:border-gray-800">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2">
                <BarChart3 className="w-6 h-6 dark:text-gray-300" />
              </div>
              <span className="text-lg font-medium dark:text-white">Admin Dashboard</span>
            </div>
          </div>
          <div className='ml-auto flex items-center space-x-4'>
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>

        {/* Main Content */}
        <Layout.Body className="dark:bg-gray-950">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Real-time Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.dashboard ? '...' : dashboardStats?.total_users.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-green-600">Registered visitors</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                    <MessageSquare className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.realtime ? '...' : realtimeStats?.active_conversations || '0'}
                    </div>
                    <p className="text-xs text-blue-600">Real-time</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.dashboard ? '...' : formatCurrency(dashboardStats?.total_revenue || 0)}
                    </div>
                    <p className="text-xs text-green-600">From subscriptions</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Organizations</CardTitle>
                    <Building2 className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.dashboard ? '...' : dashboardStats?.total_organizations.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-green-600">Active businesses</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-cyan-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vector Embeddings</CardTitle>
                    <Database className="h-4 w-4 text-cyan-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.dashboard ? '...' : dashboardStats?.vector_embeddings.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-blue-600">AI Knowledge Base</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                    <Activity className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading.realtime ? '...' : realtimeStats?.api_calls.toLocaleString() || '0'}
                    </div>
                    <p className="text-xs text-green-600">Today</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Growth Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.analytics ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading analytics...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="conversations" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                          <Area type="monotone" dataKey="visitors" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5" />
                      Subscription Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.distribution ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading distribution...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={subscriptionDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {subscriptionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Recent Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {loading.conversations ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
                        </div>
                      ) : conversations.length > 0 ? (
                        conversations.slice(0, 5).map((conv) => (
                          <div key={conv.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{conv.session_id}</div>
                              <div className="text-sm text-muted-foreground">{conv.organization_name || 'Unknown Organization'}</div>
                              <div className="text-xs text-muted-foreground">{conv.role}: {conv.content.substring(0, 50)}...</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                {conv.role}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(conv.created_at)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No conversations found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Top Organizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {loading.organizations ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading organizations...</p>
                        </div>
                      ) : organizations.length > 0 ? (
                        organizations.slice(0, 5).map((org) => (
                          <div key={org.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{org.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {org.total_users || 0} users • {org.total_conversations || 0} conversations
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={getTierBadgeColor(org.subscription_tier)}>
                                {org.subscription_tier || 'Free'}
                              </Badge>
                              <span className="text-xs font-medium text-green-600">
                                {org.subscription_status || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No organizations found
                        </div>
                      )}
                    </div>
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
                            <tr key={org.id} className="border-b hover:bg-muted/50">
                              <td className="p-4">
                                <div>
                                  <div className="font-medium">{org.name}</div>
                                  <div className="text-sm text-muted-foreground">{org.id}</div>
                                </div>
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
                    <CardTitle>Monthly Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading.analytics ? (
                      <div className="flex items-center justify-center h-[400px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-2 text-sm text-muted-foreground">Loading analytics...</p>
                        </div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={analyticsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="conversations" stroke="#3b82f6" strokeWidth={2} />
                          <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={2} />
                          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
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
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{sub.name} Plan</CardTitle>
                        <Crown className="h-4 w-4" style={{ color: sub.color }} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{sub.value}</div>
                        <p className="text-xs text-muted-foreground">subscribers</p>
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
    </div>
  );
}
