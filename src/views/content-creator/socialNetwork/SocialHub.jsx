import { useState, useEffect, useCallback, useRef, memo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  IconButton,
  alpha,
  Dialog,
  Fade,
  Skeleton,
  Collapse
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
  IconSearch,
  IconAlertCircle,
  IconX,
  IconUsers,
  IconCalendar,
  IconClock,
  IconShieldCheck,
  IconChevronDown,
  IconChevronUp,
  IconWorld
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';
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
    { label: 'Account Name', value: conn?.accountName || '—', icon: IconUsers, color: '#2563eb' },
    { label: 'Status', value: conn?.isActive ? 'Active' : 'Inactive', icon: IconCheck, color: conn?.isActive ? '#22c55e' : '#f59e0b' },
    { label: 'Connected Since', value: conn?.createdAt ? new Date(conn.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', icon: IconCalendar, color: '#3b82f6' },
    { label: 'Token Expires', value: conn?.expiresAt ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', icon: IconClock, color: '#f59e0b' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '28px', overflow: 'hidden', boxShadow: isDark ? '0 25px 60px rgba(0,0,0,0.5)' : '0 25px 60px rgba(0,0,0,0.15)', bgcolor: isDark ? 'rgba(15, 23, 42, 0.95)' : undefined, backdropFilter: 'blur(20px)' } }} TransitionComponent={Fade} transitionDuration={200}>
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ height: 100, background: `linear-gradient(135deg, ${platform.color}, ${alpha(platform.color, 0.6)})`, display: 'flex', alignItems: 'center', px: 3, gap: 2 }}>
          <Box sx={{ width: 56, height: 56, borderRadius: '18px', bgcolor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <Icon size={28} style={{ color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>{platform.name}</Typography>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), fontSize: '0.85rem' }}>{conn?.accountName || platform.name}</Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', width: 32, height: 32, '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}>
          <IconX size={16} />
        </IconButton>

        <Box sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: conn?.isActive ? '#22c55e' : '#f59e0b', boxShadow: conn?.isActive ? '0 0 12px rgba(34,197,94,0.5)' : '0 0 12px rgba(245,158,11,0.5)' }} />
            <Typography variant="body2" sx={{ fontWeight: 700, color: conn?.isActive ? '#22c55e' : '#f59e0b', fontSize: '0.85rem' }}>
              {conn?.isActive ? 'Connected & Active' : 'Connected & Inactive'}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            {stats.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <Box key={stat.label} sx={{ p: 2, borderRadius: '18px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : alpha(stat.color, 0.04), border: '1px solid', borderColor: isDark ? alpha('#fff', 0.06) : alpha(stat.color, 0.08), display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: alpha(stat.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <StatIcon size={20} style={{ color: stat.color }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>{stat.value}</Typography>
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

const PlatformRow = memo(function PlatformRow({ platform, conn, isConnecting, onConnect, onDisconnect, onOpenModal }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isConnected = conn?.connected;
  const Icon = platform.icon;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Box
      sx={{
        py: 2,
        px: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        transition: 'all 0.2s ease',
        cursor: isConnected ? 'pointer' : 'default',
        bgcolor: isConnected ? alpha(platform.color, 0.02) : 'transparent',
        '&:hover': { bgcolor: isConnected ? alpha(platform.color, 0.05) : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' },
        borderBottom: '1px solid',
        borderColor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04)
      }}
      onClick={() => isConnected && onOpenModal(platform.name)}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isConnected ? platform.color : alpha(platform.color, 0.08),
          border: isConnected ? 'none' : `1px solid ${alpha(platform.color, 0.15)}`,
          boxShadow: isConnected ? `0 4px 16px ${alpha(platform.color, 0.3)}` : 'none',
          flexShrink: 0,
          transition: 'all 0.3s'
        }}
      >
        {isConnecting ? (
          <CircularProgress size={18} thickness={4} sx={{ color: '#fff' }} />
        ) : (
          <Icon size={20} style={{ color: isConnected ? '#fff' : platform.color }} />
        )}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{platform.name}</Typography>
          {isConnected && <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.5)' }} />}
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
          {isConnected ? conn?.accountName || platform.name : platform.desc}
        </Typography>
      </Box>

      {isConnected && (
        <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.85rem', display: 'block', color: conn?.isActive ? 'text.primary' : 'text.disabled' }}>
              {conn?.isActive ? 'Active' : 'Inactive'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>Status</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.85rem', display: 'block' }}>
              {conn?.expiresAt ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>Expires</Typography>
          </Box>
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="center">
        {isConnected && (
          <Button size="small" onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }} sx={{ borderRadius: '10px', px: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', '&:hover': { bgcolor: alpha('#2563eb', 0.06) } }}>
            {showDetails ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
          </Button>
        )}
        <Button
          size="small"
          disabled={isConnecting}
          onClick={(e) => {
            e.stopPropagation();
            isConnected ? onDisconnect(platform.name) : onConnect(platform.name);
          }}
          sx={{
            borderRadius: '12px',
            px: 2,
            py: 0.5,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.78rem',
            minWidth: 100,
            transition: 'all 0.2s',
            ...(isConnected
              ? {
                  border: '1px solid',
                  borderColor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.08),
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  '&:hover': { borderColor: '#ef4444', color: '#ef4444', bgcolor: alpha('#ef4444', 0.04) }
                }
              : {
                  bgcolor: platform.color,
                  color: '#fff',
                  border: '1px solid transparent',
                  boxShadow: `0 2px 12px ${alpha(platform.color, 0.25)}`,
                  '&:hover': { bgcolor: alpha(platform.color, 0.85), boxShadow: `0 4px 20px ${alpha(platform.color, 0.35)}` }
                })
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
      </Stack>
    </Box>
  );
});

export default function SocialHub() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();

  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [connecting, setConnecting] = useState({});
  const [modalPlatform, setModalPlatform] = useState(null);
  const [modalConn, setModalConn] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setSearch('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await socialAPI.checkConnections();
      const map = {};
      PLATFORMS.forEach((p) => {
        map[p.name] = { id: null, connected: false, isActive: false, expiresAt: null, createdAt: null, providerAccountId: null, scope: null, accountName: null };
      });
      const providerNameMap = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', twitter: 'X (Twitter)', linkedin: 'LinkedIn', pinterest: 'Pinterest' };
      res.data.forEach((item) => {
        const key = providerNameMap[item.provider] || item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
        if (map.hasOwnProperty(key)) {
          map[key] = { id: item.id || null, connected: item.connected, isActive: item.isActive, expiresAt: item.expiresAt, createdAt: item.createdAt, providerAccountId: item.providerAccountId, scope: item.scope, accountName: item.accountName || key };
        }
      });
      setConnections(map);
    } catch (err) {
      console.error('Error fetching social connections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  useEffect(() => {
    const handleAuthResult = (e) => {
      if (e.key !== 'social_auth_result' || !e.newValue) return;
      try {
        const result = JSON.parse(e.newValue);
        if (!result || !result.ts || Date.now() - result.ts > 30000) return;
        if (result.type === 'AUTH_SUCCESS') { localStorage.removeItem('social_auth_result'); setTimeout(() => fetchStatus(), 500); }
        else if (result.type === 'AUTH_ERROR') { localStorage.removeItem('social_auth_result'); }
      } catch {}
    };
    window.addEventListener('storage', handleAuthResult);
    return () => window.removeEventListener('storage', handleAuthResult);
  }, [fetchStatus]);

  const handleConnect = useCallback((platform) => {
    setConnecting((prev) => ({ ...prev, [platform]: true }));
    const method = connectMethods[platform];
    if (method) { method(() => { setConnecting((prev) => ({ ...prev, [platform]: false })); fetchStatus(); }); }
  }, []);

  const handleDisconnect = async (platform) => {
    try {
      await socialAPI.disconnect(platform);
      setConnections((prev) => ({ ...prev, [platform]: { id: null, connected: false, isActive: false, expiresAt: null, createdAt: null, providerAccountId: null, scope: null, accountName: null } }));
      if (modalPlatform === platform) setModalPlatform(null);
      notify.success(`${platform} disconnected`, 'Platform Disconnected');
    } catch (err) { notify.error(err?.response?.data?.error || `Failed to disconnect ${platform}`, 'Disconnect Failed'); }
  };

  const openModal = (platform) => { setModalPlatform(platform); setModalConn(connections[platform.name]); };

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
      <Box sx={{ width: '100%', py: { xs: 1, sm: 2 } }}>
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
            <Box key={idx} sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: idx < 4 ? '1px solid' : 'none', borderColor: 'divider' }}>
              <Skeleton variant="circular" width={36} height={36} />
              <Box sx={{ flex: 1 }}><Skeleton width={100} height={16} sx={{ mb: 0.5 }} /><Skeleton width={140} height={12} /></Box>
              <Skeleton width={90} height={32} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', py: { xs: 1, sm: 2 } }}>
      {/* Header */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 46, height: 46, borderRadius: '15px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)', flexShrink: 0, position: 'relative', '&::after': { content: '""', position: 'absolute', inset: 0, borderRadius: 'inherit', border: '1px solid rgba(255,255,255,0.25)' } }}>
            <IconWorld size={22} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.15rem' }, letterSpacing: '-0.02em' }}>Social Networks</Typography>
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
              <IconShieldCheck size={13} style={{ color: '#2563eb' }} />
              <Typography sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>We never store your social media passwords. You connect securely through OAuth 2.0.</Typography>
            </Stack>
          </Box>
        </Stack>
      </Stack>

      {/* Search & Filter */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <TextField size="small" inputRef={searchRef} placeholder="Search platforms...  ( / )" value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch size={15} style={{ color: 'text.secondary' }} /></InputAdornment>), sx: { borderRadius: '14px', '& fieldset': { border: 'none' }, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', fontSize: '0.85rem', height: 42, boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)' } }} sx={{ width: { xs: '100%', sm: 320 } }} />
        <Box sx={{ p: 0.5, borderRadius: '14px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)', display: 'flex', gap: 0.5, boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.04)', flexShrink: 0 }}>
          {[{ key: 'all', label: 'All' }, { key: 'connected', label: 'Connected' }, { key: 'available', label: 'Available' }].map((f) => (
            <Button key={f.key} size="small" onClick={() => setFilter(f.key)} sx={{ borderRadius: '10px', px: { xs: 1.5, sm: 2 }, py: 0.5, fontWeight: 600, fontSize: '0.75rem', textTransform: 'none', color: filter === f.key ? '#fff' : 'text.secondary', bgcolor: filter === f.key ? '#2563eb' : 'transparent', '&:hover': { bgcolor: filter === f.key ? alpha('#2563eb', 0.85) : alpha('#2563eb', 0.06) }, transition: 'all 0.2s ease' }}>
              {f.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Platform List */}
      <Box sx={{ borderRadius: '24px', border: '1px solid', borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04), overflow: 'hidden', bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(16px)', boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.04)' }}>
        {filtered.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary' }}>No platforms found</Typography>
          </Box>
        ) : (
          filtered.map((platform) => (
            <PlatformRow
              key={platform.name}
              platform={platform}
              conn={connections[platform.name]}
              isConnecting={connecting[platform.name]}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onOpenModal={openModal}
            />
          ))
        )}
      </Box>

      <ConnectionModal open={!!modalPlatform} onClose={() => setModalPlatform(null)} platform={PLATFORMS.find((p) => p.name === modalPlatform)} conn={modalConn} />
    </Box>
  );
}
