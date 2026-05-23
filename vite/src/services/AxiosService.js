import axios from 'axios';
import { showSnackbar } from '../utils/snackbarNotif';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// =====================================================
// TOKENS
// =====================================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');

const saveTokens = (access, refresh) => {
  localStorage.setItem('token', access);
  if (refresh) localStorage.setItem('refreshToken', refresh);
};

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error);
    }

    if (!error.response && error.message === 'Network Error') {
      showSnackbar('Server is not running', 'error');
      return Promise.reject(error);
    }

    // ---------- 401 REFRESH TOKEN ----------
    if (status === 401 && !originalRequest?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const currentToken = getToken();
        const currentRefreshToken = getRefreshToken();
        const result = await axios.post(`${import.meta.env.VITE_API_URL}account/refresh-token`, {
          token: currentToken,
          refreshToken: currentRefreshToken
        });

        const newAccess = result.data.token;
        const newRefresh = result.data.refreshToken;

        saveTokens(newAccess, newRefresh);

        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + newAccess;

        processQueue(null, newAccess);
        isRefreshing = false;

        originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
        return axiosInstance(originalRequest);
      } catch (e) {
        console.log('Refresh token failed:', e);
        processQueue(e, null);
        isRefreshing = false;

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/authenticate';

        return Promise.reject(e);
      }
    }

    // ---------- OTROS ERRORES ----------
    if (status >= 500) {
      showSnackbar(`Server error (${status})`, 'error');
    } else if (!status || status < 400) {
      showSnackbar('Unexpected error', 'error');
    }
    // 4xx errors are handled by individual components to avoid
    // double notifications and show context-specific messages

    return Promise.reject(error);
  }
);

// =====================================================
// MÉTODOS EXPORTADOS
// =====================================================
const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config)
};

export default api;

// =====================================================
// MÉTODOS SOCIALES CON POPUP
// =====================================================
export const socialAPI = {
  getStatus: () => axiosInstance.get('/SocialAuth/status'),
  checkConnections: () => axiosInstance.get('/SocialAuth/connections/check'),

  connectFacebook: async (onSuccess) => {
    // <--- Recibe el callback
    try {
      const res = await api.post('/SocialAuth/facebook/connect');
      const url = res.data.url;

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(url, 'Facebook Connect', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`);

      const handleMessage = async (event) => {
        if (event.data.type === 'AUTH_SUCCESS') {
          console.log('¡Éxito! Facebook conectado');

          if (onSuccess) await onSuccess(); // <--- 2️⃣ Ejecuta el refresh aquí

          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  },

  facebookProfile: () => axiosInstance.get('/SocialAuth/facebook/test-profile'),
  postFacebook: async ({ message, photoUrl, caption }) => {
    try {
      const res = await api.post('/SocialAuth/facebook/post', { message, photoUrl, caption });
      console.log('Facebook API response:', res.data);
      return res.data;
    } catch (err) {
      console.error('Error posting to Facebook:', err);
      throw err;
    }
  },

  connectInstagram: () => (window.location.href = `${import.meta.env.VITE_API_URL}SocialAuth/instagram/connect`),
  connectYouTube: () => (window.location.href = `${import.meta.env.VITE_API_URL}SocialAuth/youtube/connect`),
  connectTikTok: () => (window.location.href = `${import.meta.env.VITE_API_URL}SocialAuth/tiktok/connect`),
  disconnect: (provider) => axiosInstance.post(`/SocialAuth/disconnect/${provider}`)
};
