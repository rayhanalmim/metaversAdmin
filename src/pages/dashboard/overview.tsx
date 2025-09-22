import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download } from 'lucide-react';
import AdminAPI, {
    MetaverseDashboardStats,
    MetaverseRealtimeStats,
    MarketplaceAnalytics,
    UserAnalytics,
} from '@/services/api';

import { MetaverseOverviewTab } from './components/MetaverseOverviewTab';
import { UserStatsPage } from './components/UserStatsPage';
import { RevenueStatsPage } from './components/RevenueStatsPage';
import { Search } from '@/components/search';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import Header from './components/Header';

const OverviewPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [showUserStats, setShowUserStats] = useState(false);
    const [showRevenueStats, setShowRevenueStats] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    // State for API data
    const [dashboardStats, setDashboardStats] = useState<MetaverseDashboardStats | null>(null);
    const [realtimeStats, setRealtimeStats] = useState<MetaverseRealtimeStats | null>(null);
    const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<MarketplaceAnalytics | null>(null);
    const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);

    // Loading states
    const [loading, setLoading] = useState({
        dashboard: true,
        realtime: true,
        marketplace: true,
        userAnalytics: true,
    });

    // Refs to prevent multiple simultaneous API calls
    const fetchingRef = useRef(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check authentication status
    const checkAuth = useCallback(async () => {
        try {
            const isAuth = await AdminAPI.verifySession();
            setIsAuthenticated(isAuth);
            setAuthChecked(true);
            return isAuth;
        } catch (error) {
            console.error('Auth check failed:', error);
            setIsAuthenticated(false);
            setAuthChecked(true);
            return false;
        }
    }, []);

    const fetchOverviewData = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        
        try {
            const [
                dashboardResult,
                realtimeResult,
                marketplaceResult,
                userAnalyticsResult
            ] = await Promise.allSettled([
                AdminAPI.getDashboardStats(),
                AdminAPI.getRealtimeStats(),
                AdminAPI.getMarketplaceAnalytics(),
                AdminAPI.getUserAnalytics()
            ]);

            if (dashboardResult.status === 'fulfilled') {
                setDashboardStats(dashboardResult.value);
            }
            
            if (realtimeResult.status === 'fulfilled') {
                setRealtimeStats(realtimeResult.value);
            }
            
            if (marketplaceResult.status === 'fulfilled') {
                setMarketplaceAnalytics(marketplaceResult.value);
            }
            
            if (userAnalyticsResult.status === 'fulfilled') {
                setUserAnalytics(userAnalyticsResult.value);
            }

        } catch (error) {
            console.error('Error fetching overview data:', error);
        } finally {
            setLoading({
                dashboard: false,
                realtime: false,
                marketplace: false,
                userAnalytics: false,
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
        if (authChecked && isAuthenticated) {
            fetchOverviewData();
        }
    }, [authChecked, isAuthenticated, fetchOverviewData]);

    // Set up periodic refresh for realtime data
    useEffect(() => {
        if (!authChecked || !isAuthenticated) {
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            if (!fetchingRef.current) {
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
        }, 60000);

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
        await fetchOverviewData();
        setRefreshing(false);
    }, [fetchOverviewData, isAuthenticated]);

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
                        <h2 className='text-2xl font-bold tracking-tight'>Overview</h2>
                        <p className='text-muted-foreground'>
                            Welcome to your Metaverse Analytics Hub - Monitor users, NFTs, marketplace activity, and virtual world insights in real-time.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-4">
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
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default OverviewPage;