import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AdminAPI from '@/services/api';

interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface AuthContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    googleSignIn: () => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    login: async () => false,
    googleSignIn: async () => false,
    logout: () => { },
    loading: false
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated on app start
        console.log('🔐 AuthProvider: Starting authentication check...');
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            console.log('🔐 AuthProvider: Checking auth status...');
            const token = localStorage.getItem('adminToken');
            const userData = localStorage.getItem('adminUser');

            console.log('🔐 AuthProvider: Token found:', !!token);
            console.log('🔐 AuthProvider: User data found:', !!userData);

            if (token && userData) {
                console.log('🔐 AuthProvider: Verifying token...');
                // Verify token is still valid
                const isValid = await AdminAPI.verifyToken(token);
                console.log('🔐 AuthProvider: Token valid:', isValid);

                if (isValid) {
                    const user = JSON.parse(userData);
                    console.log('🔐 AuthProvider: Setting user:', user.email);
                    setUser(user);
                    AdminAPI.setToken(token);
                } else {
                    console.log('🔐 AuthProvider: Token expired, clearing storage');
                    // Token expired, clear storage
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                }
            } else {
                console.log('🔐 AuthProvider: No stored credentials found');
            }
        } catch (error) {
            console.error('🔐 AuthProvider: Auth check failed:', error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        } finally {
            console.log('🔐 AuthProvider: Auth check completed');
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log('🔐 AuthProvider: Starting login for:', email);
            setLoading(true);
            const response = await AdminAPI.login({ email, password });

            console.log('🔐 AuthProvider: Login response received:', !!response.access_token);

            if (response.access_token && response.user) {
                // Check if user is admin
                if (!response.user.is_admin || response.user.role !== 'admin') {
                    console.error('🔐 AuthProvider: User is not admin');
                    throw new Error('Admin access required');
                }

                console.log('🔐 AuthProvider: Storing token and user data');
                localStorage.setItem('adminToken', response.access_token);
                localStorage.setItem('adminUser', JSON.stringify(response.user));
                AdminAPI.setToken(response.access_token);
                setUser(response.user);
                console.log('🔐 AuthProvider: Login successful');
                return true;
            }
            console.error('🔐 AuthProvider: Invalid response format');
            return false;
        } catch (error) {
            console.error('🔐 AuthProvider: Login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const googleSignIn = async (): Promise<boolean> => {
        try {
            console.log('🔐 AuthProvider: Starting Google sign-in');
            setLoading(true);
            const response = await AdminAPI.googleAuth();

            if (response.access_token && response.user) {
                // Check if user is admin
                if (!response.user.is_admin || response.user.role !== 'admin') {
                    throw new Error('Admin access required');
                }

                localStorage.setItem('adminToken', response.access_token);
                localStorage.setItem('adminUser', JSON.stringify(response.user));
                AdminAPI.setToken(response.access_token);
                setUser(response.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('🔐 AuthProvider: Google sign-in failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log('🔐 AuthProvider: Logging out');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        AdminAPI.clearToken();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        googleSignIn,
        logout,
        loading
    };

    console.log('🔐 AuthProvider: Current state - authenticated:', !!user, 'loading:', loading);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);