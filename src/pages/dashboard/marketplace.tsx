import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download } from 'lucide-react';
import AdminAPI, { MarketplaceAnalytics } from '@/services/api';
import { downloadCSV, generateCSV } from './utils';
import Header from './components/Header';

const MarketplacePage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [marketplaceAnalytics, setMarketplaceAnalytics] = useState<MarketplaceAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

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

    const fetchMarketplaceData = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        setLoading(true);
        
        try {
            const marketplaceData = await AdminAPI.getMarketplaceAnalytics();
            setMarketplaceAnalytics(marketplaceData);
        } catch (error) {
            console.error('Error fetching marketplace data:', error);
        } finally {
            setLoading(false);
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
            fetchMarketplaceData();
        }
    }, [authChecked, isAuthenticated, fetchMarketplaceData]);

    const handleRefresh = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }
        
        setRefreshing(true);
        await fetchMarketplaceData();
        setRefreshing(false);
    }, [fetchMarketplaceData, isAuthenticated]);

    const handleExport = () => {
        if (!marketplaceAnalytics) return;
        
        const data = [{
            total_volume: marketplaceAnalytics.total_volume,
            active_listings: marketplaceAnalytics.active_listings,
            total_sales: marketplaceAnalytics.total_sales || 0,
            average_price: marketplaceAnalytics.average_price || 0
        }];
        
        const csvData = generateCSV(data);
        downloadCSV(csvData, 'marketplace_analytics.csv');
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
                        <h2 className='text-2xl font-bold tracking-tight'>Marketplace</h2>
                        <p className='text-muted-foreground'>
                            Monitor marketplace activity, sales, and trading volume.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                        <Button onClick={handleExport} disabled={!marketplaceAnalytics}>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Marketplace Analytics</h3>
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading marketplace data...</span>
                        </div>
                    ) : !marketplaceAnalytics ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No marketplace data available</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-sm text-muted-foreground">Total Volume</h4>
                                <p className="text-2xl font-bold">{marketplaceAnalytics.total_volume} ETH</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-sm text-muted-foreground">Active Listings</h4>
                                <p className="text-2xl font-bold">{marketplaceAnalytics.active_listings}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-sm text-muted-foreground">Total Sales</h4>
                                <p className="text-2xl font-bold">{marketplaceAnalytics.total_sales || 0}</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h4 className="font-medium text-sm text-muted-foreground">Average Price</h4>
                                <p className="text-2xl font-bold">{marketplaceAnalytics.average_price || 0} ETH</p>
                            </div>
                        </div>
                    )}
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default MarketplacePage;