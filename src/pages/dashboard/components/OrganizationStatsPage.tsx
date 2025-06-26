import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useOrganizationStats } from '@/hooks/useAdminData';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface OrganizationStatsPageProps {
    onBack: () => void;
}

export const OrganizationStatsPage = ({ onBack }: OrganizationStatsPageProps) => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    const { totalOrganizations, tierDistribution, statusDistribution, topOrganizations, loading } = useOrganizationStats(
        date?.from,
        date?.to
    );

    console.log('date', totalOrganizations);

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
                                <span>Pick a date range</span>
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
                {/* Organization Distribution by Tier */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Organizations by Subscription Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={Object.entries(tierDistribution).map(([tier, count]) => ({ tier, count }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="tier" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="Organizations" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Organization Status Distribution */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Organizations by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="h-[300px] flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={Object.entries(statusDistribution).map(([status, count]) => ({ status, count }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="status" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" name="Organizations" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Top Organizations */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle>Top Organizations by Usage</CardTitle>
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
                                            <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Organization</th>
                                            <th className="text-left p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Tier</th>
                                            <th className="text-right p-2 text-xs font-medium text-slate-600 dark:text-slate-400">Total Conversations</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topOrganizations.map((org, index) => (
                                            <tr key={org.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium">
                                                            {index + 1}
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{org.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{org.subscription_tier || 'Free'}</span>
                                                </td>
                                                <td className="p-2 text-right">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">{org.total_conversations}</span>
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