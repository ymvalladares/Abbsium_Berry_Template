import axios from 'axios';
import { showSnackbar } from '../utils/snackbarNotif';

const baseURL = 'https://abbsium.onrender.com/';
// const baseURL = 'https://localhost:44328/';

const axiosInstance = axios.create({
  baseURL,
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
    console.log('Error response interceptor:', error);
    const status = error.response?.status;
    const originalRequest = error.config;

    console.log('Status:', status);

    // ---------- 401 REFRESH TOKEN ----------
    if (status === 401 && !originalRequest._retry) {
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
        const token = getToken();
        const refreshToken = getRefreshToken();
        const result = await axios.post(`${baseURL}account/refresh-token`, {
          token,
          refreshToken
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

        localStorage.clear();
        window.location.href = '/authenticate';

        return Promise.reject(e);
      }
    }

    // ---------- OTROS ERRORES ----------
    switch (status) {
      case 400:
        showSnackbar('Bad request (400)', 'error');
        break;
      case 403:
        showSnackbar('Forbidden (403)', 'info');
        localStorage.clear();
        window.location.href = '/login';
        break;
      case 404:
        showSnackbar('Not found (404)', 'error');
        break;
      case 500:
        showSnackbar('Server error (500)', 'error');
        break;
      default:
        showSnackbar('Unexpected error', 'error');
    }

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

  // Otros providers aún usando redirect normal
  connectInstagram: () => (window.location.href = `${baseURL}SocialAuth/instagram/connect`),
  connectYouTube: () => (window.location.href = `${baseURL}SocialAuth/youtube/connect`),
  connectTikTok: () => (window.location.href = `${baseURL}SocialAuth/tiktok/connect`),
  disconnect: (provider) => axiosInstance.post(`/SocialAuth/disconnect/${provider}`)
};
