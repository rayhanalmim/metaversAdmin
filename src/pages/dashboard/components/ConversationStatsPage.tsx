import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Calendar, MessageCircle, TrendingUp, Clock, Users } from 'lucide-react';
import { useConversationStats } from '@/hooks/useAdminData';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    AreaChart,
    Area
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatNumber, formatDateTime } from '../utils';

interface ConversationStatsPageProps {
    onBack: () => void;
}

// Colors for charts
const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {`${entry.name}: ${formatNumber(entry.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const ConversationStatsPage = ({ onBack }: ConversationStatsPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const {
        conversationMetrics,
        timeBasedConversations,
        hourlyDistribution,
        organizationActivity,
        conversationTrends,
        messageTypeDistribution,
        loading
    } = useConversationStats(date?.from, date?.to);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Overview
                </Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                        >
                            <Calendar className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                    </>
                                ) : (
                                    format(date.from, 'LLL dd, y')
                                )
                            ) : (
                                <span>All time</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <CalendarComponent
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {/* Conversation Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-cyan-50/70 to-teal-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-cyan-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-cyan-600 dark:text-cyan-300">Total Conversations</CardTitle>
                                <MessageCircle className="h-4 w-4 text-cyan-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-cyan-800 dark:text-cyan-100">
                                    {formatNumber(conversationMetrics.total_conversations)}
                                </div>
                                <div className="flex items-center text-xs text-cyan-500 dark:text-cyan-300 mt-1">
                                    <MessageCircle className="w-3 h-3 mr-1" />
                                    All time
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-blue-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">Avg Messages/Conv</CardTitle>
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                                    {conversationMetrics.avg_messages_per_conversation.toFixed(1)}
                                </div>
                                <div className="flex items-center text-xs text-blue-500 dark:text-blue-300 mt-1">
                                    Message efficiency
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50/70 to-emerald-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-green-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">Active Organizations</CardTitle>
                                <Users className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                                    {formatNumber(conversationMetrics.active_organizations)}
                                </div>
                                <div className="flex items-center text-xs text-green-500 dark:text-green-300 mt-1">
                                    Organizations with chats
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50/70 to-violet-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-purple-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-300">Growth Rate</CardTitle>
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                                    {conversationMetrics.growth_rate > 0 ? '+' : ''}{conversationMetrics.growth_rate.toFixed(1)}%
                                </div>
                                <div className="flex items-center text-xs text-purple-500 dark:text-purple-300 mt-1">
                                    Month over month
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Conversation Trends Chart */}
                    <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                        <CardHeader>
                            <CardTitle>Conversation Volume Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={conversationTrends}>
                                    <defs>
                                        <linearGradient id="conversationGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis yAxisId="conversations" orientation="left" />
                                    <YAxis yAxisId="unique_visitors" orientation="right" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Area
                                        yAxisId="conversations"
                                        type="monotone"
                                        dataKey="conversations"
                                        stroke="#06b6d4"
                                        fill="url(#conversationGradient)"
                                        name="Conversations"
                                    />
                                    <Line
                                        yAxisId="unique_visitors"
                                        type="monotone"
                                        dataKey="unique_visitors"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        name="Unique Visitors"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hourly Distribution */}
                        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                            <CardHeader>
                                <CardTitle>Conversation Activity by Hour</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={hourlyDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="conversations" name="Conversations" fill="#06b6d4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Message Type Distribution */}
                        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                            <CardHeader>
                                <CardTitle>Message Type Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={messageTypeDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {messageTypeDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatNumber(value as number)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top Organizations by Conversation Volume */}
                    <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                        <CardHeader>
                            <CardTitle>Top Organizations by Conversation Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {organizationActivity.slice(0, 10).map((org, index) => (
                                    <div key={org.organization_name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center text-sm font-medium text-cyan-600 dark:text-cyan-300">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{org.organization_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {org.recent_conversations} recent conversations
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-900 dark:text-slate-100">{formatNumber(org.total_conversations)}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">total</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Time-based Conversation Breakdown */}
                    <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                        <CardHeader>
                            <CardTitle>Conversation Breakdown by Time Period</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Today</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.today)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Week</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.this_week)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Month</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.this_month)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Last Month</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.last_month)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Year</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.this_year)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Last Year</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatNumber(timeBasedConversations.last_year)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}; 