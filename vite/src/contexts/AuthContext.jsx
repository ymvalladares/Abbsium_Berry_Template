import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/AxiosService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const [authLoading, setAuthLoading] = useState(true);

  // 🔒 Rehidratación segura
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setAuthLoading(false);
  }, []);

  const authenticate = useCallback(async (action, payload) => {
    try {
      const res = await api.post(`account/${action}`, payload);

      if (action === 'login') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data));

        setToken(res.data.token);
        setUser(res.data);
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/account/logout');
    } catch {}

    localStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  // ✅ isAdmin DERIVADO, NO MUTABLE
  const isAdmin = useMemo(() => {
    return user?.rol?.includes('Admin') ?? false;
  }, [user]);

  const value = {
    user,
    token,
    isAdmin,
    authenticate,
    logout,
    isAuthenticated: !!token,
    authLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
