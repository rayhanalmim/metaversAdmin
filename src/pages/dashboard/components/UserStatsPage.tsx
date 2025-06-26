import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Calendar } from 'lucide-react';
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
    LineChart,
    Line
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

export const UserStatsPage = ({ onBack }: UserStatsPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined);

    const { visitorGrowth, organizationDistribution, topActiveVisitors, loading } = useVisitorStats(
        date?.from,
        date?.to
    );

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
                {/* Visitor Growth Over Time */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Visitor Growth Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={Object.entries(visitorGrowth).map(([month, count]) => ({ month, visitors: count }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="visitors"
                                        name="Registered Visitors"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                    />
                                </LineChart>
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