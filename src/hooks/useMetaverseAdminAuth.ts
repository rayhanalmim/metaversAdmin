import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AdminSession {
  token: string;
  expiresAt: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  user: AdminUser | null;
  session: AdminSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Create axios instance outside the hook to prevent recreation on every render
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useMetaverseAdminAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Set loading state
  const setLoading = useCallback((loading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  // Set error state
  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<ApiResponse<{
        user: AdminUser;
        session: AdminSession;
      }>>('/api/admin/login', credentials);

      if (response.data.success && response.data.data) {
        const { user, session } = response.data.data;
        
        setAuthState({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        // Store session info in localStorage for persistence
        localStorage.setItem('metaverse_admin_session', JSON.stringify({
          user,
          session,
          timestamp: Date.now(),
        }));

        return true;
      } else {
        setError(response.data.message || 'Login failed');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Network error occurred during login';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Call logout API
      await apiClient.post('/api/admin/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local state and storage
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      localStorage.removeItem('metaverse_admin_session');
    }
  }, [setLoading]);

  // Verify session function
  const verifySession = useCallback(async (): Promise<boolean> => {
    console.log('🔐 [VERIFY] Starting session verification...');
    
    try {
      const response = await apiClient.get<ApiResponse<{ user: AdminUser }>>('/api/admin/verify');
      
      console.log('🔐 [VERIFY] API response:', {
        success: response.data.success,
        hasUser: !!response.data.data?.user,
        username: response.data.data?.user?.username
      });

      if (response.data.success && response.data.data) {
        const { user } = response.data.data;
        
        // Restore session data from localStorage if available
        const storedSession = localStorage.getItem('metaverse_admin_session');
        let sessionData = null;
        
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            sessionData = parsed.session;
            console.log('🔐 [VERIFY] Restored session data:', {
              token: sessionData?.token?.substring(0, 10) + '...',
              expiresAt: sessionData?.expiresAt
            });
          } catch (e) {
            console.warn('🔐 [VERIFY] Failed to parse stored session data:', e);
          }
        }
        
        console.log('🔐 [VERIFY] Setting authenticated state...');
        setAuthState(prev => ({
          ...prev,
          user,
          session: sessionData,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));

        console.log('🔐 [VERIFY] ✅ Session verification successful');
        return true;
      } else {
        console.log('🔐 [VERIFY] ❌ Session invalid - clearing storage');
        // Session invalid, clear local storage
        localStorage.removeItem('metaverse_admin_session');
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return false;
      }
    } catch (error: any) {
      console.error('🔐 [VERIFY] ❌ Session verification failed:', error);
      // Session verification failed
      localStorage.removeItem('metaverse_admin_session');
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return false;
    }
  }, []);

  // Get dashboard data
  const getDashboardData = useCallback(async () => {
    try {
      const response = await apiClient.get<ApiResponse<{
        statistics: {
          totalUsers: number;
          adminUsers: number;
          regularUsers: number;
        };
        recentUsers: Array<{
          id: number;
          username: string;
          email: string;
          created_at: string;
        }>;
      }>>('/api/admin/dashboard');

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch dashboard data';
      throw new Error(errorMessage);
    }
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔐 [AUTH] Starting authentication initialization...');
      
      try {
        // Check for stored session
        const storedSession = localStorage.getItem('metaverse_admin_session');
        console.log('🔐 [AUTH] Stored session check:', storedSession ? 'Found' : 'Not found');
        
        if (storedSession) {
          const sessionData = JSON.parse(storedSession);
          const { user, session, timestamp } = sessionData;
          
          console.log('🔐 [AUTH] Session data:', {
            user: user?.username,
            sessionToken: session?.token?.substring(0, 10) + '...',
            expiresAt: session?.expiresAt,
            timestamp: new Date(timestamp).toISOString()
          });
          
          // Check if session is not too old (24 hours)
          const sessionAge = Date.now() - timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          console.log('🔐 [AUTH] Session age check:', {
            ageHours: Math.round(sessionAge / (1000 * 60 * 60)),
            maxAgeHours: 24,
            isValid: sessionAge < maxAge
          });
          
          if (sessionAge < maxAge) {
            console.log('🔐 [AUTH] Session age valid, verifying with server...');
            // Verify session with server
            const isValid = await verifySession();
            
            console.log('🔐 [AUTH] Server verification result:', isValid);
            
            if (isValid) {
              console.log('🔐 [AUTH] ✅ Authentication successful - session restored');
              return; // Session is valid, state already updated
            }
          } else {
            console.log('🔐 [AUTH] ❌ Session expired due to age');
          }
        }

        // No valid session found
        console.log('🔐 [AUTH] ❌ No valid session - setting unauthenticated state');
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('🔐 [AUTH] ❌ Auth initialization error:', error);
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    initializeAuth();
  }, []); // Empty dependency array to run only once on mount

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    user: authState.user,
    session: authState.session,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Actions
    login,
    logout,
    verifySession,
    getDashboardData,
    clearError,

    // Utilities
    apiClient, // Expose for additional API calls if needed
  };
};