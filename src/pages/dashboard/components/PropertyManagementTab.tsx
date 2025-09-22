import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, User, Building } from 'lucide-react';
import AdminAPI, { MetaverseUser } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

interface PropertyData {
    id: number;
    owner_id?: number;
    owner_username?: string;
    is_assigned: boolean;
}

interface PropertyManagementTabProps {
    users: MetaverseUser[];
}

export const PropertyManagementTab: React.FC<PropertyManagementTabProps> = ({ users }) => {
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<PropertyData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(50); // Show 50 properties per page
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
    const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize properties data (1-1000)
    const initializeProperties = useCallback(async () => {
        setLoading(true);
        try {
            // Get all users with their property assignments
            const usersData = await AdminAPI.getUsersWithRoles();
            
            // Create property map with ownership info
            const propertyMap = new Map<number, { owner_id: number; owner_username: string }>();
            
            usersData.forEach(user => {
                if (user.property_ids && user.property_ids.length > 0) {
                    user.property_ids.forEach(propertyId => {
                        propertyMap.set(propertyId, {
                            owner_id: user.id,
                            owner_username: user.username
                        });
                    });
                }
            });

            // Generate all 1000 properties with ownership info
            const allProperties: PropertyData[] = Array.from({ length: 1000 }, (_, index) => {
                const propertyId = index + 1;
                const ownerInfo = propertyMap.get(propertyId);
                
                return {
                    id: propertyId,
                    owner_id: ownerInfo?.owner_id,
                    owner_username: ownerInfo?.owner_username,
                    is_assigned: !!ownerInfo
                };
            });

            setProperties(allProperties);
            setFilteredProperties(allProperties);
        } catch (error) {
            console.error('Error initializing properties:', error);
            toast({
                title: "Error",
                description: "Failed to load properties data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        initializeProperties();
    }, [initializeProperties]);

    // Filter properties based on search and status
    useEffect(() => {
        let filtered = properties;

        // Apply search filter
        if (searchTerm) {
            const searchId = parseInt(searchTerm);
            if (!isNaN(searchId)) {
                filtered = filtered.filter(property => property.id === searchId);
            } else {
                filtered = filtered.filter(property => 
                    property.owner_username?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(property => {
                if (statusFilter === 'assigned') return property.is_assigned;
                if (statusFilter === 'unassigned') return !property.is_assigned;
                return true;
            });
        }

        setFilteredProperties(filtered);
        setCurrentPage(1); // Reset to first page when filtering
    }, [properties, searchTerm, statusFilter]);

    // Pagination calculations
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    const handlePropertyClick = (property: PropertyData) => {
        setSelectedProperty(property);
        setIsAssignDialogOpen(true);
    };

    const handleAssignProperty = async (userId: number) => {
        if (!selectedProperty) return;

        try {
            await AdminAPI.assignPropertyToUser(userId, selectedProperty.id);
            
            // Update local state
            const updatedProperties = properties.map(prop => {
                if (prop.id === selectedProperty.id) {
                    const user = users.find(u => u.id === userId);
                    return {
                        ...prop,
                        owner_id: userId,
                        owner_username: user?.username,
                        is_assigned: true
                    };
                }
                return prop;
            });
            
            setProperties(updatedProperties);
            setIsAssignDialogOpen(false);
            setSelectedProperty(null);
            
            toast({
                title: "Success",
                description: `Property #${selectedProperty.id} assigned successfully`,
            });
        } catch (error) {
            console.error('Error assigning property:', error);
            toast({
                title: "Error",
                description: "Failed to assign property",
                variant: "destructive",
            });
        }
    };

    const handleRemoveProperty = async () => {
        if (!selectedProperty || !selectedProperty.owner_id) return;

        try {
            await AdminAPI.removePropertyFromUser(selectedProperty.owner_id, selectedProperty.id);
            
            // Update local state
            const updatedProperties = properties.map(prop => {
                if (prop.id === selectedProperty.id) {
                    return {
                        ...prop,
                        owner_id: undefined,
                        owner_username: undefined,
                        is_assigned: false
                    };
                }
                return prop;
            });
            
            setProperties(updatedProperties);
            setIsAssignDialogOpen(false);
            setSelectedProperty(null);
            
            toast({
                title: "Success",
                description: `Property #${selectedProperty.id} unassigned successfully`,
            });
        } catch (error) {
            console.error('Error removing property:', error);
            toast({
                title: "Error",
                description: "Failed to remove property assignment",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Building className="h-8 w-8 animate-pulse mx-auto mb-4" />
                    <p>Loading properties...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Property Management</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage property ownership for all 1000 properties
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search by property ID or owner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={(value: 'all' | 'assigned' | 'unassigned') => setStatusFilter(value)}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Properties</SelectItem>
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{properties.filter(p => p.is_assigned).length}</div>
                    <div className="text-sm text-muted-foreground">Assigned Properties</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{properties.filter(p => !p.is_assigned).length}</div>
                    <div className="text-sm text-muted-foreground">Available Properties</div>
                </div>
                <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{filteredProperties.length}</div>
                    <div className="text-sm text-muted-foreground">Filtered Results</div>
                </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-10 gap-2">
                {currentProperties.map(property => (
                    <div
                        key={property.id}
                        onClick={() => handlePropertyClick(property)}
                        className={`
                            relative p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md
                            ${property.is_assigned 
                                ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700'
                            }
                        `}
                    >
                        <div className="text-center">
                            <div className="font-medium text-sm">{property.id}</div>
                            {property.is_assigned && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                    Assigned
                                </Badge>
                            )}
                            {property.owner_username && (
                                <div className="text-xs text-muted-foreground mt-1 truncate">
                                    {property.owner_username}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {indexOfFirstProperty + 1} to {Math.min(indexOfLastProperty, filteredProperties.length)} of {filteredProperties.length} properties
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let page;
                                if (totalPages <= 5) {
                                    page = i + 1;
                                } else if (currentPage <= 3) {
                                    page = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    page = totalPages - 4 + i;
                                } else {
                                    page = currentPage - 2 + i;
                                }
                                
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>
                        
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Property Assignment Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Property #{selectedProperty?.id} Management
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedProperty?.is_assigned ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">Current Owner</span>
                                    </div>
                                    <div className="text-sm">{selectedProperty.owner_username}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleRemoveProperty}
                                        className="flex-1"
                                    >
                                        Remove Assignment
                                    </Button>
                                    <Select onValueChange={(value) => handleAssignProperty(parseInt(value))}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Reassign to..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        This property is currently unassigned
                                    </div>
                                </div>
                                <Select onValueChange={(value) => handleAssignProperty(parseInt(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user to assign..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.username}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};