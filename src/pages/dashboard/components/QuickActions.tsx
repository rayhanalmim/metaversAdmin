import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { Users, MessageSquare, DollarSign, Database, Zap } from 'lucide-react';

export const QuickActions = () => {
    return (
        <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60 shadow-sm dark:shadow-slate-900/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    Quick Actions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:hover:text-slate-100">
                    <Users className="w-4 h-4 mr-2" />
                    Create New Organization
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:hover:text-slate-100">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View All Conversations
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:hover:text-slate-100">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Generate Revenue Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:hover:text-slate-100">
                    <Database className="w-4 h-4 mr-2" />
                    Export Database Backup
                </Button>
            </CardContent>
        </Card>
    );
}; 