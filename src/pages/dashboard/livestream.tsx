/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Plus, Edit, Trash2, Eye, EyeOff, Video, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import AdminAPI, { LiveStream, LiveStreamStats } from '@/services/api';
import Header from './components/Header';

// Add custom styles for mobile responsiveness
const customStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  @media (min-width: 475px) {
    .xs\\:inline { display: inline !important; }
    .xs\\:hidden { display: none !important; }
  }
  
  @media (max-width: 474px) {
    .xs\\:inline { display: none !important; }
    .xs\\:hidden { display: inline !important; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = customStyles;
  if (!document.head.querySelector('[data-livestream-styles]')) {
    styleElement.setAttribute('data-livestream-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const LiveStreamPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [streams, setStreams] = useState<LiveStream[]>([]);
    const [stats, setStats] = useState<LiveStreamStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [streamsPerPage] = useState(10);
    
    // Form states
    const [formData, setFormData] = useState({
        title: '',
        youtube_url: '',
        description: '',
        is_active: true
    });
    const [editingStream, setEditingStream] = useState<LiveStream | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

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

    const fetchStreams = useCallback(async () => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;

        try {
            // Fetch all streams without pagination for client-side filtering
            const data = await AdminAPI.getAllLiveStreams(1, 100, '');
            setStreams(data.streams || []);
        } catch (error) {
            console.error('Error fetching streams:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch live streams',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const data = await AdminAPI.getLiveStreamStats();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stream stats:', error);
        }
    }, []);

    const handleCreateOrUpdate = async () => {
        setFormLoading(true);
        
        try {
            if (editingStream) {
                await AdminAPI.updateLiveStream(editingStream.id, formData);
                if (formData.is_active) {
                    toast({
                        title: 'Stream Updated & Activated',
                        description: 'Stream updated successfully. All other streams have been deactivated.',
                    });
                } else {
                    toast({
                        title: 'Stream Updated',
                        description: 'Live stream updated successfully',
                    });
                }
            } else {
                await AdminAPI.createLiveStream(formData);
                if (formData.is_active) {
                    toast({
                        title: 'Stream Created & Activated',
                        description: 'Stream created successfully and is now active. All other streams have been deactivated.',
                    });
                } else {
                    toast({
                        title: 'Stream Created',
                        description: 'Live stream created successfully',
                    });
                }
            }
            
            setDialogOpen(false);
            resetForm();
            fetchStreams();
            fetchStats();
        } catch (error) {
            console.error('Error saving stream:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save live stream',
                variant: 'destructive',
            });
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await AdminAPI.deleteLiveStream(id);
            toast({
                title: 'Success',
                description: 'Live stream deleted successfully',
            });
            fetchStreams();
            fetchStats();
        } catch (error) {
            console.error('Error deleting stream:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to delete live stream',
                variant: 'destructive',
            });
        }
    };

    const handleToggleActive = async (id: number) => {
        try {
            const updatedStream = await AdminAPI.toggleLiveStream(id);
            if (updatedStream.is_active) {
                toast({
                    title: 'Stream Activated',
                    description: 'This stream is now active. All other streams have been automatically deactivated.',
                });
            } else {
                toast({
                    title: 'Stream Deactivated',
                    description: 'This stream is now inactive.',
                });
            }
            fetchStreams();
            fetchStats();
        } catch (error) {
            console.error('Error toggling stream:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to toggle stream status',
                variant: 'destructive',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            youtube_url: '',
            description: '',
            is_active: true
        });
        setEditingStream(null);
    };

    const openEditDialog = (stream: LiveStream) => {
        setFormData({
            title: stream.title,
            youtube_url: stream.youtube_url,
            description: stream.description || '',
            is_active: stream.is_active
        });
        setEditingStream(stream);
        setDialogOpen(true);
    };

    const openCreateDialog = () => {
        resetForm();
        setDialogOpen(true);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([fetchStreams(), fetchStats()]);
        setRefreshing(false);
    };

    // Filter streams based on search term
    const filteredStreams = streams.filter(stream =>
        stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stream.creator?.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination
    const indexOfLastStream = currentPage * streamsPerPage;
    const indexOfFirstStream = indexOfLastStream - streamsPerPage;
    const currentStreams = filteredStreams.slice(indexOfFirstStream, indexOfLastStream);
    const totalPages = Math.ceil(filteredStreams.length / streamsPerPage);

    const extractVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    // Initial authentication check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Fetch data only after authentication is verified
    useEffect(() => {
        if (authChecked && isAuthenticated) {
            fetchStreams();
            fetchStats();
        }
    }, [authChecked, isAuthenticated, fetchStreams, fetchStats]);

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Layout>
                <Layout.Body>
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Authentication Required
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Please log in to access the Live Stream management.
                            </p>
                        </div>
                    </div>
                </Layout.Body>
            </Layout>
        );
    }

    return (
        <Layout>
            <Layout.Body className="space-y-4 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <Header />
                    </div>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                            <Card className="min-h-[100px]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Streams</CardTitle>
                                    <Video className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl sm:text-2xl font-bold">{stats.totalStreams}</div>
                                </CardContent>
                            </Card>
                            
                            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 min-h-[100px]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200 truncate">Active Streams</CardTitle>
                                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">{stats.activeStreams}</div>
                                </CardContent>
                            </Card>
                            
                            <Card className="min-h-[100px]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Views</CardTitle>
                                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl sm:text-2xl font-bold">{stats.totalViews}</div>
                                </CardContent>
                            </Card>
                            
                            <Card className="min-h-[100px]">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs sm:text-sm font-medium truncate">Recent Activity</CardTitle>
                                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-xl sm:text-2xl font-bold">{stats.recentStreams.length}</div>
                                    <p className="text-xs text-muted-foreground">Recent streams</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 sm:flex-none">
                            <Input
                                placeholder="Search streams..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full sm:w-[280px] md:w-[300px]"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex-1 sm:flex-none"
                            >
                                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                <span className="hidden xs:inline">Refresh</span>
                                <span className="xs:hidden">↻</span>
                            </Button>
                            
                            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" onClick={openCreateDialog} className="flex-1 sm:flex-none">
                                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                        <span className="hidden xs:inline">Add Stream</span>
                                        <span className="xs:hidden">Add</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-[90vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader className="space-y-2">
                                        <DialogTitle className="text-lg sm:text-xl">
                                            {editingStream ? 'Edit Live Stream' : 'Create New Live Stream'}
                                        </DialogTitle>
                                        <DialogDescription className="text-sm">
                                            {editingStream 
                                                ? 'Update the live stream details below.'
                                                : 'Add a new YouTube live stream for your metaverse world.'
                                            }
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                                placeholder="Enter stream title"
                                            />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="youtube_url">YouTube URL</Label>
                                            <Input
                                                id="youtube_url"
                                                value={formData.youtube_url}
                                                onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                                                placeholder="https://www.youtube.com/watch?v=..."
                                            />
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                placeholder="Enter stream description (optional)"
                                                rows={3}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id="is_active"
                                                    checked={formData.is_active}
                                                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                                                />
                                                <Label htmlFor="is_active">Set as active stream</Label>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                ⚠️ Only one stream can be active at a time. Activating this stream will automatically deactivate all others.
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreateOrUpdate} disabled={formLoading}>
                                            {formLoading ? 'Saving...' : (editingStream ? 'Update' : 'Create')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Streams List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Streams</CardTitle>
                            <CardDescription>Manage YouTube live streams for your metaverse world</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : currentStreams.length === 0 ? (
                                <div className="text-center p-6 sm:p-8">
                                    <Video className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-base sm:text-lg font-semibold mb-2">No streams found</h3>
                                    <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
                                        {searchTerm ? 'No streams match your search criteria.' : 'Get started by creating your first live stream.'}
                                    </p>
                                    {!searchTerm && (
                                        <Button onClick={openCreateDialog} size="sm">
                                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                            <span className="text-sm sm:text-base">Add Stream</span>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentStreams.map((stream) => {
                                        const videoId = extractVideoId(stream.youtube_url);
                                        const thumbnailUrl = videoId 
                                            ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                                            : null;
                                            
                                        return (
                                            <div key={stream.id} className={`border rounded-lg p-3 sm:p-4 space-y-3 transition-colors ${
                                                stream.is_active 
                                                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                                                    : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                                            }`}>
                                                {/* Mobile Layout */}
                                                <div className="sm:hidden space-y-3">
                                                    <div className="flex items-start space-x-3">
                                                        {thumbnailUrl && (
                                                            <img
                                                                src={thumbnailUrl}
                                                                alt={stream.title}
                                                                className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded flex-shrink-0"
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h3 className={`font-semibold text-sm sm:text-base truncate ${
                                                                    stream.is_active 
                                                                        ? 'text-green-800 dark:text-green-200' 
                                                                        : 'text-red-800 dark:text-red-200'
                                                                }`}>{stream.title}</h3>
                                                                <Badge 
                                                                    variant={stream.is_active ? "default" : "secondary"}
                                                                    className={`text-xs flex-shrink-0 ${
                                                                        stream.is_active 
                                                                            ? 'bg-green-600 text-white hover:bg-green-700' 
                                                                            : 'bg-red-600 text-white hover:bg-red-700'
                                                                    }`}
                                                                >
                                                                    {stream.is_active ? 'Active' : 'Inactive'}
                                                                </Badge>
                                                            </div>
                                                            {stream.description && (
                                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{stream.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                        <span>Views: {stream.view_count}</span>
                                                        <span>•</span>
                                                        <span>{new Date(stream.created_at).toLocaleDateString()}</span>
                                                        {stream.creator && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{stream.creator.username}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.open(stream.youtube_url, '_blank')}
                                                            className="flex-1"
                                                        >
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleActive(stream.id)}
                                                            className="flex-1"
                                                        >
                                                            {stream.is_active ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                                                            {stream.is_active ? 'Hide' : 'Show'}
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openEditDialog(stream)}
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm">
                                                                    <Trash2 className="h-3 w-3" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="mx-4 w-[calc(100vw-2rem)] max-w-[90vw] sm:max-w-md">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-lg">Delete Stream</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-sm">
                                                                        Are you sure you want to delete "{stream.title}"? This action cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                                                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(stream.id)} className="w-full sm:w-auto">
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>

                                                {/* Desktop Layout */}
                                                <div className="hidden sm:block">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex space-x-4">
                                                            {thumbnailUrl && (
                                                                <img
                                                                    src={thumbnailUrl}
                                                                    alt={stream.title}
                                                                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                                                                />
                                                            )}
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <h3 className={`font-semibold ${
                                                                        stream.is_active 
                                                                            ? 'text-green-800 dark:text-green-200' 
                                                                            : 'text-red-800 dark:text-red-200'
                                                                    }`}>{stream.title}</h3>
                                                                    <Badge 
                                                                        variant={stream.is_active ? "default" : "secondary"}
                                                                        className={
                                                                            stream.is_active 
                                                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                                                : 'bg-red-600 text-white hover:bg-red-700'
                                                                        }
                                                                    >
                                                                        {stream.is_active ? 'Active' : 'Inactive'}
                                                                    </Badge>
                                                                </div>
                                                                {stream.description && (
                                                                    <p className="text-sm text-muted-foreground">{stream.description}</p>
                                                                )}
                                                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                                    <span>Views: {stream.view_count}</span>
                                                                    <span>Created: {new Date(stream.created_at).toLocaleDateString()}</span>
                                                                    {stream.creator && (
                                                                        <span>By: {stream.creator.username}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => window.open(stream.youtube_url, '_blank')}
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </Button>
                                                            
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleToggleActive(stream.id)}
                                                            >
                                                                {stream.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </Button>
                                                            
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditDialog(stream)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" size="sm">
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete Stream</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{stream.title}"? This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={() => handleDelete(stream.id)}>
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    
                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                                            <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                                                Showing {indexOfFirstStream + 1} to {Math.min(indexOfLastStream, filteredStreams.length)} of {filteredStreams.length} streams
                                            </div>
                                            <div className="flex items-center gap-2 order-1 sm:order-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-2 sm:px-3"
                                                >
                                                    <span className="hidden xs:inline">Previous</span>
                                                    <span className="xs:hidden">‹</span>
                                                </Button>
                                                <span className="text-xs sm:text-sm px-2 py-1 bg-muted rounded">
                                                    {currentPage} / {totalPages}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-2 sm:px-3"
                                                >
                                                    <span className="hidden xs:inline">Next</span>
                                                    <span className="xs:hidden">›</span>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default LiveStreamPage;
