import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useRevenueStats } from '@/hooks/useAdminData';
import {
    ResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    PieChart,
    Pie,
    Cell,
    ComposedChart
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatCurrency, formatNumber } from '../utils';

interface RevenueStatsPageProps {
    onBack: () => void;
}

// Colors for pie chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

interface TooltipProps {
    active?: boolean;
    payload?: {
        color: string;
        name: string;
        value: number;
        payload: {
            unit: string;
            cost: string;
        };
    }[];
    label?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {`${entry.name}: ${typeof entry.value === 'number' && entry.name.toLowerCase().includes('revenue')
                            ? formatCurrency(entry.value)
                            : formatNumber(entry.value)}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const RevenueStatsPage = ({ onBack }: RevenueStatsPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const {
        revenueMetrics,
        timeBasedRevenue,
        monthlyTrend,
        tierDistribution,
        topOrganizations,
        loading
    } = useRevenueStats(date?.from, date?.to);

    // Calculate growth trend
    const growthTrend = revenueMetrics.revenue_growth_rate;

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
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {/* Revenue Metrics Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-violet-50/70 to-purple-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-violet-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-violet-600 dark:text-violet-300">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-violet-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-violet-800 dark:text-violet-100">
                                    {formatCurrency(revenueMetrics.total_revenue)}
                                </div>
                                <div className="flex items-center text-xs text-violet-500 dark:text-violet-300 mt-1">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    All time
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50/70 to-emerald-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-green-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-green-600 dark:text-green-300">MRR</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-800 dark:text-green-100">
                                    {formatCurrency(revenueMetrics.mrr)}
                                </div>
                                <div className="flex items-center text-xs text-green-500 dark:text-green-300 mt-1">
                                    Monthly recurring
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-50/70 to-cyan-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-blue-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-300">ARPU</CardTitle>
                                <DollarSign className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">
                                    {formatCurrency(revenueMetrics.arpu)}
                                </div>
                                <div className="flex items-center text-xs text-blue-500 dark:text-blue-300 mt-1">
                                    Avg revenue per user
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-slate-800/90 dark:to-slate-700/80 border-amber-100/60 dark:border-slate-600/50">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-300">Growth Rate</CardTitle>
                                {growthTrend >= 0 ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${growthTrend >= 0 ? 'text-green-800 dark:text-green-100' : 'text-red-800 dark:text-red-100'}`}>
                                    {growthTrend.toFixed(1)}%
                                </div>
                                <div className="flex items-center text-xs text-amber-500 dark:text-amber-300 mt-1">
                                    Month over month
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly Revenue Trend */}
                    <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                        <CardHeader>
                            <CardTitle>Revenue Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={monthlyTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="revenue" orientation="left" />
                                    <YAxis yAxisId="subscriptions" orientation="right" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar yAxisId="revenue" dataKey="revenue" name="Revenue" fill="#8b5cf6" />
                                    <Line yAxisId="subscriptions" type="monotone" dataKey="new_subscriptions" name="New Subscriptions" stroke="#10b981" strokeWidth={2} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue by Tier Distribution */}
                        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                            <CardHeader>
                                <CardTitle>Revenue by Subscription Tier</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={tierDistribution} dataKey="revenue" nameKey="tier" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                            {tierDistribution.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top Organizations by Revenue */}
                        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                            <CardHeader>
                                <CardTitle>Top Organizations by Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topOrganizations.slice(0, 10).map((org, index) => (
                                        <div key={org.organization_id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900 rounded-full flex items-center justify-center text-sm font-medium text-violet-600 dark:text-violet-300">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">{org.organization_name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{org.tier} • {org.subscriptions} subscription{org.subscriptions !== 1 ? 's' : ''}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(org.revenue)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Time-based Revenue Breakdown */}
                    <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                        <CardHeader>
                            <CardTitle>Revenue Breakdown by Time Period</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Today</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.today)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Week</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.this_week)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Month</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.this_month)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Last Month</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.last_month)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This Year</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.this_year)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Last Year</p>
                                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(timeBasedRevenue.last_year)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}; 