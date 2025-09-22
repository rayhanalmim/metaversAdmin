import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download } from 'lucide-react';
import AdminAPI, { MetaverseNFT } from '@/services/api';
import { downloadCSV, generateCSV } from './utils';
import Header from './components/Header';

const NFTsPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [nfts, setNFTs] = useState<MetaverseNFT[]>([]);
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

    const fetchNFTs = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        setLoading(true);
        
        try {
            const nftsData = await AdminAPI.getAllNFTs();
            setNFTs(nftsData);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
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
            fetchNFTs();
        }
    }, [authChecked, isAuthenticated, fetchNFTs]);

    const handleRefresh = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }
        
        setRefreshing(true);
        await fetchNFTs();
        setRefreshing(false);
    }, [fetchNFTs, isAuthenticated]);

    const handleExport = () => {
        const data = nfts.map(nft => ({
            id: nft.id,
            token_address: nft.token_address,
            token_id: nft.token_id,
            owner: nft.owner,
            price: nft.selling?.price || 'Not for sale',
            is_listed: nft.selling ? 'Yes' : 'No',
            created_at: new Date(nft.created_at * 1000).toISOString()
        }));
        
        const csvData = generateCSV(data);
        downloadCSV(csvData, 'metaverse_nfts.csv');
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
                        <h2 className='text-2xl font-bold tracking-tight'>NFTs</h2>
                        <p className='text-muted-foreground'>
                            Monitor and manage NFT collections in the metaverse marketplace.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                        <Button onClick={handleExport} disabled={nfts.length === 0}>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">NFT Collection</h3>
                    <div className="grid gap-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-32">
                                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                                <span>Loading NFTs...</span>
                            </div>
                        ) : nfts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No NFTs found</p>
                            </div>
                        ) : (
                            nfts.map(nft => (
                                <div key={nft.token_id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">{nft.name || `NFT #${nft.token_id}`}</h4>
                                            <p className="text-sm text-muted-foreground">Token ID: {nft.token_id}</p>
                                            <p className="text-sm text-muted-foreground">Collection: {nft.collection_name || 'N/A'}</p>
                                            <p className="text-sm text-muted-foreground">Owner: {nft.owner}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {nft.selling ? `${nft.selling.price} ETH` : 'Not for sale'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {nft.selling ? 'Listed' : 'Unlisted'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Created: {new Date(nft.created_at * 1000).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default NFTsPage;