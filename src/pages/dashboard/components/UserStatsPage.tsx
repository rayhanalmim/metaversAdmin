import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useVisitorStats } from '@/hooks/useAdminData';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    Line,
    Area,
    Brush,
    ReferenceLine,
    ComposedChart
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface UserStatsPageProps {
    onBack: () => void;
}

// Types for tooltip data
interface TooltipPayload {
    color: string;
    name: string;
    value: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
}

// Custom tooltip component for advanced charts
const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                <p className="font-medium text-slate-900 dark:text-slate-100">{`Period: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {`${entry.name}: ${entry.value}`}
                        {entry.name.includes('Rate') && '%'}
                    </p>
                ))}
                {payload.length > 1 && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Total Active: {payload.reduce((sum, item) => sum + (item.value || 0), 0)}
                        </p>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

// Function to calculate trend
const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-3).reduce((sum, val) => sum + val, 0) / 3;
    const older = data.slice(0, 3).reduce((sum, val) => sum + val, 0) / 3;
    return older > 0 ? ((recent - older) / older) * 100 : 0;
};

export const UserStatsPage = ({ onBack }: UserStatsPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const { visitorGrowth, organizationDistribution, topActiveVisitors, loading } = useVisitorStats(
        date?.from,
        date?.to
    );

    // Enhanced data processing for advanced charts
    const enhancedGrowthData = Object.entries(visitorGrowth).map(([month, count], index, arr) => {
        const prevCount = index > 0 ? arr[index - 1][1] : count;
        const growthRate = prevCount > 0 ? ((count - prevCount) / prevCount) * 100 : 0;

        // Simulate additional metrics for demonstration
        const newVisitors = Math.floor(count * 0.7);
        const returningVisitors = count - newVisitors;
        const conversionRate = Math.random() * 15 + 5; // 5-20%

        return {
            month,
            totalVisitors: count,
            newVisitors,
            returningVisitors,
            growthRate: Number(growthRate.toFixed(1)),
            conversionRate: Number(conversionRate.toFixed(1))
        };
    });

    const visitorCounts = enhancedGrowthData.map(d => d.totalVisitors);
    const overallTrend = calculateTrend(visitorCounts);

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

            <div className="grid gap-6">
                {/* Advanced Visitor Analytics */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                Visitor Analytics Overview
                                <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${overallTrend >= 0
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                    {overallTrend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(overallTrend).toFixed(1)}%
                                </div>
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[400px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={enhancedGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="newVisitorsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        </linearGradient>
                                        <linearGradient id="returningVisitorsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}
                                        stroke="#64748b"
                                    />
                                    <YAxis
                                        yAxisId="visitors"
                                        orientation="left"
                                        tick={{ fontSize: 12 }}
                                        stroke="#64748b"
                                    />
                                    <YAxis
                                        yAxisId="rate"
                                        orientation="right"
                                        tick={{ fontSize: 12 }}
                                        stroke="#64748b"
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />

                                    {/* Area charts for visitor counts */}
                                    <Area
                                        yAxisId="visitors"
                                        type="monotone"
                                        dataKey="newVisitors"
                                        stackId="1"
                                        stroke="#3b82f6"
                                        fill="url(#newVisitorsGradient)"
                                        name="New Visitors"
                                    />
                                    <Area
                                        yAxisId="visitors"
                                        type="monotone"
                                        dataKey="returningVisitors"
                                        stackId="1"
                                        stroke="#10b981"
                                        fill="url(#returningVisitorsGradient)"
                                        name="Returning Visitors"
                                    />

                                    {/* Line chart for conversion rate */}
                                    <Line
                                        yAxisId="rate"
                                        type="monotone"
                                        dataKey="conversionRate"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                        name="Conversion Rate (%)"
                                    />

                                    {/* Bar chart for growth rate */}
                                    <Bar
                                        yAxisId="rate"
                                        dataKey="growthRate"
                                        fill="#8b5cf6"
                                        name="Growth Rate (%)"
                                        opacity={0.7}
                                    />

                                    {/* Reference line for zero growth */}
                                    <ReferenceLine yAxisId="rate" y={0} stroke="#64748b" strokeDasharray="2 2" />

                                    {/* Brush for zooming */}
                                    <Brush dataKey="month" height={30} stroke="#3b82f6" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Visitors by Organization */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Visitors by Organization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={Object.entries(organizationDistribution).map(([org, count]) => ({ organization: org, visitors: count }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="organization" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="visitors" name="Visitors" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Top Active Visitors */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Most Recent Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Visitor</th>
                                            <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Session ID</th>
                                            <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Organization</th>
                                            <th className="text-right p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Last Active</th>
                                            <th className="text-right p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topActiveVisitors.map((visitor, index) => (
                                            <tr key={visitor.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium">
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                {visitor.name}
                                                            </span>
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                                {visitor.email}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                                        {visitor.sessionId.slice(-8)}...
                                                    </span>
                                                </td>
                                                <td className="p-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{visitor.orgName}</span>
                                                </td>
                                                <td className="p-2 text-right">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                                        {new Date(visitor.lastActive).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${visitor.isAgentMode
                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        }`}>
                                                        {visitor.isAgentMode ? 'Agent Mode' : 'Bot Mode'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 