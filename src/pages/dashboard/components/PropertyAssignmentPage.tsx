import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/custom/button';
import { ArrowLeft, Search, Plus, Trash2, Package, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';
import AdminAPI, { MetaverseUser, Property } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PropertyAssignmentPageProps {
    user: MetaverseUser;
    onBack: () => void;
}

export const PropertyAssignmentPage = ({ user, onBack }: PropertyAssignmentPageProps) => {
    const [userProperties, setUserProperties] = useState<Property[]>([]);
    const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(false);
    const [removing, setRemoving] = useState<string | null>(null);

    // Fetch user's current properties
    const fetchUserProperties = useCallback(async () => {
        try {
            const properties = await AdminAPI.getUserProperties(user.id);
            setUserProperties(properties);
        } catch (error) {
            console.error('Error fetching user properties:', error);
            toast({
                title: "Error",
                description: "Failed to fetch user properties",
                variant: "destructive",
            });
        }
    }, [user.id]);

    // Fetch available properties for assignment
    const fetchAvailableProperties = useCallback(async () => {
        try {
            const properties = await AdminAPI.getAvailableProperties();
            setAvailableProperties(properties);
        } catch (error) {
            console.error('Error fetching available properties:', error);
            toast({
                title: "Error",
                description: "Failed to fetch available properties",
                variant: "destructive",
            });
        }
    }, []);

    // Search properties
    const searchProperties = useCallback(async (term: string) => {
        if (!term.trim()) {
            await fetchAvailableProperties();
            return;
        }

        try {
            const properties = await AdminAPI.searchProperties(term);
            setAvailableProperties(properties);
        } catch (error) {
            console.error('Error searching properties:', error);
            toast({
                title: "Error",
                description: "Failed to search properties",
                variant: "destructive",
            });
        }
    }, [fetchAvailableProperties]);

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchUserProperties(),
                fetchAvailableProperties()
            ]);
            setLoading(false);
        };

        loadData();
    }, [fetchUserProperties, fetchAvailableProperties]);

    // Handle search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchProperties(searchTerm);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchProperties]);

    // Assign property to user
    const handleAssignProperty = async () => {
        if (!selectedProperty) {
            toast({
                title: "Error",
                description: "Please select a property to assign",
                variant: "destructive",
            });
            return;
        }

        setAssigning(true);
        try {
            await AdminAPI.assignPropertyToUser(user.id, parseInt(selectedProperty));
            
            toast({
                title: "Success",
                description: "Property assigned successfully",
            });

            // Refresh data
            await Promise.all([
                fetchUserProperties(),
                fetchAvailableProperties()
            ]);
            
            setSelectedProperty('');
        } catch (error: any) {
            console.error('Error assigning property:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to assign property",
                variant: "destructive",
            });
        } finally {
            setAssigning(false);
        }
    };

    // Remove property from user
    const handleRemoveProperty = async (propertyId: number) => {
        setRemoving(propertyId.toString());
        try {
            await AdminAPI.removePropertyFromUser(user.id, propertyId);
            
            toast({
                title: "Success",
                description: "Property removed successfully",
            });

            // Refresh data
            await Promise.all([
                fetchUserProperties(),
                fetchAvailableProperties()
            ]);
        } catch (error: any) {
            console.error('Error removing property:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to remove property",
                variant: "destructive",
            });
        } finally {
            setRemoving(null);
        }
    };

    // Filter available properties (exclude already assigned ones)
    const filteredAvailableProperties = availableProperties.filter(
        property => !userProperties.some(userProp => userProp.id === property.id)
    );

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Users
                    </Button>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Users
                </Button>
            </div>

            {/* User Info Header */}
            <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Property Management for {user.username}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-slate-600 dark:text-slate-400">User ID:</span>
                            <p className="text-slate-900 dark:text-slate-100">{user.id}</p>
                        </div>
                        <div>
                            <span className="font-medium text-slate-600 dark:text-slate-400">Email:</span>
                            <p className="text-slate-900 dark:text-slate-100">{user.email}</p>
                        </div>
                        <div>
                            <span className="font-medium text-slate-600 dark:text-slate-400">Current Properties:</span>
                            <p className="text-slate-900 dark:text-slate-100">{userProperties.length}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Assign New Property */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Assign New Property
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Properties */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                                placeholder="Search properties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Property Selection */}
                        <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a property to assign" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredAvailableProperties.length === 0 ? (
                                    <div className="p-2 text-sm text-slate-500 text-center">
                                        No available properties found
                                    </div>
                                ) : (
                                    filteredAvailableProperties.map((property) => (
                                        <SelectItem key={property.id} value={property.id.toString()}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    Property #{property.id}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    Token: {property.token_address?.slice(0, 10)}...
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>

                        <Button 
                            onClick={handleAssignProperty}
                            disabled={!selectedProperty || assigning}
                            className="w-full"
                        >
                            {assigning ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Assign Property
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Current Properties */}
                <Card className="bg-white dark:bg-slate-800/95 border-slate-200/60 dark:border-slate-700/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Current Properties ({userProperties.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userProperties.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-500 dark:text-slate-400">
                                    No properties assigned to this user
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {userProperties.map((property) => (
                                    <div
                                        key={property.id}
                                        className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">
                                                Property #{property.id}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                                Token: {property.token_address?.slice(0, 20)}...
                                            </div>
                                            {property.metadata && (
                                                <div className="text-xs text-slate-400 mt-1">
                                                    {JSON.stringify(property.metadata).slice(0, 50)}...
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveProperty(property.id)}
                                            disabled={removing === property.id.toString()}
                                        >
                                            {removing === property.id.toString() ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                            ) : (
                                                <Trash2 className="w-3 h-3" />
                                            )}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};