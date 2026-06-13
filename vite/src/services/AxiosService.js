import axios from 'axios';
import { showSnackbar } from '../utils/snackbarNotif';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

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

// ─── Shared refresh function ──────────────────────────────────────────────────
export async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const currentToken = getToken();
    const currentRefreshToken = getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    const result = await axios.post(`${import.meta.env.VITE_API_URL}account/refresh-token`, {
      token: currentToken,
      refreshToken: currentRefreshToken
    });

    const newAccess = result.data.token;
    const newRefresh = result.data.refreshToken;

    saveTokens(newAccess, newRefresh);
    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + newAccess;
    processQueue(null, newAccess);

    return newAccess;
  } catch (e) {
    processQueue(e, null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/authenticate';
    throw e;
  } finally {
    isRefreshing = false;
  }
}

// ─── Interceptors ─────────────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;

    if (error.code === 'ERR_CANCELED') return Promise.reject(error);

    if (!error.response && error.message === 'Network Error') {
      showSnackbar('Server is not running', 'error');
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return axiosInstance(originalRequest);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    if (status >= 500) showSnackbar(`Server error (${status})`, 'error');
    else if (!status || status < 400) showSnackbar('Unexpected error', 'error');

    return Promise.reject(error);
  }
);

// ─── API helpers ──────────────────────────────────────────────────────────────
const api = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config)
};

export default api;

export const socialAPI = {
  getStatus: () => axiosInstance.get('/SocialAuth/status'),
  checkConnections: () => axiosInstance.get('/SocialAuth/connections/check'),
  getPages: () => axiosInstance.get('/SocialAuth/pages'),

  connectFacebook: (onComplete) => {
    api.post('/SocialAuth/facebook/connect')
      .then((res) => openPopup(res.data.url, 'Facebook', onComplete))
      .catch((err) => { console.error('Facebook connection error:', err); showSnackbar('Failed to start Facebook connection', 'error'); onComplete(false); });
  },

  connectInstagram: (onComplete) => {
    api.post('/SocialAuth/instagram/connect')
      .then((res) => openPopup(res.data.url, 'Instagram', onComplete))
      .catch((err) => { console.error('Instagram connection error:', err); showSnackbar('Failed to start Instagram connection', 'error'); onComplete(false); });
  },

  connectYouTube: (onComplete) => {
    api.post('/SocialAuth/youtube/connect')
      .then((res) => openPopup(res.data.url, 'YouTube', onComplete))
      .catch((err) => { console.error('YouTube connection error:', err); showSnackbar('Failed to start YouTube connection', 'error'); onComplete(false); });
  },

  connectTikTok: (onComplete) => {
    api.post('/SocialAuth/tiktok/connect')
      .then((res) => openPopup(res.data.url, 'TikTok', onComplete))
      .catch((err) => { console.error('TikTok connection error:', err); showSnackbar('Failed to start TikTok connection', 'error'); onComplete(false); });
  },

  connectMultiple: (platforms, onProgress, onComplete) => {
    const results = {};
    let completed = 0;

    const finishOne = (platform, success) => {
      results[platform] = success;
      completed++;
      onProgress(platform, success, completed, platforms.length);
      if (completed === platforms.length) {
        onComplete(results);
      }
    };

    platforms.forEach((platform) => {
      const methods = {
        Facebook: socialAPI.connectFacebook,
        Instagram: socialAPI.connectInstagram,
        YouTube: socialAPI.connectYouTube,
        TikTok: socialAPI.connectTikTok,
      };
      const method = methods[platform];
      if (method) {
        method((success) => finishOne(platform, success));
      } else {
        finishOne(platform, false);
      }
    });
  },

  facebookProfile: () => axiosInstance.get('/SocialAuth/facebook/test-profile'),
  postFacebook: (data) => {
    return api.post('/SocialPost/publish', data);
  },

  getPostHistory: (page = 1, pageSize = 20) => {
    return axiosInstance.get(`/SocialPost/history?page=${page}&pageSize=${pageSize}`);
  },
  cleanupHistory: (daysToKeep = 30) => {
    return axiosInstance.post(`/SocialPost/history/cleanup?daysToKeep=${daysToKeep}`);
  },
  postFacebookText: (message, pageId) => {
    const data = { message };
    if (pageId) data.pageId = pageId;
    return api.post('/SocialAuth/facebook/post', data);
  },
  postFacebookPhoto: (message, photoUrl, caption, pageId) => {
    const data = { message, photoUrl, caption: caption || message };
    if (pageId) data.pageId = pageId;
    return api.post('/SocialAuth/facebook/photo', data);
  },

  disconnect: (provider) => axiosInstance.delete(`/SocialAuth/disconnect/${provider}`),

  getPresignedUrl: (fileName, contentType) => {
    return api.post('/socialpost/s3/presigned', { fileName, contentType });
  },

  publishAsync: (data) => {
    return api.post('/socialpost/publish', data);
  },

  uploadToS3: async (url, file, contentType, onProgress) => {
    return axios.put(url, file, {
      headers: { 'Content-Type': contentType },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });
  }
};

function openPopup(url, platform, onComplete) {
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(url, `${platform} Connect`, `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`);

  if (!popup) {
    showSnackbar('Pop-up blocked. Please allow pop-ups for this site.', 'error');
    onComplete(false);
    return;
  }

  let resolved = false;

  const finish = (success, message) => {
    if (resolved) return;
    resolved = true;
    clearTimeout(maxTimeout);
    window.removeEventListener('storage', handleStorage);
    try { popup.close(); } catch {}
    try { localStorage.removeItem('social_auth_result'); } catch {}
    if (message) showSnackbar(message, success ? 'success' : 'error');
    onComplete(success);
  };

  const handleStorage = (e) => {
    if (e.key !== 'social_auth_result' || !e.newValue) return;
    try {
      const result = JSON.parse(e.newValue);
      if (!result || !result.ts || Date.now() - result.ts > 30000) return;

      const resultProvider = result.data?.provider || '';
      if (resultProvider && resultProvider.toLowerCase() !== platform.toLowerCase()) return;

      if (result.type === 'AUTH_SUCCESS') {
        finish(true, `${result.data?.provider || platform} connected successfully`);
      } else if (result.type === 'AUTH_ERROR') {
        console.error('Social auth error received:', result);
        finish(false, result.message || `Failed to connect ${platform}`);
      }
    } catch {}
  };

  window.addEventListener('storage', handleStorage);

  const maxTimeout = setTimeout(() => {
    finish(false, `${platform} connection timed out. Please try again.`);
  }, 120000);
}
