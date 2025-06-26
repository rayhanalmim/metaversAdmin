import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
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
    Line
} from 'recharts';
import { Database, TrendingUp, Crown } from 'lucide-react';
import { AnalyticsData, DashboardStats, RealtimeStats, SubscriptionDistribution } from '@/services/api';
import { chartColors } from '../utils';

interface AnalyticsTabProps {
    analyticsData: AnalyticsData[];
    loadingAnalytics: boolean;
    dashboardStats: DashboardStats | null;
    realtimeStats: RealtimeStats | null;
    loadingInsights: boolean;
    subscriptionDistribution: SubscriptionDistribution[];
    loadingDistribution: boolean;
}

export const AnalyticsTab = ({
    analyticsData,
    loadingAnalytics,
    dashboardStats,
    realtimeStats,
    loadingInsights,
    subscriptionDistribution,
    loadingDistribution,
}: AnalyticsTabProps) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-blue-600" />
                            Vector DB & API Usage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loadingInsights ? (
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
                                        value: dashboardStats?.vector_embeddings || 0,
                                        cost: ((dashboardStats?.vector_embeddings || 0) * 0.0001).toFixed(2),
                                        color: '#3b82f6',
                                        unit: 'documents'
                                    },
                                    {
                                        name: 'OpenAI API Calls',
                                        value: realtimeStats?.api_calls || 0,
                                        cost: ((realtimeStats?.api_calls || 0) * 0.002).toFixed(2),
                                        color: '#10b981',
                                        unit: 'requests'
                                    },
                                    {
                                        name: 'Database Storage',
                                        value: Math.round((dashboardStats?.total_conversations || 0) / 10),
                                        cost: (Math.round((dashboardStats?.total_conversations || 0) / 10) * 0.025).toFixed(2),
                                        color: '#8b5cf6',
                                        unit: 'MB'
                                    },
                                    {
                                        name: 'Total Conversations',
                                        value: dashboardStats?.total_conversations || 0,
                                        cost: ((dashboardStats?.total_conversations || 0) * 0.001).toFixed(2),
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
                        {loadingAnalytics ? (
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
                        {loadingAnalytics ? (
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
                        {loadingDistribution ? (
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
        </div>
    );
}; 