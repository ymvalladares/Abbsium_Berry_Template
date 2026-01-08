import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/AxiosService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);

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
        localStorage.setItem('accessToken', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(res.data.userName));

        setToken(res.data.token);
        setUser(res.data.userName);

        return { success: true }; // 🔑 CLAVE
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

  const clearAuthFeedback = () => {
    setAuthError('');
    setAuthMessage('');
  };

  const logout = useCallback(async () => {
    localStorage.clear();
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
        clearAuthFeedback,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
