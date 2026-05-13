/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Plus, Trash2, Pencil, Sun, Moon, Sword, Flag, Megaphone } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminAPI from '@/services/api';
import Header from './components/Header';
import { useT } from '@/i18n/I18nContext';

const TIME_OPTIONS = ['day', 'night'] as const;
const WORLD_OPTIONS = ['normal', 'meeting', 'festival', 'alert', 'mission_open'] as const;
const TIME_COND = ['any', 'day', 'night'] as const;
const WORLD_COND = ['any', 'normal', 'meeting', 'festival', 'alert', 'mission_open'] as const;
const NEXT_ACTIONS = ['NONE', 'MOVE_TO', 'EXPLORE', 'SELECT', 'START_MISSION', 'CLOSE_DIALOGUE'] as const;

const worldStateColors: Record<string, string> = {
    normal: 'bg-blue-500',
    meeting: 'bg-purple-500',
    festival: 'bg-pink-500',
    alert: 'bg-red-500',
    mission_open: 'bg-amber-500',
};

interface DialogueRow {
    id?: number;
    npc_id: string;
    category_id?: string;
    time_condition: string;
    world_condition: string;
    title: string;
    body: string;
    recommendation: string | null;
    next_action_type: string;
    next_action_target: string | null;
    priority: number;
    is_active: boolean;
}

const blankRow: DialogueRow = {
    npc_id: 'sojiro',
    category_id: '',
    time_condition: 'any',
    world_condition: 'any',
    title: '',
    body: '',
    recommendation: '',
    next_action_type: 'NONE',
    next_action_target: '',
    priority: 0,
    is_active: true,
};

const AiSamuraiPage: React.FC = () => {
    const t = useT();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // World State
    const [worldState, setWorldState] = useState<any>({
        time_of_day: 'day',
        world_state: 'normal',
        mission_available: false,
    });

    // Categories
    const [categories, setCategories] = useState<any[]>([]);

    // Greetings & Responses
    const [greetings, setGreetings] = useState<any[]>([]);
    const [responses, setResponses] = useState<any[]>([]);
    const [responseFilter, setResponseFilter] = useState<string>('');

    // Edit dialog state
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<'greeting' | 'response'>('greeting');
    const [editorRow, setEditorRow] = useState<DialogueRow>(blankRow);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Delete confirmation
    const [confirmDelete, setConfirmDelete] = useState<{ kind: 'greeting' | 'response'; id: number } | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [ws, cats, grs, rsps] = await Promise.all([
                AdminAPI.getNpcWorldState(),
                AdminAPI.listNpcCategories(),
                AdminAPI.listNpcGreetings('sojiro'),
                AdminAPI.listNpcResponses({ npc_id: 'sojiro' }),
            ]);
            if (ws?.data) setWorldState(ws.data);
            setCategories(cats?.data || []);
            setGreetings(grs?.data || []);
            setResponses(rsps?.data || []);
        } catch (error) {
            console.error('Error fetching NPC data:', error);
            toast({ title: t('common.error'), description: t('ai.toast.load_fail'), variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAll();
        setRefreshing(false);
    };

    // ── World State updates ───────────────────────────────
    const updateWorldState = async (patch: any) => {
        try {
            const res = await AdminAPI.updateNpcWorldState(patch);
            if (res?.data) setWorldState(res.data);
            toast({ title: t('common.success'), description: t('ai.toast.updated') });
        } catch (e: any) {
            toast({ title: t('common.error'), description: e.message || 'Failed', variant: 'destructive' });
        }
    };

    // ── Editor helpers ────────────────────────────────────
    const openCreate = (mode: 'greeting' | 'response', categoryId?: string) => {
        setEditorMode(mode);
        setEditorRow({ ...blankRow, category_id: categoryId || '' });
        setEditingId(null);
        setEditorOpen(true);
    };

    const openEdit = (mode: 'greeting' | 'response', row: any) => {
        setEditorMode(mode);
        setEditorRow({
            npc_id: row.npc_id || 'sojiro',
            category_id: row.category_id || '',
            time_condition: row.time_condition,
            world_condition: row.world_condition,
            title: row.title,
            body: row.body,
            recommendation: row.recommendation || '',
            next_action_type: row.next_action_type,
            next_action_target: row.next_action_target || '',
            priority: row.priority || 0,
            is_active: !!row.is_active,
        });
        setEditingId(row.id);
        setEditorOpen(true);
    };

    const saveEditor = async () => {
        try {
            const payload: any = { ...editorRow };
            if (!payload.recommendation) payload.recommendation = null;
            if (!payload.next_action_target) payload.next_action_target = null;
            if (editorMode === 'greeting') {
                delete payload.category_id;
                if (editingId) await AdminAPI.updateNpcGreeting(editingId, payload);
                else await AdminAPI.createNpcGreeting(payload);
            } else {
                if (!payload.category_id) {
                    toast({ title: t('common.error'), description: t('ai.editor.category_required'), variant: 'destructive' });
                    return;
                }
                if (editingId) await AdminAPI.updateNpcResponse(editingId, payload);
                else await AdminAPI.createNpcResponse(payload);
            }
            toast({ title: t('common.success'), description: t('ai.toast.saved') });
            setEditorOpen(false);
            fetchAll();
        } catch (e: any) {
            toast({ title: t('common.error'), description: e.response?.data?.message || e.message, variant: 'destructive' });
        }
    };

    const performDelete = async () => {
        if (!confirmDelete) return;
        try {
            if (confirmDelete.kind === 'greeting') await AdminAPI.deleteNpcGreeting(confirmDelete.id);
            else await AdminAPI.deleteNpcResponse(confirmDelete.id);
            toast({ title: t('common.success'), description: t('ai.toast.deleted') });
            setConfirmDelete(null);
            fetchAll();
        } catch (e: any) {
            toast({ title: t('common.error'), description: e.message, variant: 'destructive' });
        }
    };

    const filteredResponses = responseFilter
        ? responses.filter((r) => r.category_id === responseFilter)
        : responses;

    return (
        <Layout>
            <Header />
            <Layout.Body>
                {/* Page Title */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Sword className="h-6 w-6" /> {t('ai.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('ai.subtitle')}
                        </p>
                    </div>
                    <Button onClick={handleRefresh} disabled={refreshing} className="gap-2">
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> {t('common.refresh')}
                    </Button>
                </div>

                {/* World State control panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                {worldState.time_of_day === 'day' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {t('ai.time_of_day')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold capitalize mb-3">{worldState.time_of_day}</div>
                            <Select value={worldState.time_of_day} onValueChange={(v) => updateWorldState({ time_of_day: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_OPTIONS.map((t) => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Flag className="h-4 w-4" /> {t('ai.world_state')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-3">
                                <Badge className={`${worldStateColors[worldState.world_state] || 'bg-gray-500'} text-white capitalize`}>
                                    {worldState.world_state}
                                </Badge>
                            </div>
                            <Select value={worldState.world_state} onValueChange={(v) => updateWorldState({ world_state: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {WORLD_OPTIONS.map((w) => (
                                        <SelectItem key={w} value={w}>{w}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Megaphone className="h-4 w-4" /> {t('ai.mission_available')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-3">
                                {worldState.mission_available ? t('common.yes') : t('common.no')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={!!worldState.mission_available}
                                    onCheckedChange={(v) => updateWorldState({ mission_available: v })}
                                />
                                <Label>{t('ai.enable_mission')}</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs: Greetings | Responses | Categories */}
                <Tabs defaultValue="greetings" className="w-full">
                    <TabsList>
                        <TabsTrigger value="greetings">{t('ai.tab_greetings')} ({greetings.length})</TabsTrigger>
                        <TabsTrigger value="responses">{t('ai.tab_responses')} ({responses.length})</TabsTrigger>
                        <TabsTrigger value="categories">{t('ai.tab_categories')} ({categories.length})</TabsTrigger>
                    </TabsList>

                    {/* GREETINGS */}
                    <TabsContent value="greetings">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{t('ai.greetings.title')}</CardTitle>
                                    <CardDescription>
                                        {t('ai.greetings.desc')}
                                    </CardDescription>
                                </div>
                                <Button onClick={() => openCreate('greeting')} className="gap-2">
                                    <Plus className="h-4 w-4" /> {t('ai.greetings.add')}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
                                ) : greetings.length === 0 ? (
                                    <div className="text-sm text-muted-foreground py-6 text-center">{t('ai.greetings.empty')}</div>
                                ) : (
                                    <div className="space-y-2">
                                        {greetings.map((g) => (
                                            <DialogueLineCard
                                                key={g.id}
                                                row={g}
                                                onEdit={() => openEdit('greeting', g)}
                                                onDelete={() => setConfirmDelete({ kind: 'greeting', id: g.id })}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* RESPONSES */}
                    <TabsContent value="responses">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>{t('ai.responses.title')}</CardTitle>
                                    <CardDescription>
                                        {t('ai.responses.desc')}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Select value={responseFilter || 'all'} onValueChange={(v) => setResponseFilter(v === 'all' ? '' : v)}>
                                        <SelectTrigger className="w-[220px]">
                                            <SelectValue placeholder={t('ai.responses.filter')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{t('ai.responses.all_categories')}</SelectItem>
                                            {categories.map((c) => (
                                                <SelectItem key={c.category_id} value={c.category_id}>{c.category_id}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={() => openCreate('response', responseFilter || undefined)} className="gap-2">
                                        <Plus className="h-4 w-4" /> {t('ai.responses.add')}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-sm text-muted-foreground">{t('common.loading')}</div>
                                ) : filteredResponses.length === 0 ? (
                                    <div className="text-sm text-muted-foreground py-6 text-center">{t('ai.responses.empty')}</div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredResponses.map((r) => (
                                            <DialogueLineCard
                                                key={r.id}
                                                row={r}
                                                showCategory
                                                onEdit={() => openEdit('response', r)}
                                                onDelete={() => setConfirmDelete({ kind: 'response', id: r.id })}
                                            />
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CATEGORIES */}
                    <TabsContent value="categories">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('ai.categories.title')}</CardTitle>
                                <CardDescription>
                                    {t('ai.categories.desc')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {categories.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between p-3 border rounded-md">
                                            <div>
                                                <code className="font-mono text-sm">{c.category_id}</code>
                                                <div className="text-sm text-muted-foreground">{c.label}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={c.is_active ? 'default' : 'outline'}>
                                                    {c.is_active ? t('common.active') : t('common.disabled')}
                                                </Badge>
                                                <Badge variant="outline">{t('ai.categories.order')}: {c.display_order}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Editor dialog */}
                <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>
                                {editorMode === 'greeting'
                                    ? (editingId ? t('ai.editor.edit_greeting') : t('ai.editor.add_greeting'))
                                    : (editingId ? t('ai.editor.edit_response') : t('ai.editor.add_response'))}
                            </DialogTitle>
                            <DialogDescription>
                                {t('ai.editor.desc')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-2">
                            {editorMode === 'response' && (
                                <div>
                                    <Label>{t('common.category')}</Label>
                                    <Select
                                        value={editorRow.category_id || ''}
                                        onValueChange={(v) => setEditorRow({ ...editorRow, category_id: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('common.category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.category_id} value={c.category_id}>{c.category_id}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>{t('ai.editor.time_condition')}</Label>
                                    <Select
                                        value={editorRow.time_condition}
                                        onValueChange={(v) => setEditorRow({ ...editorRow, time_condition: v })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {TIME_COND.map((tc) => <SelectItem key={tc} value={tc}>{tc}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>{t('ai.editor.world_condition')}</Label>
                                    <Select
                                        value={editorRow.world_condition}
                                        onValueChange={(v) => setEditorRow({ ...editorRow, world_condition: v })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {WORLD_COND.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>{t('ai.editor.title_label')}</Label>
                                <Input
                                    value={editorRow.title}
                                    maxLength={60}
                                    onChange={(e) => setEditorRow({ ...editorRow, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>{t('ai.editor.body_label')}</Label>
                                <Textarea
                                    value={editorRow.body}
                                    maxLength={400}
                                    rows={4}
                                    onChange={(e) => setEditorRow({ ...editorRow, body: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label>{t('ai.editor.recommendation_label')}</Label>
                                <Input
                                    value={editorRow.recommendation || ''}
                                    maxLength={200}
                                    onChange={(e) => setEditorRow({ ...editorRow, recommendation: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>{t('ai.editor.next_action')}</Label>
                                    <Select
                                        value={editorRow.next_action_type}
                                        onValueChange={(v) => setEditorRow({ ...editorRow, next_action_type: v })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {NEXT_ACTIONS.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>{t('ai.editor.next_action_target')}</Label>
                                    <Input
                                        value={editorRow.next_action_target || ''}
                                        onChange={(e) => setEditorRow({ ...editorRow, next_action_target: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 items-end">
                                <div>
                                    <Label>{t('ai.editor.priority')}</Label>
                                    <Input
                                        type="number"
                                        value={editorRow.priority}
                                        onChange={(e) => setEditorRow({ ...editorRow, priority: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 pb-2">
                                    <Switch
                                        checked={editorRow.is_active}
                                        onCheckedChange={(v) => setEditorRow({ ...editorRow, is_active: v })}
                                    />
                                    <Label>{t('common.active')}</Label>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditorOpen(false)}>{t('common.cancel')}</Button>
                            <Button onClick={saveEditor}>{t('common.save')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirm delete */}
                <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('ai.delete.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('ai.delete.desc')}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={performDelete}>{t('common.delete')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Layout.Body>
        </Layout>
    );
};

const DialogueLineCard: React.FC<{
    row: any;
    showCategory?: boolean;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ row, showCategory, onEdit, onDelete }) => {
    return (
        <div className="border rounded-md p-3 hover:bg-accent/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        {showCategory && row.category_id && (
                            <Badge variant="secondary" className="font-mono">{row.category_id}</Badge>
                        )}
                        <Badge variant="outline">time: {row.time_condition}</Badge>
                        <Badge variant="outline">world: {row.world_condition}</Badge>
                        {row.next_action_type !== 'NONE' && (
                            <Badge className="bg-indigo-500 text-white">
                                {row.next_action_type}{row.next_action_target ? `: ${row.next_action_target}` : ''}
                            </Badge>
                        )}
                        {/* status pill kept English-codes intentionally for admin clarity */}
                        {!row.is_active && <Badge variant="destructive">disabled</Badge>}
                    </div>
                    <div className="font-semibold">{row.title}</div>
                    <div className="text-sm text-muted-foreground">{row.body}</div>
                    {row.recommendation && (
                        <div className="text-xs text-muted-foreground mt-1 italic">→ {row.recommendation}</div>
                    )}
                </div>
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={onEdit}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onDelete}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AiSamuraiPage;
