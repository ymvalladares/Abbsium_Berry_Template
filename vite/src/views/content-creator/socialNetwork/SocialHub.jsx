import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Typography, Stack, Button, Divider, alpha, TextField, InputAdornment, Chip,
  LinearProgress, Tooltip, IconButton, Collapse, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import {
  IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconBrandTiktok,
  IconBrandTwitter, IconBrandLinkedin, IconBrandPinterest,
  IconCheck, IconPlus, IconLogout, IconSearch, IconWifi, IconAlertCircle,
  IconChevronDown, IconChartBar, IconUsers, IconRefresh, IconClock
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

export default function SocialHub() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [connecting, setConnecting] = useState({});
  const connectingRef = useRef(connecting);

  useEffect(() => {
    connectingRef.current = connecting;
  }, [connecting]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await socialAPI.checkConnections();
      const map = {};
      PLATFORMS.forEach((p) => {
        map[p.name] = { connected: false, expiresAt: null, accountName: null, providerAccountId: null, scope: '—', health: 0, followers: '—', connectedAt: null, postsCount: 0, status: 'inactive' };
      });

      res.data.forEach((item) => {
        const key = item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
        if (map.hasOwnProperty(key)) {
          map[key] = {
            connected: item.connected,
            expiresAt: item.expiresAt,
            accountName: item.accountName || key,
            providerAccountId: item.providerAccountId || null,
            scope: item.scope || '—',
            health: item.health ?? (item.connected ? 90 : 0),
            followers: item.followers || '—',
            connectedAt: item.connectedAt || null,
            postsCount: item.postsCount || 0,
            status: item.connected ? (item.expiresAt && new Date(item.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'expiring' : 'active') : 'inactive'
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
    // Storage listener is handled by openPopup in AxiosService.js
    // No need for a duplicate listener here
  }, []);

  const handleConnect = useCallback((platform) => {
    setConnecting((prev) => ({ ...prev, [platform]: true }));

    const method = connectMethods[platform];
    if (method) {
      method(() => {
        setConnecting((prev) => ({ ...prev, [platform]: false }));
        fetchStatus();
      });
    }
  }, [fetchStatus]);

  const handleDisconnect = async (platform) => {
    try {
      const res = await socialAPI.disconnect(platform);
      setConnections((prev) => ({
        ...prev,
        [platform]: { connected: false, expiresAt: null, accountName: null, providerAccountId: null, scope: '—', health: 0, followers: '—', connectedAt: null, postsCount: 0, status: 'inactive' }
      }));
      if (expandedId === platform) setExpandedId(null);
      showSnackbar(res.data?.message || `${platform} disconnected successfully`, 'success');
    } catch (err) {
      showSnackbar(err?.response?.data?.error || `Failed to disconnect ${platform}`, 'error');
    }
  };

  const connectedCount = Object.values(connections).filter((x) => x?.connected).length;

  const filtered = PLATFORMS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const isConnected = connections[p.name]?.connected;
    if (filter === 'connected') return matchesSearch && isConnected;
    if (filter === 'disconnected') return matchesSearch && !isConnected;
    return matchesSearch;
  });

  if (loading) return <Loader />;

  const getHealthColor = (health) => {
    if (health >= 90) return '#4CAF50';
    if (health >= 70) return '#FF9800';
    return '#f44336';
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3, md: 4 }, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: { xs: '100%', lg: '75%' }, maxWidth: { xs: '100%', sm: 900, md: 1100, lg: '100%' }, px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" sx={{ mb: { xs: 2, sm: 3 }, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Social Networks
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
              Connect and manage your social media accounts
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
            <Chip label={`${connectedCount} connected`} sx={{ px: 2, py: 0.75, borderRadius: 2, bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }} />
            <Button variant="contained" size="small" startIcon={<IconRefresh size={isMobile ? 14 : 16} />} onClick={fetchStatus} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' }, px: { xs: 1.5, sm: 2 }, background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)', '&:hover': { background: 'linear-gradient(135deg, #512DA8, #651FFF)' } }}>
              {isMobile ? 'Sync' : 'Sync All'}
            </Button>
          </Stack>
        </Stack>

        {/* Quick Stats */}
        {connectedCount > 0 && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 2, sm: 3 } }}>
            {[
              { label: 'Active Connections', value: `${connectedCount}/${PLATFORMS.length}`, icon: IconWifi, color: '#4CAF50' },
              { label: 'Platforms Ready', value: `${PLATFORMS.length - connectedCount} pending`, icon: IconClock, color: '#FF9800' }
            ].map((stat) => (
              <Box key={stat.label} sx={{ flex: { sm: 1 }, p: { xs: 1.5, sm: 2 }, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 }, borderRadius: 2, bgcolor: alpha(stat.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <stat.icon size={isMobile ? 16 : 18} style={{ color: stat.color }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 600, display: 'block' }}>{stat.label}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>{stat.value}</Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {/* Security Notice */}
        <Box sx={{ borderRadius: '12px 12px 0 0', px: { xs: 1.5, sm: 2 }, py: { xs: 0.75, sm: 1 }, bgcolor: alpha('#6b7280', 0.06), border: '1px solid', borderColor: alpha('#6b7280', 0.12), borderBottom: 'none', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconAlertCircle size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Connections use OAuth 2.0 secure authentication. Your credentials are never stored on our servers.
          </Typography>
        </Box>

        {/* Main Panel */}
        <Box sx={{ borderRadius: '0 0 12px 12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>
          {/* Toolbar */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, alignItems: { xs: 'stretch', sm: 'center' } }}>
            <TextField size="small" placeholder="Search platforms..." value={search} onChange={(e) => setSearch(e.target.value)} InputProps={{ startAdornment: (<InputAdornment position="start"><IconSearch size={16} style={{ color: '#9ca3af' }} /></InputAdornment>), sx: { borderRadius: 2, bgcolor: 'grey.50', '& fieldset': { border: 'none' } } }} sx={{ flex: 1, maxWidth: { sm: 280 } }} />
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              {[{ key: 'all', label: 'All' }, { key: 'connected', label: 'Connected' }, { key: 'disconnected', label: 'Disconnected' }].map((f) => (
                <Chip key={f.key} label={f.label} size="small" variant={filter === f.key ? 'filled' : 'outlined'} onClick={() => setFilter(f.key)} sx={{ borderRadius: 1.5, fontWeight: 600, fontSize: '0.75rem', ...(filter === f.key && { bgcolor: '#5E35B1', color: '#fff', borderColor: '#5E35B1' }) }} />
              ))}
            </Stack>
          </Box>

          {/* Platform List */}
          {filtered.length === 0 ? (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <IconSearch size={40} style={{ color: '#d1d5db', margin: '0 auto 12px' }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>No platforms found</Typography>
            </Box>
          ) : (
            filtered.map((platform, idx) => {
              const conn = connections[platform.name] || {};
              const isConnected = conn?.connected;
              const isConnecting = connecting[platform.name] || false;
              const Icon = platform.icon;
              const isExpanded = expandedId === platform.name;

              return (
                <Box key={platform.name}>
                  <Box
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 1.5, sm: 2 },
                      cursor: isConnected ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      ...(isConnected
                        ? {
                            bgcolor: isExpanded ? alpha(platform.color, 0.03) : 'transparent',
                            borderLeft: `3px solid ${alpha(platform.color, isExpanded ? 0.6 : 0)}`,
                            '&:hover': { bgcolor: alpha(platform.color, 0.04) }
                          }
                        : {
                            borderLeft: '3px solid transparent',
                            '&:hover': { bgcolor: 'grey.50' }
                          })
                    }}
                    onClick={() => isConnected && setExpandedId(isExpanded ? null : platform.name)}
                  >
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: '100%' }}>
                      {/* Icon with glow effect for connected */}
                      <Box sx={{ position: 'relative' }}>
                        {isConnected && (
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: -2,
                              borderRadius: 2.5,
                              bgcolor: alpha(platform.color, 0.15),
                              filter: 'blur(4px)',
                              zIndex: 0
                            }}
                          />
                        )}
                        <Box
                          sx={{
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            borderRadius: 2,
                            bgcolor: isConnecting ? alpha(platform.color, 0.2) : isConnected ? alpha(platform.color, 0.12) : alpha(platform.color, 0.08),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            position: 'relative',
                            zIndex: 1,
                            border: isConnected ? `1px solid ${alpha(platform.color, 0.2)}` : '1px solid transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          {isConnecting ? (
                            <CircularProgress size={20} thickness={4} sx={{ color: platform.color, position: 'absolute' }} />
                          ) : (
                            <Icon size={isMobile ? 18 : 20} style={{ color: platform.color }} />
                          )}
                        </Box>
                      </Box>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' }, color: isConnected ? 'text.primary' : 'text.secondary' }}>
                            {platform.name}
                          </Typography>
                          {isConnected && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4CAF50', boxShadow: `0 0 6px ${alpha('#4CAF50', 0.4)}` }} />
                            </Box>
                          )}
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {isConnecting ? 'Connecting...' : isConnected ? (conn?.accountName || platform.name) : platform.desc}
                        </Typography>
                      </Box>

                      {/* Right side */}
                      {!isMobile && !isConnecting && (
                        isConnected ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Tooltip title="Expand details">
                              <IconButton size="small" sx={{ color: 'text.secondary', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <IconChevronDown size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Chip icon={<IconAlertCircle size={14} />} label="Not connected" size="small" sx={{ borderRadius: 1.5, bgcolor: 'grey.100', color: 'text.secondary', fontSize: '0.75rem', height: 24 }} />
                        )
                      )}

                      {isMobile && !isConnecting && (
                        isConnected ? (
                          <IconButton size="small" sx={{ color: 'text.secondary', ml: 'auto', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                            <IconChevronDown size={16} />
                          </IconButton>
                        ) : (
                          <Chip icon={<IconAlertCircle size={12} />} label="Not connected" size="small" sx={{ borderRadius: 1.5, bgcolor: 'grey.100', color: 'text.secondary', fontSize: '0.7rem', height: 22 }} />
                        )
                      )}
                    </Stack>

                    <Button
                      variant={isConnected ? 'outlined' : 'contained'}
                      size="small"
                      disabled={isConnecting}
                      startIcon={
                        isConnecting ? (
                          <CircularProgress size={14} thickness={4} sx={{ color: isConnected ? 'text.secondary' : '#fff' }} />
                        ) : isConnected ? (
                          <IconLogout size={isMobile ? 14 : 16} />
                        ) : (
                          <IconPlus size={isMobile ? 14 : 16} />
                        )
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        isConnected ? handleDisconnect(platform.name) : handleConnect(platform.name);
                      }}
                      sx={{
                        borderRadius: 2,
                        px: { xs: 1.5, sm: 2 },
                        py: { xs: 0.6, sm: 0.75 },
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        minWidth: { xs: '100%', sm: 120 },
                        ...(isConnected
                          ? {
                              borderColor: alpha('#f44336', 0.3),
                              color: '#f44336',
                              '&:hover': { borderColor: '#f44336', bgcolor: alpha('#f44336', 0.04) }
                            }
                          : { bgcolor: platform.color, '&:hover': { bgcolor: alpha(platform.color, 0.9) } })
                      }}
                    >
                      {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </Box>

                  <Collapse in={isConnected && isExpanded}>
                    <Box
                      sx={{
                        mx: { xs: 1.5, sm: 2 },
                        mb: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: alpha(platform.color, 0.15),
                        bgcolor: 'background.paper'
                      }}
                    >
                      {/* Health Header */}
                      <Box sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: alpha(getHealthColor(conn?.health ?? 0), 0.06), borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Connection Health
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: getHealthColor(conn?.health ?? 0), fontSize: '0.85rem' }}>
                            {conn?.health ?? 0}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={conn?.health ?? 0}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: alpha(getHealthColor(conn?.health ?? 0), 0.15),
                            '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: getHealthColor(conn?.health ?? 0), transition: 'transform 0.5s ease' }
                          }}
                        />
                      </Box>

                      {/* Stats Grid */}
                      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Stack direction={{ xs: 'column', sm: 'row' }} divider={<Divider orientation="vertical" flexItem sx={{ mx: { sm: 2 } }} />} spacing={{ xs: 1.5 }}>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha('#5E35B1', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconUsers size={16} style={{ color: '#5E35B1' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600, display: 'block' }}>Followers</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{conn?.followers ?? '—'}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha('#2196f3', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconChartBar size={16} style={{ color: '#2196f3' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600, display: 'block' }}>Posts Published</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{conn?.postsCount ?? 0}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha('#f44336', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconClock size={16} style={{ color: '#f44336' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600, display: 'block' }}>Expires</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {conn?.expiresAt ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: alpha('#4CAF50', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <IconCheck size={16} style={{ color: '#4CAF50' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600, display: 'block' }}>Connected Since</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {conn?.connectedAt ? new Date(conn.connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: 1.5,
                                bgcolor: conn?.status === 'active' ? alpha('#4CAF50', 0.08) : conn?.status === 'expiring' ? alpha('#FF9800', 0.08) : alpha('#9ca3af', 0.08),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: conn?.status === 'active' ? '#4CAF50' : conn?.status === 'expiring' ? '#FF9800' : '#9ca3af' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', fontWeight: 600, display: 'block' }}>Status</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: conn?.status === 'active' ? '#4CAF50' : conn?.status === 'expiring' ? '#FF9800' : '#9ca3af' }}>
                                {conn?.status === 'expiring' ? 'Expiring Soon' : conn?.status === 'active' ? 'Active' : 'Inactive'}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Collapse>

                  {idx < filtered.length - 1 && <Divider sx={{ ml: { xs: 'calc(36px + 16px)', sm: 'calc(40px + 16px)' } }} />}
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
}
