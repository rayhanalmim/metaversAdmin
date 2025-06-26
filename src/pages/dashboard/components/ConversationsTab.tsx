import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { Conversation } from '@/services/api';
import { formatDateTime } from '../utils';

interface ConversationsTabProps {
    conversations: Conversation[];
    loading: boolean;
}

export const ConversationsTab = ({ conversations, loading }: ConversationsTabProps) => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <MessageSquare className="w-5 h-5" />
                    Conversation Management
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4">Session ID</th>
                                    <th className="text-left p-4">Organization</th>
                                    <th className="text-left p-4">Role</th>
                                    <th className="text-left p-4">Content Preview</th>
                                    <th className="text-left p-4">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {conversations.map((conv) => (
                                    <tr key={conv.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4">
                                            <div className="font-medium">{conv.session_id}</div>
                                        </td>
                                        <td className="p-4">{conv.organization_name || 'Unknown'}</td>
                                        <td className="p-4">
                                            <Badge className={conv.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                                {conv.role}
                                            </Badge>
                                        </td>
                                        <td className="p-4 max-w-xs truncate">{conv.content}</td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {formatDateTime(conv.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {conversations.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No conversations found
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 