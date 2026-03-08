import { createContext, useCallback, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await authAPI.checkAuth();
      setUser(data.authenticated ? data.user : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await authAPI.logout();
    setUser(null);
  }, []);

  const login = useCallback(() => {
    authAPI.login();
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isConsumer: user?.user_type === 'consumer',
    isProducer: user?.user_type === 'producer',
    isRetailer: user?.user_type === 'retailer',
    checkAuthStatus,
    signOut,
    login,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
