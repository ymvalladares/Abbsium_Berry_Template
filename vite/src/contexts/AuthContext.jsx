import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/AxiosService';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (!stored || stored === 'undefined') return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [authError, setAuthError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('accessToken'));

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('account/login', { email, password });

      localStorage.setItem('accessToken', res.data.token);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.data.userName));

      setUser(res.data.userName);
      setToken(res.data.token);

      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Error al iniciar sesión.';
      setAuthError(message);
      return false;
    }
  }, []);

  // ======================== LOGOUT ========================
  const logout = useCallback(async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        await api.post('account/logout', {
          accessToken,
          refreshToken
        });
      }
    } catch (err) {
      console.warn('Logout request failed, cleaning anyway.');
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setUser(null);
    setToken(null);
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      setAuthError('');

      const res = await api.post('account/forgetPassword', { email });

      return {
        success: true,
        message: res.data?.message || 'Check your email with the instructions'
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to send the request. Try later';
      setAuthError(message);

      return {
        success: false,
        message
      };
    }
  }, []);

  const values = {
    user,
    token,
    login,
    logout,
    forgotPassword,
    authError,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
