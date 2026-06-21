import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Chip,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Checkbox,
  IconButton,
  alpha,
  Dialog,
  Fade,
  Skeleton
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconCheck,
  IconPlus,
  IconLogout,
  IconSearch,
  IconRefresh,
  IconChecklist,
  IconAlertCircle,
  IconX,
  IconUsers,
  IconChartBar,
  IconCalendar,
  IconClock,
  IconTrendingUp
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { showSnackbar } from '../../../utils/snackbarNotif';
import Loader from '../../../ui-component/Loader';

const PLATFORMS = [
  { name: 'Facebook', icon: IconBrandFacebook, color: '#1877F2', desc: 'Pages & profiles' },
  { name: 'Instagram', icon: IconBrandInstagram, color: '#E4405F', desc: 'Business accounts' },
  { name: 'YouTube', icon: IconBrandYoutube, color: '#FF0000', desc: 'Channels & videos' },
  { name: 'TikTok', icon: IconBrandTiktok, color: '#000000', desc: 'Creator accounts' },
  { name: 'X (Twitter)', icon: IconBrandTwitter, color: '#1DA1F2', desc: 'Personal & brand' },
  { name: 'LinkedIn', icon: IconBrandLinkedin, color: '#0A66C2', desc: 'Professional network' },
  { name: 'Pinterest', icon: IconBrandPinterest, color: '#E60023', desc: 'Boards & pins' }
];

const connectMethods = {
  Facebook: socialAPI.connectFacebook.bind(socialAPI),
  Instagram: socialAPI.connectInstagram.bind(socialAPI),
  YouTube: socialAPI.connectYouTube.bind(socialAPI),
  TikTok: socialAPI.connectTikTok.bind(socialAPI)
};

function ConnectionModal({ open, onClose, platform, conn }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  if (!platform || !conn) return null;
  const Icon = platform.icon;

  const stats = [
    {
      label: 'Account Name',
      value: conn?.accountName || '—',
      icon: IconUsers,
      color: '#8b5cf6'
    },
    {
      label: 'Status',
      value: conn?.isActive ? 'Active' : 'Inactive',
      icon: IconCheck,
      color: conn?.isActive ? '#22c55e' : '#f59e0b'
    },
    {
      label: 'Connected Since',
      value: conn?.createdAt
        ? new Date(conn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
      icon: IconCalendar,
      color: '#3b82f6'
    },
    {
      label: 'Token Expires',
      value: conn?.expiresAt
        ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—',
      icon: IconClock,
      color: '#f59e0b'
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', bgcolor: isDark ? '#111827' : undefined } }}
      TransitionComponent={Fade}
      transitionDuration={200}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            height: 80,
            background: `linear-gradient(135deg, ${platform.color}, ${alpha(platform.color, 0.7)})`,
            display: 'flex',
            alignItems: 'center',
            px: 3,
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: 'background.paper',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Icon size={24} style={{ color: platform.color }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
              {platform.name}
            </Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), fontSize: '0.85rem' }}>
              {conn?.accountName || platform.name}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: alpha('#fff', 0.2),
            color: '#fff',
            '&:hover': { bgcolor: alpha('#fff', 0.3) }
          }}
        >
          <IconX size={18} />
        </IconButton>

        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: conn?.isActive ? '#22c55e' : '#f59e0b',
                boxShadow: conn?.isActive ? '0 0 8px rgba(34,197,94,0.4)' : '0 0 8px rgba(245,158,11,0.4)'
              }}
            />
            <Typography variant="body2" sx={{ fontWeight: 600, color: conn?.isActive ? '#22c55e' : '#f59e0b' }}>
              {conn?.isActive ? 'Connected & Active' : 'Connected & Inactive'}
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Box key={stat.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? '#1e293b' : 'grey.50', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <StatIcon size={18} style={{ color: stat.color }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
}

export default function SocialHub() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [connecting, setConnecting] = useState({});
  const [selectMode, setSelectMode] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [modalPlatform, setModalPlatform] = useState(null);
  const [modalConn, setModalConn] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await socialAPI.checkConnections();
      const map = {};
      PLATFORMS.forEach((p) => {
        map[p.name] = {
          id: null,
          connected: false,
          isActive: false,
          expiresAt: null,
          createdAt: null,
          providerAccountId: null,
          scope: null,
          accountName: null
        };
      });
      const providerNameMap = {
        facebook: 'Facebook',
        instagram: 'Instagram',
        youtube: 'YouTube',
        tiktok: 'TikTok',
        twitter: 'X (Twitter)',
        linkedin: 'LinkedIn',
        pinterest: 'Pinterest'
      };
      res.data.forEach((item) => {
        const key = providerNameMap[item.provider] || item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
        if (map.hasOwnProperty(key)) {
          map[key] = {
            id: item.id || null,
            connected: item.connected,
            isActive: item.isActive,
            expiresAt: item.expiresAt,
            createdAt: item.createdAt,
            providerAccountId: item.providerAccountId,
            scope: item.scope,
            accountName: item.accountName || key
          };
        }
      });
      setConnections(map);
    } catch (err) {
      console.error('Error fetching social connections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    const handleAuthResult = (e) => {
      if (e.key !== 'social_auth_result' || !e.newValue) return;
      try {
        const result = JSON.parse(e.newValue);
        if (!result || !result.ts || Date.now() - result.ts > 30000) return;
        if (result.type === 'AUTH_SUCCESS') {
          localStorage.removeItem('social_auth_result');
          setTimeout(() => fetchStatus(), 500);
        } else if (result.type === 'AUTH_ERROR') {
          localStorage.removeItem('social_auth_result');
        }
      } catch {}
    };
    window.addEventListener('storage', handleAuthResult);
    return () => window.removeEventListener('storage', handleAuthResult);
  }, [fetchStatus]);

  const handleConnect = useCallback((platform) => {
    setConnecting((prev) => ({ ...prev, [platform]: true }));
    const method = connectMethods[platform];
    if (method) {
      method(() => {
        setConnecting((prev) => ({ ...prev, [platform]: false }));
        fetchStatus();
      });
    }
  }, []);

  const handleDisconnect = async (platform) => {
    try {
      await socialAPI.disconnect(platform);
      setConnections((prev) => ({
        ...prev,
        [platform]: {
          id: null,
          connected: false,
          isActive: false,
          expiresAt: null,
          createdAt: null,
          providerAccountId: null,
          scope: null,
          accountName: null
        }
      }));
      if (modalPlatform === platform) setModalPlatform(null);
      showSnackbar(`${platform} disconnected`, 'success');
    } catch (err) {
      showSnackbar(err?.response?.data?.error || `Failed to disconnect ${platform}`, 'error');
    }
  };

  const toggleSelect = (platform) =>
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]));
  const selectAllDisconnected = () => setSelectedPlatforms(PLATFORMS.filter((p) => !connections[p.name]?.connected).map((p) => p.name));
  const clearSelection = () => {
    setSelectedPlatforms([]);
    setSelectMode(false);
  };

  const handleMultiConnect = () => {
    if (selectedPlatforms.length === 0) return;
    const available = selectedPlatforms.filter((p) => connectMethods[p]);
    socialAPI.connectMultiple(
      available,
      () => {},
      async (results) => {
        clearSelection();
        const successCount = Object.values(results).filter(Boolean).length;
        if (successCount > 0) showSnackbar(`${successCount} platform${successCount > 1 ? 's' : ''} connected`, 'success');
        await fetchStatus();
      }
    );
  };

  const openModal = (platform) => {
    setModalPlatform(platform);
    setModalConn(connections[platform.name]);
  };

  const connectedCount = Object.values(connections).filter((x) => x?.connected).length;
  const filtered = PLATFORMS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const isConnected = connections[p.name]?.connected;
    if (filter === 'connected') return matchesSearch && isConnected;
    if (filter === 'available') return matchesSearch && !isConnected;
    return matchesSearch;
  });

  if (loading) {
    return (
      <Box sx={{ width: { xs: '100%', lg: 'var(--app-content-width)' }, mx: 'auto', py: { xs: 3, sm: 5 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Skeleton width={100} height={28} />
            <Skeleton width={80} height={28} />
          </Box>
          <Skeleton variant="rounded" width="100%" height={80} sx={{ mb: 3, borderRadius: 3 }} />
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Skeleton width={320} height={38} />
            <Skeleton width={200} height={38} />
          </Box>
          <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
            {Array.from({ length: 5 }).map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  borderBottom: idx < 4 ? '1px solid' : 'none',
                  borderColor: 'divider'
                }}
              >
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width={100} height={16} sx={{ mb: 0.5 }} />
                  <Skeleton width={140} height={12} />
                </Box>
                <Skeleton width={90} height={32} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
      <Box sx={{ width: { xs: '100%', lg: 'var(--app-content-width)' }, mx: 'auto', py: { xs: 3, sm: 5 }, px: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${connectedCount}/${PLATFORMS.length} connected`}
              size="small"
              sx={{ borderRadius: 1.5, fontWeight: 600, bgcolor: alpha('#22c55e', 0.1), color: '#22c55e', fontSize: '0.75rem' }}
            />
            <Button
              size="small"
              variant={selectMode ? 'contained' : 'outlined'}
              startIcon={<IconChecklist size={16} />}
              onClick={() => {
                if (selectMode) clearSelection();
                else setSelectMode(true);
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                ...(selectMode && { bgcolor: '#8b5cf6', '&:hover': { bgcolor: alpha('#8b5cf6', 0.85) } })
              }}
            >
              {selectMode ? 'Done' : 'Select All'}
            </Button>
          </Stack>
          <IconButton size="small" onClick={fetchStatus} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
            <IconRefresh size={16} />
          </IconButton>
        </Stack>

        <Box
          sx={{
            mb: 3,
            p: 1.5,
            borderRadius: 2.5,
            background: `linear-gradient(135deg, ${alpha('#8b5cf6', 0.08)}, ${alpha('#3b82f6', 0.06)})`,
            border: `1px solid ${alpha('#8b5cf6', 0.15)}`,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha('#8b5cf6', 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconAlertCircle size={20} style={{ color: '#8b5cf6' }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25, fontSize: '0.9rem' }}>
              Your Privacy Matters
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem', lineHeight: 1.5 }}>
              We use secure OAuth 2.0 authentication. Your social media credentials are never stored on our servers
            </Typography>
          </Box>
        </Box>

        {selectMode && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              borderRadius: 2.5,
              bgcolor: alpha('#8b5cf6', 0.04),
              border: `1px solid ${alpha('#8b5cf6', 0.12)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Checkbox
                size="small"
                checked={
                  selectedPlatforms.length === PLATFORMS.filter((p) => !connections[p.name]?.connected).length &&
                  PLATFORMS.filter((p) => !connections[p.name]?.connected).length > 0
                }
                onChange={(e) => {
                  if (e.target.checked) selectAllDisconnected();
                  else setSelectedPlatforms([]);
                }}
                sx={{ p: 0.5 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {selectedPlatforms.length > 0
                  ? `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected`
                  : 'Select platforms to connect'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                onClick={clearSelection}
                sx={{
                  borderRadius: 1.5,
                  px: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  color: 'text.secondary'
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                disabled={selectedPlatforms.length === 0}
                onClick={handleMultiConnect}
                sx={{
                  borderRadius: 2,
                  px: 2.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: '#8b5cf6',
                  '&:hover': { bgcolor: alpha('#8b5cf6', 0.85) }
                }}
              >
                Connect {selectedPlatforms.length > 0 ? `(${selectedPlatforms.length})` : ''}
              </Button>
            </Stack>
          </Box>
        )}

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search platforms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={15} style={{ color: theme.vars.palette.text.secondary }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                '& fieldset': { border: 'none' },
                bgcolor: 'background.paper',
                fontSize: '0.85rem',
                height: 38,
                boxShadow: `0 1px 3px ${alpha('#000', 0.04)}`
              }
            }}
            sx={{ width: { xs: '100%', sm: 320 } }}
          />
          <Box
            sx={{
              p: 0.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              display: 'flex',
              gap: 0.5,
              boxShadow: `0 1px 3px ${alpha('#000', 0.04)}`,
              flexShrink: 0
            }}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'connected', label: 'Connected' },
              { key: 'available', label: 'Available' }
            ].map((f) => (
              <Button
                key={f.key}
                size="small"
                onClick={() => setFilter(f.key)}
                sx={{
                  borderRadius: 1.5,
                  px: { xs: 1.5, sm: 2 },
                  py: 0.4,
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  color: filter === f.key ? '#fff' : (isDark ? '#94a3b8' : 'text.secondary'),
                  bgcolor: filter === f.key ? (isDark ? '#8b5cf6' : 'text.primary') : 'transparent',
                  '&:hover': { bgcolor: filter === f.key ? (isDark ? '#7c3aed' : 'text.primary') : 'action.hover' },
                  transition: 'all 0.2s ease'
                }}
              >
                {f.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden', bgcolor: 'background.paper' }}>
          {filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No platforms found
              </Typography>
            </Box>
          ) : (
            filtered.map((platform, idx) => {
              const conn = connections[platform.name] || {};
              const isConnected = conn?.connected;
              const isConnecting = connecting[platform.name] || false;
              const Icon = platform.icon;

              return (
                <Box
                  key={platform.name}
                  onClick={() => isConnected && openModal(platform.name)}
                  sx={{
                    py: { xs: 1, sm: 1.25 },
                    px: { xs: 1.5, sm: 2 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    transition: 'all 0.15s',
                    cursor: isConnected ? 'pointer' : 'default',
                    bgcolor: isConnected ? alpha(platform.color, 0.02) : 'transparent',
                    '&:hover': { bgcolor: isConnected ? alpha(platform.color, 0.05) : 'action.hover' },
                    borderBottom: idx < filtered.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}
                >
                  {selectMode && !isConnected && (
                    <Checkbox
                      size="small"
                      checked={selectedPlatforms.includes(platform.name)}
                      onChange={() => toggleSelect(platform.name)}
                      sx={{ p: 0, mr: -0.5 }}
                    />
                  )}

                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isConnected ? platform.color : 'background.paper',
                      border: `1px solid ${isConnected ? 'transparent' : alpha(platform.color, 0.15)}`,
                      boxShadow: isConnected ? `0 3px 8px ${alpha(platform.color, 0.25)}` : `0 1px 3px ${alpha('#000', 0.04)}`,
                      flexShrink: 0,
                      transition: 'all 0.2s'
                    }}
                  >
                    {isConnecting ? (
                      <CircularProgress size={16} thickness={4} sx={{ color: isConnected ? '#fff' : platform.color }} />
                    ) : (
                      <Icon size={18} style={{ color: isConnected ? '#fff' : platform.color }} />
                    )}
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {platform.name}
                      </Typography>
                      {isConnected && <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#22c55e' }} />}
                    </Stack>
                    {isConnected ? (
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.78rem' }}>
                        {conn?.accountName || platform.name}
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.78rem' }}>
                        {platform.desc}
                      </Typography>
                    )}
                  </Box>

                  {isConnected && (
                    <Stack direction="row" spacing={2.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            display: 'block',
                            color: conn?.isActive ? 'text.primary' : 'text.disabled'
                          }}
                        >
                          {conn?.isActive ? 'Active' : 'Inactive'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                          Status
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.85rem', display: 'block' }}>
                          {conn?.expiresAt ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                          Expires
                        </Typography>
                      </Box>
                    </Stack>
                  )}

                  <Button
                    size="small"
                    disabled={isConnecting || (selectMode && !isConnected)}
                    onClick={(e) => {
                      e.stopPropagation();
                      isConnected ? handleDisconnect(platform.name) : handleConnect(platform.name);
                    }}
                    sx={{
                      borderRadius: 1.5,
                      px: 2,
                      py: 0.5,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.78rem',
                      minWidth: 90,
                      ...(isConnected
                        ? {
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.secondary',
                            bgcolor: 'transparent',
                            '&:hover': { borderColor: '#ef4444', color: '#ef4444', bgcolor: alpha('#ef4444', 0.04) }
                          }
                        : {
                            bgcolor: platform.color,
                            color: '#fff',
                            border: '1px solid transparent',
                            '&:hover': { bgcolor: alpha(platform.color, 0.85) }
                          }),
                      ...(selectMode && !isConnected && { opacity: 0.3, pointerEvents: 'none' })
                    }}
                    startIcon={
                      isConnecting ? (
                        <CircularProgress size={12} thickness={4} sx={{ color: 'inherit' }} />
                      ) : !isConnected ? (
                        <IconPlus size={14} />
                      ) : null
                    }
                  >
                    {isConnecting ? '...' : isConnected ? 'Disconnect' : 'Connect'}
                  </Button>
                </Box>
              );
            })
          )}
        </Box>

        <ConnectionModal
          open={!!modalPlatform}
          onClose={() => setModalPlatform(null)}
          platform={PLATFORMS.find((p) => p.name === modalPlatform)}
          conn={modalConn}
        />
      </Box>
    </Box>
  );
}
