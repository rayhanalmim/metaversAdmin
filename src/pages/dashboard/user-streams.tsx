/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Check, X, Trash2, Users, Radio, Clock, Gift, Award } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import AdminAPI from '@/services/api';
import Header from './components/Header';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    live: 'bg-red-600 animate-pulse',
    ended: 'bg-gray-500',
};

const UserStreamsPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [streams, setStreams] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [gifts, setGifts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('');

    // Gift/Sticker form
    const [giftDialogOpen, setGiftDialogOpen] = useState(false);
    const [giftForm, setGiftForm] = useState({ name: '', icon_url: '', sgk_weight: 1, price_usdt: 0 });

    // Review dialog
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [reviewTarget, setReviewTarget] = useState<any>(null);
    const [reviewType, setReviewType] = useState<'application' | 'stream'>('application');
    const [reviewAction, setReviewAction] = useState<'approved' | 'rejected'>('approved');
    const [adminNote, setAdminNote] = useState('');

    const fetchStreams = useCallback(async () => {
        try {
            const data = await AdminAPI.getAllUserStreams(1, 100, statusFilter || undefined);
            setStreams(data?.data?.streams || []);
        } catch (error) {
            console.error('Error fetching user streams:', error);
        }
    }, [statusFilter]);

    const fetchApplications = useCallback(async () => {
        try {
            const data = await AdminAPI.getAllStreamerApplications(1, 100);
            setApplications(data?.data?.applications || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    }, []);

    const fetchGifts = useCallback(async () => {
        try {
            const giftsData = await AdminAPI.getAllGifts();
            setGifts(giftsData?.data || []);
        } catch (error) {
            console.error('Error fetching gifts:', error);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const data = await AdminAPI.getUserStreamStats();
            setStats(data?.data || null);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    const loadAll = useCallback(async () => {
        setLoading(true);
        await Promise.all([fetchStreams(), fetchApplications(), fetchGifts(), fetchStats()]);
        setLoading(false);
    }, [fetchStreams, fetchApplications, fetchGifts, fetchStats]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadAll();
        setRefreshing(false);
    };

    // Stream status update
    const handleStreamStatus = async (id: number, status: string) => {
        try {
            await AdminAPI.updateUserStreamStatus(id, status);
            toast({ title: 'Success', description: `Stream ${status}` });
            fetchStreams();
            fetchStats();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update stream status', variant: 'destructive' });
        }
    };

    const handleDeleteStream = async (id: number) => {
        try {
            await AdminAPI.deleteUserStream(id);
            toast({ title: 'Success', description: 'Stream deleted' });
            fetchStreams();
            fetchStats();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete stream', variant: 'destructive' });
        }
    };

    // Application review
    const openReviewDialog = (target: any, type: 'application' | 'stream', action: 'approved' | 'rejected') => {
        setReviewTarget(target);
        setReviewType(type);
        setReviewAction(action);
        setAdminNote('');
        setReviewDialogOpen(true);
    };

    const handleReview = async () => {
        if (!reviewTarget) return;
        try {
            if (reviewType === 'application') {
                await AdminAPI.reviewStreamerApplication(reviewTarget.id, reviewAction, adminNote || undefined);
                toast({ title: 'Success', description: `Application ${reviewAction}` });
                fetchApplications();
            } else {
                await AdminAPI.updateUserStreamStatus(reviewTarget.id, reviewAction);
                toast({ title: 'Success', description: `Stream ${reviewAction}` });
                fetchStreams();
                fetchStats();
            }
            setReviewDialogOpen(false);
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to review', variant: 'destructive' });
        }
    };

    // Gift CRUD
    const handleCreateGift = async () => {
        if (!giftForm.name.trim()) return;
        try {
            await AdminAPI.createGift({
                name: giftForm.name,
                icon_url: giftForm.icon_url || undefined,
                sgk_weight: giftForm.sgk_weight,
                price_usdt: giftForm.price_usdt,
            });
            toast({ title: 'Success', description: 'Gift created' });
            setGiftForm({ name: '', icon_url: '', sgk_weight: 1, price_usdt: 0 });
            setGiftDialogOpen(false);
            fetchGifts();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create gift', variant: 'destructive' });
        }
    };

    const handleDeleteGift = async (id: number) => {
        try {
            await AdminAPI.deleteGift(id);
            toast({ title: 'Success', description: 'Gift deleted' });
            fetchGifts();
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete gift', variant: 'destructive' });
        }
    };

    if (loading) {
        return (
            <Layout>
                <Layout.Body>
                    <div className="flex items-center justify-center h-full p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        <h2 className='text-2xl font-bold tracking-tight'>User Streams</h2>
                        <p className='text-muted-foreground'>
                            Manage user live streams, streamer applications, and configure gifts.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid gap-3 grid-cols-2 lg:grid-cols-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium">Total Streams</CardTitle>
                                <Radio className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{stats.totalStreams}</div></CardContent>
                        </Card>
                        <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-red-800 dark:text-red-200">Live Now</CardTitle>
                                <Radio className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-red-600">{stats.liveStreams}</div></CardContent>
                        </Card>
                        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-yellow-800 dark:text-yellow-200">Pending</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-500" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.pendingStreams}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium">Total Slots</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{stats.totalSlots}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium">Gifts Sent</CardTitle>
                                <Gift className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold">{stats.totalGifts}</div></CardContent>
                        </Card>
                        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-amber-800 dark:text-amber-200">Total SGK</CardTitle>
                                <Award className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent><div className="text-2xl font-bold text-amber-600">{stats.totalSgk}</div></CardContent>
                        </Card>
                    </div>
                )}

                <Tabs defaultValue="streams" className="my-4">
                    <TabsList>
                        <TabsTrigger value="streams">Streams</TabsTrigger>
                        <TabsTrigger value="applications">
                            Applications
                            {applications.filter(a => a.status === 'pending').length > 0 && (
                                <Badge variant="destructive" className="ml-2 text-xs px-1.5">
                                    {applications.filter(a => a.status === 'pending').length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="gifts">Gifts</TabsTrigger>
                    </TabsList>

                    {/* STREAMS TAB */}
                    <TabsContent value="streams" className="space-y-4 pt-3">
                        <div className="flex gap-2 flex-wrap">
                            {['', 'pending', 'approved', 'live', 'ended', 'rejected'].map((s) => (
                                <Button
                                    key={s}
                                    variant={statusFilter === s ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter(s)}
                                >
                                    {s || 'All'}
                                </Button>
                            ))}
                        </div>

                        {streams.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No streams found</div>
                        ) : (
                            <div className="space-y-3">
                                {streams.map((stream) => (
                                    <Card key={stream.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">{stream.title}</h3>
                                                        <Badge className={`${statusColors[stream.status]} text-white text-xs`}>
                                                            {stream.status}
                                                        </Badge>
                                                    </div>
                                                    {stream.description && (
                                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{stream.description}</p>
                                                    )}
                                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                        <span>Streamer: {stream.streamer?.username || 'Unknown'}</span>
                                                        <span>Slots: {stream.max_slots}</span>
                                                        <span>Views: {stream.view_count}</span>
                                                        <span>{new Date(stream.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    {stream.status === 'pending' && (
                                                        <>
                                                            <Button size="sm" variant="default" onClick={() => handleStreamStatus(stream.id, 'approved')}>
                                                                <Check className="h-3 w-3 mr-1" /> Approve
                                                            </Button>
                                                            <Button size="sm" variant="destructive" onClick={() => handleStreamStatus(stream.id, 'rejected')}>
                                                                <X className="h-3 w-3 mr-1" /> Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="outline"><Trash2 className="h-3 w-3" /></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Stream</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete "{stream.title}"?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteStream(stream.id)}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* APPLICATIONS TAB */}
                    <TabsContent value="applications" className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No streamer applications</div>
                        ) : (
                            <div className="space-y-3">
                                {applications.map((app) => (
                                    <Card key={app.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{app.applicant?.username || `User #${app.user_id}`}</h3>
                                                        <Badge className={`${statusColors[app.status]} text-white text-xs`}>
                                                            {app.status}
                                                        </Badge>
                                                    </div>
                                                    {app.application_note && (
                                                        <p className="text-sm text-muted-foreground mb-1">Note: {app.application_note}</p>
                                                    )}
                                                    {app.admin_note && (
                                                        <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Admin: {app.admin_note}</p>
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        Applied: {new Date(app.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {app.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => openReviewDialog(app, 'application', 'approved')}>
                                                            <Check className="h-3 w-3 mr-1" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => openReviewDialog(app, 'application', 'rejected')}>
                                                            <X className="h-3 w-3 mr-1" /> Reject
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* GIFTS TAB */}
                    <TabsContent value="gifts" className="space-y-6 pt-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Gifts</h3>
                                <Button size="sm" onClick={() => setGiftDialogOpen(true)}>+ Add Gift</Button>
                            </div>
                            {gifts.length === 0 ? (
                                <div className="text-center p-6 text-muted-foreground">No gifts defined yet</div>
                            ) : (
                                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                                    {gifts.map((gift) => (
                                        <Card key={gift.id}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <div className="font-medium">{gift.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        SGK Weight: {gift.sgk_weight} | Price: {gift.price_usdt ?? 0} USDT | {gift.is_active ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="outline"><Trash2 className="h-3 w-3" /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Gift</AlertDialogTitle>
                                                            <AlertDialogDescription>Delete "{gift.name}"?</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteGift(gift.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Review Dialog */}
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {reviewAction === 'approved' ? 'Approve' : 'Reject'} {reviewType === 'application' ? 'Application' : 'Stream'}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Admin Note (optional)</Label>
                                <Textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add a note..."
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
                            <Button
                                variant={reviewAction === 'approved' ? 'default' : 'destructive'}
                                onClick={handleReview}
                            >
                                {reviewAction === 'approved' ? 'Approve' : 'Reject'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Gift Dialog */}
                <Dialog open={giftDialogOpen} onOpenChange={setGiftDialogOpen}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create Gift</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label>Name *</Label>
                                <Input value={giftForm.name} onChange={(e) => setGiftForm({ ...giftForm, name: e.target.value })} placeholder="Gift name" />
                            </div>
                            <div>
                                <Label>Icon URL</Label>
                                <Input value={giftForm.icon_url} onChange={(e) => setGiftForm({ ...giftForm, icon_url: e.target.value })} placeholder="https://..." />
                            </div>
                            <div>
                                <Label>SGK Weight</Label>
                                <Input type="number" min={1} value={giftForm.sgk_weight} onChange={(e) => setGiftForm({ ...giftForm, sgk_weight: parseInt(e.target.value) || 1 })} />
                            </div>
                            <div>
                                <Label>Price (USDT)</Label>
                                <Input type="number" min={0} step="0.01" value={giftForm.price_usdt} onChange={(e) => setGiftForm({ ...giftForm, price_usdt: parseFloat(e.target.value) || 0 })} placeholder="0.00" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setGiftDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateGift}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </Layout.Body>
        </Layout>
    );
};

export default UserStreamsPage;
