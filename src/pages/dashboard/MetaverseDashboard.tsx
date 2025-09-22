import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminAPI from '@/services/api';
import { 
    Users, 
    Wallet, 
    Package, 
    Trophy, 
    Activity, 
    TrendingUp,
    RefreshCw
} from 'lucide-react';
import { SidebarNav } from '@/components/SidebarNav';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Button } from '@/components/custom/button';

interface DashboardStats {
    totalUsers: number;
    totalWallets: number;
    totalItems: number;
    totalNFTs: number;
    recentActivity: {
        description: string;
        timestamp: string;
        event: string;
        user: string;
        item?: string;
        nft?: string;
    }[];
}

const MetaverseDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalWallets: 0,
        totalItems: 0,
        totalNFTs: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await AdminAPI.getDashboardStats();
            setStats({
                totalUsers: data.totalUsers,
                totalWallets: data.totalWallets,
                totalItems: data.totalItems,
                totalNFTs: data.totalNFTs,
                recentActivity: []
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }: {
        title: string;
        value: number;
        icon: React.ElementType;
        color: string;
    }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
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
            <SidebarNav />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Metaverse Dashboard</h1>
                <Button onClick={fetchDashboardData} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="text-blue-600"
                />
                <StatCard
                    title="Connected Wallets"
                    value={stats.totalWallets}
                    icon={Wallet}
                    color="text-green-600"
                />
                <StatCard
                    title="Virtual Items"
                    value={stats.totalItems}
                    icon={Package}
                    color="text-purple-600"
                />
                <StatCard
                    title="NFTs"
                    value={stats.totalNFTs}
                    icon={Trophy}
                    color="text-yellow-600"
                />
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span>Database</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Online
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>API Server</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Running
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Blockchain Connection</span>
                                        <Badge variant="default" className="bg-green-100 text-green-800">
                                            Connected
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Users className="h-4 w-4 mr-2" />
                                    View All Users
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Activity className="h-4 w-4 mr-2" />
                                    System Logs
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <TrendingUp className="h-4 w-4 mr-2" />
                                    Analytics
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                User management features will be implemented here.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {stats.recentActivity.length > 0 ? (
                                <div className="space-y-2">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                                            <Activity className="h-4 w-4" />
                                            <span>{activity.description || 'Activity logged'}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No recent activity</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MetaverseDashboard;