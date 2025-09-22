import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw } from 'lucide-react';
import AdminAPI, {
    // MarketplaceAnalytics,
    // UserAnalytics,
} from '@/services/api';
// import { AnalyticsTab } from './components/AnalyticsTab';
import Header from './components/Header';

const AnalyticsPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    // const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<MarketplaceAnalytics | null>(null);
    // const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
    // const [loading, setLoading] = useState({
    //     marketplace: true,
    //     userAnalytics: true,
    //     analytics: true
    // });

    const fetchingRef = useRef(false);

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

    const fetchAnalyticsData = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        
        try {
            const [
                marketplaceResult,
                userAnalyticsResult
            ] = await Promise.allSettled([
                AdminAPI.getMarketplaceAnalytics(),
                AdminAPI.getUserAnalytics()
            ]);

            if (marketplaceResult.status === 'fulfilled') {
                // setMarketplaceAnalytics(marketplaceResult.value);
            } else {
                console.error('Marketplace analytics error:', marketplaceResult.reason);
            }
            
            if (userAnalyticsResult.status === 'fulfilled') {
                // setUserAnalytics(userAnalyticsResult.value);
            } else {
                console.error('User analytics error:', userAnalyticsResult.reason);
            }

        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            // setLoading({
            //     marketplace: false,
            //     userAnalytics: false,
            //     analytics: false
            // });
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
            fetchAnalyticsData();
        }
    }, [authChecked, isAuthenticated, fetchAnalyticsData]);

    const handleRefresh = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }
        
        setRefreshing(true);
        await fetchAnalyticsData();
        setRefreshing(false);
    }, [fetchAnalyticsData, isAuthenticated]);

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
            <Header/>
            <Layout.Body className='max-w-[2000px] mx-auto'>
                <div className='mb-2 flex items-center justify-between space-y-2'>
                    <div className=''>
                        <h2 className='text-2xl font-bold tracking-tight'>Analytics</h2>
                        <p className='text-muted-foreground'>
                            Detailed analytics and insights for your metaverse platform.
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
                    {/* <AnalyticsTab
                        marketplaceAnalytics={marketplaceAnalytics}
                        userAnalytics={userAnalytics}
                        loading={loading}
                    /> */}
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default AnalyticsPage;