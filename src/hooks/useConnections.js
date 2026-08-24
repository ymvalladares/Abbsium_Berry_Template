import { useState, useCallback, useRef } from 'react';
import { socialAPI } from '../services/AxiosService';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'X' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'pinterest', name: 'Pinterest' }
];

export function useConnections() {
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [pages, setPages] = useState({});
  const [loadingPages, setLoadingPages] = useState(false);
  const fetchedRef = useRef(false);
  const dataRef = useRef(null);

  const fetchPages = useCallback(async (force = false) => {
    if (!force && fetchedRef.current && dataRef.current) {
      setConnectedPlatforms(dataRef.current.connectedPlatforms);
      setPages(dataRef.current.pages);
      return;
    }

    setLoadingPages(true);
    try {
      const res = await socialAPI.checkConnections();
      const providerNameMap = {
        facebook: 'Facebook',
        instagram: 'Instagram',
        youtube: 'YouTube',
        tiktok: 'TikTok',
        twitter: 'X',
        linkedin: 'LinkedIn',
        pinterest: 'Pinterest'
      };

      const connected = [];
      const pagesMap = {};
      res.data.forEach((item) => {
        if (item.connected && item.isActive) {
          const key = providerNameMap[item.provider] || item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
          const platformId = PLATFORMS.find((p) => p.name === key)?.id || item.provider.toLowerCase();
          connected.push(platformId);
          pagesMap[platformId] = {
            id: item.id,
            accountName: item.accountName || key,
            providerAccountId: item.providerAccountId,
            scope: item.scope,
            expiresAt: item.expiresAt,
            createdAt: item.createdAt
          };
        }
      });

      setConnectedPlatforms(connected);
      setPages(pagesMap);
      fetchedRef.current = true;
      dataRef.current = { connectedPlatforms: connected, pages: pagesMap };
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoadingPages(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchedRef.current = false;
    dataRef.current = null;
    return fetchPages(true);
  }, [fetchPages]);

  return { connectedPlatforms, pages, loadingPages, fetchPages, refresh };
}
