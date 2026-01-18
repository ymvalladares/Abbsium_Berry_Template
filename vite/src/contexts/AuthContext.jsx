import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/AxiosService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const authenticate = useCallback(async (action, payload) => {
    setAuthLoading(true);
    setAuthError('');
    setAuthMessage('');

    try {
      const res = await api.post(`account/${action}`, payload);

      if (action === 'login') {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data));

        setToken(res.data.token);
        setUser(res.data);

        return { success: true };
      }

      setAuthMessage(res.data?.message || (action === 'register' ? 'User created successfully' : 'Check your email for instructions'));

      return { success: true };
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Something went wrong. Try again.');
      return { success: false };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post('/account/logout');

    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setToken(null);
    setUser(null);

    return { success: true };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        authLoading,
        authError,
        authMessage,
        logout,
        user,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
