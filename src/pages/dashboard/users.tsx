import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/custom/layout';
import { Button } from '@/components/custom/button';
import { RefreshCw, Download, Shield, User, Crown, Search as SearchIcon, ChevronLeft, ChevronRight, Users, Building } from 'lucide-react';
import AdminAPI, { MetaverseUser } from '@/services/api';
import { PropertyAssignmentPage } from './components/PropertyAssignmentPage';
import { PropertyManagementTab } from './components/PropertyManagementTab';
import { downloadCSV, generateCSV, formatDateTime } from './utils';
import Header from './components/Header';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const UsersPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [users, setUsers] = useState<MetaverseUser[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<MetaverseUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<MetaverseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState<'users' | 'properties'>('users');

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

    const fetchUsers = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        fetchingRef.current = true;
        setLoading(true);

        try {
            const usersData = await AdminAPI.getUsersWithRoles();
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    }, [isAuthenticated]);

    // Search and filter functionality
    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (user.admin_role || 'user').toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
        setCurrentPage(1); // Reset to first page when searching
    }, [users, searchTerm]);

    // Pagination calculations
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Initial authentication check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Fetch data only after authentication is verified
    useEffect(() => {
        if (authChecked && isAuthenticated) {
            fetchUsers();
        }
    }, [authChecked, isAuthenticated, fetchUsers]);

    const handleRefresh = useCallback(async () => {
        if (fetchingRef.current || !isAuthenticated) {
            return;
        }

        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    }, [fetchUsers, isAuthenticated]);

    const handleUserClick = (user: MetaverseUser) => {
        setSelectedUser(user);
    };

    const handleBackToUsers = () => {
        setSelectedUser(null);
    };

    const handleExport = () => {
        const data = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            wallet_address: user.wallet_address,
            last_room: user.last_room,
            avatar_name: user.avatar?.name || 'N/A',
            admin_role: user.admin_role || 'user',
            last_login: formatDateTime(user.last_login_time),
            created_at: formatDateTime(user.created_at)
        }));

        const csvData = generateCSV(data);
        downloadCSV(csvData, 'metaverse_users.csv');
    };

    const handleRoleChange = async (userId: number, newRole: 'user' | 'admin' | 'superadmin') => {
        try {
            await AdminAPI.updateUserRole(userId, newRole);

            // Update the local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, admin_role: newRole }
                        : user
                )
            );

            toast({
                title: "Role Updated",
                description: `User role has been updated to ${newRole}`,
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            toast({
                title: "Error",
                description: "Failed to update user role. Please try again.",
                variant: "destructive",
            });
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'superadmin':
                return <Crown className="h-4 w-4 text-yellow-500" />;
            case 'admin':
                return <Shield className="h-4 w-4 text-blue-500" />;
            default:
                return <User className="h-4 w-4 text-gray-500" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'superadmin':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
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
                        <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
                        <p className='text-muted-foreground'>
                            Manage and monitor metaverse users, their avatars, and activity.
                        </p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button onClick={handleRefresh} disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh Data
                        </Button>
                        <Button onClick={handleExport} disabled={users.length === 0}>
                            <Download className='mr-2 h-4 w-4' />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {selectedUser ? (
                        <PropertyAssignmentPage user={selectedUser} onBack={handleBackToUsers} />
                    ) : (
                        <div className="space-y-4">
                            {/* Tab Navigation */}
                            <div className="flex items-center gap-4 border-b">
                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'users'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Users className="h-4 w-4" />
                                    Users Management
                                </button>
                                <button
                                    onClick={() => setActiveTab('properties')}
                                    className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'properties'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    <Building className="h-4 w-4" />
                                    Property Management
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'users' ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Metaverse Users</h3>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input
                                                    placeholder="Search users..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 w-64"
                                                />
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {filteredUsers.length} of {users.length} users
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {loading ? (
                                            <div className="flex items-center justify-center h-32">
                                                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                                                <span>Loading users...</span>
                                            </div>
                                        ) : filteredUsers.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-muted-foreground">
                                                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {currentUsers.map(user => (
                                                    <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1 cursor-pointer" onClick={() => handleUserClick(user)}>
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <h4 className="font-medium">{user.username}</h4>
                                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.admin_role || 'user')}`}>
                                                                        {getRoleIcon(user.admin_role || 'user')}
                                                                        {(user.admin_role || 'user').charAt(0).toUpperCase() + (user.admin_role || 'user').slice(1)}
                                                                    </div>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                                                <p className="text-sm text-muted-foreground">Avatar: {user.avatar?.name || 'N/A'}</p>
                                                                <p className="text-sm text-muted-foreground">NFTs: {user.total_nfts || 0}</p>
                                                                <p className="text-sm text-muted-foreground">Properties: {user.property_count || 0}</p>
                                                                {user.property_ids && user.property_ids.length > 0 && (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Property IDs: {user.property_ids.slice(0, 5).join(', ')}{user.property_ids.length > 5 ? '...' : ''}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <p className="text-sm text-muted-foreground">Last Room: {user.last_room || 'N/A'}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Last Login: {user.last_login_time ? formatDateTime(user.last_login_time) : 'Never'}
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <label className="text-xs font-medium text-muted-foreground">Admin Role</label>
                                                                    <Select
                                                                        value={user.admin_role || 'user'}
                                                                        onValueChange={(value: 'user' | 'admin' | 'superadmin') => handleRoleChange(user.id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-32">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="user">
                                                                                <div className="flex items-center gap-2">
                                                                                    <User className="h-4 w-4" />
                                                                                    User
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="admin">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Shield className="h-4 w-4" />
                                                                                    Admin
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="superadmin">
                                                                                <div className="flex items-center gap-2">
                                                                                    <Crown className="h-4 w-4" />
                                                                                    Super Admin
                                                                                </div>
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Pagination Controls */}
                                                {totalPages > 1 && (
                                                    <div className="flex items-center justify-between mt-6 p-4 border-t">
                                                        <div className="text-sm text-muted-foreground">
                                                            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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
                                                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                                    .filter(page => {
                                                                        // Show first page, last page, current page, and pages around current
                                                                        return page === 1 ||
                                                                            page === totalPages ||
                                                                            Math.abs(page - currentPage) <= 1;
                                                                    })
                                                                    .map((page, index, array) => (
                                                                        <div key={page} className="flex items-center">
                                                                            {index > 0 && array[index - 1] !== page - 1 && (
                                                                                <span className="px-2 text-muted-foreground">...</span>
                                                                            )}
                                                                            <Button
                                                                                variant={currentPage === page ? "default" : "outline"}
                                                                                size="sm"
                                                                                onClick={() => setCurrentPage(page)}
                                                                                className="w-8 h-8 p-0"
                                                                            >
                                                                                {page}
                                                                            </Button>
                                                                        </div>
                                                                    ))
                                                                }
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
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <PropertyManagementTab users={users} />
                            )}
                        </div>
                    )}
                </div>
            </Layout.Body>
        </Layout>
    );
};

export default UsersPage;