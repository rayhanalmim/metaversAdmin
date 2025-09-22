import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download } from 'lucide-react';
import AdminAPI, {
    MetaverseDashboardStats,
    MetaverseRealtimeStats,
    MetaverseUser,
    MetaverseNFT,
    MarketplaceAnalytics,
    UserAnalytics,
} from '@/services/api';

import { MetaverseOverviewTab } from './components/MetaverseOverviewTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { PropertyAssignmentPage } from './components/PropertyAssignmentPage';
import { RevenueStatsPage } from './components/RevenueStatsPage';
import { downloadCSV, generateCSV, formatDateTime } from './utils';
import Header from './components/Header';

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [refreshing, setRefreshing] = useState(false);
    const [showUserStats, setShowUserStats] = useState(false);
    const [showRevenueStats, setShowRevenueStats] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    console.log('📊 [DASHBOARD] Component render:', {
        isAuthenticated,
        authChecked,
        activeTab
    });

    // State for API data
    const [dashboardStats, setDashboardStats] = useState<MetaverseDashboardStats | null>(null);
    const [realtimeStats, setRealtimeStats] = useState<MetaverseRealtimeStats | null>(null);
    const [users, setUsers] = useState<MetaverseUser[]>([]);
    const [nfts, setNFTs] = useState<MetaverseNFT[]>([]);
    const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<MarketplaceAnalytics | null>(null);
    const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);

    // Loading states
    const [loading, setLoading] = useState({
        dashboard: true,
        realtime: true,
        users: true,
        nfts: true,
        marketplace: true,
        userAnalytics: true,
        analytics: true
    });

    // Remove organization-related state as it's not needed for metaverse dashboard
    const [selectedUser, setSelectedUser] = useState<MetaverseUser | null>(null);

    // Refs to prevent multiple simultaneous API calls
    const fetchingRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check authentication status
    const checkAuth = useCallback(async () => {
        console.log('📊 [DASHBOARD] Starting auth check...');
        
        try {
            const isAuth = await AdminAPI.verifySession();
            console.log('📊 [DASHBOARD] Auth check result:', isAuth);
            
            setIsAuthenticated(isAuth);
            setAuthChecked(true);
            
            if (!isAuth) {
                console.log('📊 [DASHBOARD] ❌ Not authenticated - will redirect');
            } else {
                console.log('📊 [DASHBOARD] ✅ Authenticated successfully');
            }
            
            return isAuth;
        } catch (error) {
            console.error('📊 [DASHBOARD] ❌ Auth check failed:', error);
            setIsAuthenticated(false);
            setAuthChecked(true);
            return false;
        }
    }, []);

    const fetchAllData = useCallback(async () => {
        // Prevent multiple simultaneous calls
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        
        try {
            // Fetch fresh data from metaverse API endpoints
            const [
                dashboardResult,
                realtimeResult,
                usersResult,
                nftsResult,
                marketplaceResult,
                userAnalyticsResult
            ] = await Promise.allSettled([
                AdminAPI.getDashboardStats(),
                AdminAPI.getRealtimeStats(),
                AdminAPI.getAllUsers(),
                AdminAPI.getAllNFTs(),
                AdminAPI.getMarketplaceAnalytics(),
                AdminAPI.getUserAnalytics()
            ]);

            // Update state with successful results
            if (dashboardResult.status === 'fulfilled') {
                setDashboardStats(dashboardResult.value);
            } else {
                console.error('Dashboard stats error:', dashboardResult.reason);
            }
            
            if (realtimeResult.status === 'fulfilled') {
                setRealtimeStats(realtimeResult.value);
            } else {
                console.error('Realtime stats error:', realtimeResult.reason);
            }
            
            if (usersResult.status === 'fulfilled') {
                setUsers(usersResult.value);
            } else {
                console.error('Users fetch error:', usersResult.reason);
            }
            
            if (nftsResult.status === 'fulfilled') {
                setNFTs(nftsResult.value);
            } else {
                console.error('NFTs fetch error:', nftsResult.reason);
            }
            
            if (marketplaceResult.status === 'fulfilled') {
                setMarketplaceAnalytics(marketplaceResult.value);
            } else {
                console.error('Marketplace analytics error:', marketplaceResult.reason);
            }
            
            if (userAnalyticsResult.status === 'fulfilled') {
                setUserAnalytics(userAnalyticsResult.value);
            } else {
                console.error('User analytics error:', userAnalyticsResult.reason);
            }

        } catch (error) {
            console.error('Error fetching metaverse dashboard data:', error);
        } finally {
            setLoading({
                dashboard: false,
                realtime: false,
                users: false,
                nfts: false,
                marketplace: false,
                userAnalytics: false,
                analytics: false
            });
            fetchingRef.current = false;
        }
    }, [isAuthenticated]);
    // Initial authentication check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Fetch data only after authentication is verified
    useEffect(() => {
        console.log('📊 [DASHBOARD] Data fetch effect:', {
            authChecked,
            isAuthenticated,
            shouldFetch: authChecked && isAuthenticated
        });
        
        if (authChecked && isAuthenticated) {
            console.log('📊 [DASHBOARD] ✅ Fetching dashboard data...');
            fetchAllData();
        } else if (authChecked && !isAuthenticated) {
            console.log('📊 [DASHBOARD] ❌ Not authenticated - skipping data fetch');
        }
    }, [authChecked, isAuthenticated, fetchAllData]);

    // Set up periodic refresh for realtime data only
    useEffect(() => {
        if (!authChecked || !isAuthenticated) {
            return;
        }

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set up a more conservative refresh interval (60 seconds instead of 30)
        intervalRef.current = setInterval(() => {
            if (!fetchingRef.current) {
                // Only fetch realtime stats and dashboard stats for periodic updates
                Promise.allSettled([
                    AdminAPI.getRealtimeStats(),
                    AdminAPI.getDashboardStats()
                ]).then(([realtimeResult, dashboardResult]) => {
                    if (realtimeResult.status === 'fulfilled') {
                        setRealtimeStats(realtimeResult.value);
                    }
                    if (dashboardResult.status === 'fulfilled') {
                        setDashboardStats(dashboardResult.value);
                    }
                }).catch(error => {
                    console.error('Periodic refresh error:', error);
                });
            }
        }, 60000); // 60 seconds

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [authChecked, isAuthenticated]);

    const handleRefresh = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }
        
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    }, [fetchAllData, isAuthenticated]);

    const handleUserClick = (user: MetaverseUser) => {
        setSelectedUser(user);
    };

    const handleBackToUsers = () => {
        setSelectedUser(null);
    };

    const handleExport = () => {
        let data;
        let filename;

        // Export metaverse data based on active tab
        switch (activeTab) {
            case 'users':
                data = users.map(user => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    wallet_address: user.wallet_address,
                    last_room: user.last_room,
                    avatar_name: user.avatar?.name || 'N/A',
                    last_login: formatDateTime(user.last_login_time),
                    created_at: formatDateTime(user.created_at)
                }));
                filename = 'metaverse_users.csv';
                break;
            case 'nfts':
                data = nfts.map(nft => ({
                    id: nft.id,
                    token_address: nft.token_address,
                    token_id: nft.token_id,
                    owner: nft.owner,
                    price: nft.selling?.price || 'Not for sale',
                    is_listed: nft.selling ? 'Yes' : 'No',
                    created_at: new Date(nft.created_at * 1000).toISOString()
                }));
                filename = 'metaverse_nfts.csv';
                break;
            case 'marketplace':
                data = marketplaceAnalytics ? [{
                    total_volume: marketplaceAnalytics.total_volume,
                    active_listings: marketplaceAnalytics.active_listings,
                    total_sales: marketplaceAnalytics.total_sales || 0,
                    average_price: marketplaceAnalytics.average_price || 0
                }] : [];
                filename = 'marketplace_analytics.csv';
                break;
            default:
                return;
        }

        const csvData = generateCSV(data);
        downloadCSV(csvData, filename);
    };

    // Show loading screen while checking authentication
    if (!authChecked) {
        return (
            <Layout>
                <Layout.Body>
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p>Checking authentication...</p>
                        </div>
                    </div>
                </Layout.Body>
            </Layout>
        );
    }

    return (
        <Layout>
            <Header />

            <Layout.Body className='max-w-[2000px] mx-auto'>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div className=''>
                        <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
                        <p className='text-muted-foreground'>
                            Welcome to your Metaverse Analytics Hub - Monitor users, NFTs, marketplace activity, and virtual world insights in real-time.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                        <Button onClick={handleExport} disabled={!['users', 'nfts', 'marketplace'].includes(activeTab)}>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                    </div>
                </div>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className='my-3'>
                    <TabsList className='mb-3'>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="users">Users</TabsTrigger>
                        <TabsTrigger value="nfts">NFTs</TabsTrigger>
                        <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                        {showUserStats ? (
                            <UserStatsPage onBack={() => setShowUserStats(false)} />
                        ) : showRevenueStats ? (
                            <RevenueStatsPage onBack={() => setShowRevenueStats(false)} />
                        ) : (
                            <MetaverseOverviewTab
                                dashboardStats={dashboardStats}
                                realtimeStats={realtimeStats}
                                marketplaceAnalytics={marketplaceAnalytics}
                                userAnalytics={userAnalytics}
                                loading={loading}
                                onShowUserStats={() => setShowUserStats(true)}
                                onShowRevenueStats={() => setShowRevenueStats(true)}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="users" className="space-y-4">
                        {selectedUser ? (
                            <PropertyAssignmentPage user={selectedUser} onBack={handleBackToUsers} />
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Metaverse Users</h3>
                                <div className="grid gap-4">
                                    {loading.users ? (
                                        <div>Loading users...</div>
                                    ) : (
                                        users.map(user => (
                                            <div key={user.id} className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50" 
                                                 onClick={() => handleUserClick(user)}>
                                                <h4 className="font-medium">{user.username}</h4>
                                                <p className="text-sm text-gray-600">Avatar: {user.avatar_name || 'N/A'}</p>
                                                <p className="text-sm text-gray-600">NFTs: {user.total_nfts || 0}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="nfts" className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">NFT Collection</h3>
                            <div className="grid gap-4">
                                {loading.nfts ? (
                                    <div>Loading NFTs...</div>
                                ) : (
                                    nfts.map(nft => (
                                        <div key={nft.token_id} className="p-4 border rounded-lg">
                                            <h4 className="font-medium">{nft.name}</h4>
                                            <p className="text-sm text-gray-600">Token ID: {nft.token_id}</p>
                                            <p className="text-sm text-gray-600">Collection: {nft.collection_name || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">Price: {nft.price || 0} ETH</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="marketplace" className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Marketplace Analytics</h3>
                            {loading.marketplace ? (
                                <div>Loading marketplace data...</div>
                            ) : (
                                <div className="grid gap-4">
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium">Total Volume</h4>
                                        <p className="text-2xl font-bold">{marketplaceAnalytics?.total_volume || 0} ETH</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <h4 className="font-medium">Active Listings</h4>
                                        <p className="text-2xl font-bold">{marketplaceAnalytics?.active_listings || 0}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="analytics" className="space-y-4">
                        <AnalyticsTab
                            marketplaceAnalytics={marketplaceAnalytics}
                            userAnalytics={userAnalytics}
                            loadingAnalytics={loading.analytics}
                            dashboardStats={dashboardStats}
                            realtimeStats={realtimeStats}
                        />
                    </TabsContent>
              
                </Tabs>
            </Layout.Body>
        </Layout>
    );
}

export default Dashboard;