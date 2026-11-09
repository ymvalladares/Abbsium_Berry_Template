import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api, { refreshAccessToken } from '../services/AxiosService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const rehydrate = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const refreshToken = localStorage.getItem('refreshToken');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));

        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(atob(parts[1]));
            const expiresAt = decoded.exp * 1000;
            const now = Date.now();
            const timeLeft = expiresAt - now;

            if (timeLeft < 5 * 60 * 1000 && refreshToken) {
              await refreshAccessToken();

              const newToken = localStorage.getItem('token');
              const newUser = localStorage.getItem('user');
              if (newToken) setToken(newToken);
              if (newUser) setUser(JSON.parse(newUser));
            }
          }
        } catch (err) {
          console.warn('Token refresh check failed:', err.message);
        }
      }

      setAuthLoading(false);
    };

    rehydrate();
  }, []);

  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      try {
        await refreshAccessToken();

        const newToken = localStorage.getItem('token');
        const newUser = localStorage.getItem('user');
        if (newToken) setToken(newToken);
        if (newUser) setUser(JSON.parse(newUser));
      } catch (err) {
        console.warn('Periodic token refresh failed:', err.message);
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token]);

  const authenticate = useCallback(async (action, payload) => {
    setAuthLoading(true);
    try {
      const res = await api.post(`account/${action}`, payload);

      if (action === 'login') {
        if (res.data?.data?.requiresVerification) {
          return { success: true, requiresVerification: true, email: res.data.data.email };
        }

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data));

        setToken(res.data.token);
        setUser(res.data);
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message, data: err.response?.data?.data };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const verifyLoginCode = useCallback(async (email, code) => {
    try {
      const res = await api.post('account/verify-login-code', { email, code });

      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data));

        setToken(res.data.token);
        setUser(res.data);
        return { success: true };
      }

      return { success: false, message: 'Verification failed.' };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid verification code.' };
    }
  }, []);

  const resendLoginCode = useCallback(async (email) => {
    try {
      const res = await api.post('account/send-login-code', { email });
      return { success: true, message: res.data?.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to resend code.' };
    }
  }, []);

  const googleLogin = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/account/logout');
    } catch {}

    localStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => {
    return user?.rol?.includes('Admin') ?? false;
  }, [user]);

  const value = {
    user,
    token,
    isAdmin,
    authenticate,
    logout,
    setUser,
    googleLogin,
    verifyLoginCode,
    resendLoginCode,
    isAuthenticated: !!token,
    authLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
