import { useState, useEffect, useCallback } from 'react';
import {
  Box, Container, Typography, Stack, Button, Divider, alpha, TextField, InputAdornment, Chip,
  LinearProgress, Tooltip, IconButton, Collapse, Badge, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import {
  IconBrandFacebook, IconBrandInstagram, IconBrandYoutube, IconBrandTiktok,
  IconBrandTwitter, IconBrandLinkedin, IconBrandPinterest,
  IconCheck, IconPlus, IconLogout, IconSearch, IconWifi, IconAlertCircle,
  IconChevronDown, IconChartBar, IconPencil, IconRefresh, IconClock, IconUsers, IconEye
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { showSnackbar } from '../../../utils/snackbarNotif';
import Loader from '../../../ui-component/Loader';

const PLATFORMS = [
  { name: 'Facebook', icon: IconBrandFacebook, color: '#1877F2', desc: 'Pages & profiles', usesPopup: true },
  { name: 'Instagram', icon: IconBrandInstagram, color: '#E4405F', desc: 'Business accounts', usesPopup: false },
  { name: 'YouTube', icon: IconBrandYoutube, color: '#FF0000', desc: 'Channels & videos', usesPopup: false },
  { name: 'TikTok', icon: IconBrandTiktok, color: '#000000', desc: 'Creator accounts', usesPopup: false },
  { name: 'X (Twitter)', icon: IconBrandTwitter, color: '#1DA1F2', desc: 'Personal & brand', usesPopup: false },
  { name: 'LinkedIn', icon: IconBrandLinkedin, color: '#0A66C2', desc: 'Professional network', usesPopup: false },
  { name: 'Pinterest', icon: IconBrandPinterest, color: '#E60023', desc: 'Boards & pins', usesPopup: false }
];

export default function SocialHub() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [connecting, setConnecting] = useState({});
  const [syncing, setSyncing] = useState(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await socialAPI.checkConnections();
      const map = {};
      PLATFORMS.forEach((p) => {
        map[p.name] = { connected: false, expiresAt: null, accountName: null, followers: null, lastSync: null, health: 0 };
      });

      res.data.forEach((item) => {
        const key = item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
        if (map.hasOwnProperty(key)) {
          map[key] = {
            connected: item.connected,
            expiresAt: item.expiresAt,
            accountName: item.accountName || key,
            followers: item.followers || '—',
            lastSync: item.lastSync || 'Never',
            health: item.health ?? (item.connected ? 85 : 0)
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

  const handleConnect = useCallback((platform) => {
    const config = PLATFORMS.find((p) => p.name === platform);
    if (!config) return;

    setConnecting((prev) => ({ ...prev, [platform]: true }));

    if (config.usesPopup) {
      socialAPI.connectFacebook(fetchStatus);
      const onFocus = () => {
        setConnecting((prev) => ({ ...prev, [platform]: false }));
        window.removeEventListener('focus', onFocus);
      };
      window.addEventListener('focus', onFocus);
      setTimeout(() => {
        setConnecting((prev) => ({ ...prev, [platform]: false }));
        fetchStatus();
      }, 15000);
    } else {
      try {
        const apiMap = {
          'Instagram': () => socialAPI.connectInstagram(),
          'YouTube': () => socialAPI.connectYouTube(),
          'TikTok': () => socialAPI.connectTikTok()
        };
        if (apiMap[platform]) apiMap[platform]();
      } catch (err) {
        setConnecting((prev) => ({ ...prev, [platform]: false }));
        showSnackbar(`Failed to connect to ${platform}`, 'error');
      }
    }
  }, [fetchStatus]);

  const handleDisconnect = async (platform) => {
    try {
      await socialAPI.disconnect(platform);
      setConnections((prev) => ({ ...prev, [platform]: { connected: false, expiresAt: null, accountName: null, followers: null, lastSync: null, health: 0 } }));
      if (expandedId === platform) setExpandedId(null);
      showSnackbar(`${platform} disconnected successfully`, 'success');
    } catch (err) {
      showSnackbar(err?.response?.data?.message || `Failed to disconnect ${platform}`, 'error');
    }
  };

  const handleSync = async (platform) => {
    setSyncing(platform);
    try {
      await socialAPI.disconnect(platform);
      await fetchStatus();
      showSnackbar(`${platform} synced successfully`, 'success');
    } catch (err) {
      showSnackbar(`Failed to sync ${platform}`, 'error');
    } finally {
      setSyncing(null);
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

  const getHealthColor = (health) => {
    if (health >= 90) return '#4CAF50';
    if (health >= 70) return '#FF9800';
    return '#f44336';
  };

  const getHealthLabel = (health) => {
    if (health >= 90) return 'Excellent';
    if (health >= 70) return 'Good';
    return 'Needs attention';
  };

  if (loading) return <Loader />;

  return (
    <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: { xs: 2, sm: 3 }, gap: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Social Networks
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
              Connect and manage your social media accounts
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}>
            <Chip
              label={`${connectedCount} connected`}
              sx={{
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: alpha('#4CAF50', 0.1),
                color: '#4CAF50',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.85rem' }
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<IconRefresh size={isMobile ? 14 : 16} />}
              onClick={() => {
                PLATFORMS.forEach((p) => {
                  if (connections[p.name]?.connected) handleSync(p.name);
                });
              }}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                px: { xs: 1.5, sm: 2 },
                background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
                '&:hover': { background: 'linear-gradient(135deg, #512DA8, #651FFF)' }
              }}
            >
              {isMobile ? 'Sync' : 'Sync All'}
            </Button>
          </Stack>
        </Stack>

        {/* Quick Stats */}
        {connectedCount > 0 && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            {[
              { label: 'Active Connections', value: `${connectedCount}/${PLATFORMS.length}`, icon: IconWifi, color: '#4CAF50' },
              { label: 'Platforms Ready', value: `${PLATFORMS.length - connectedCount} pending`, icon: IconClock, color: '#FF9800' }
            ].map((stat) => (
              <Box
                key={stat.label}
                sx={{
                  flex: { sm: 1 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                      borderRadius: 2,
                      bgcolor: alpha(stat.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <stat.icon size={isMobile ? 16 : 18} style={{ color: stat.color }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 600, display: 'block' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}

        {/* Main Panel */}
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          {/* Toolbar */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1.5, sm: 2 }, alignItems: { xs: 'stretch', sm: 'center' } }}>
            <TextField
              size="small"
              placeholder="Search platforms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={16} style={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: 'grey.50', '& fieldset': { border: 'none' } }
              }}
              sx={{ flex: 1, maxWidth: { sm: 280 } }}
            />

            <Stack direction="row" spacing={0.5} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'connected', label: 'Connected' },
                { key: 'disconnected', label: 'Disconnected' }
              ].map((f) => (
                <Chip
                  key={f.key}
                  label={f.label}
                  size="small"
                  variant={filter === f.key ? 'filled' : 'outlined'}
                  onClick={() => setFilter(f.key)}
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    ...(filter === f.key && { bgcolor: '#5E35B1', color: '#fff', borderColor: '#5E35B1' })
                  }}
                />
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
                      transition: 'bgcolor 0.15s',
                      '&:hover': { bgcolor: 'grey.50' },
                      ...(isConnected && isExpanded && { bgcolor: alpha(platform.color, 0.02) })
                    }}
                    onClick={() => isConnected && setExpandedId(isExpanded ? null : platform.name)}
                  >
                    {/* Top Row: Icon + Info + Status */}
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1, width: '100%' }}>
                      {/* Icon with Badge */}
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          isConnected ? (
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#4CAF50', border: '2px solid white' }} />
                          ) : null
                        }
                      >
                        <Box
                          sx={{
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            borderRadius: 2,
                            bgcolor: isConnecting ? alpha(platform.color, 0.2) : alpha(platform.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            position: 'relative'
                          }}
                        >
                          {isConnecting ? (
                            <CircularProgress size={20} thickness={4} sx={{ color: platform.color, position: 'absolute' }} />
                          ) : (
                            <Icon size={isMobile ? 18 : 20} style={{ color: platform.color }} />
                          )}
                        </Box>
                      </Badge>

                      {/* Info */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                          {platform.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {isConnecting ? 'Connecting...' : isConnected ? (conn?.accountName || platform.name) : platform.desc}
                        </Typography>
                      </Box>

                      {/* Status Chip - hidden on mobile */}
                      {!isMobile && !isConnecting && (
                        isConnected ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={<IconWifi size={14} />}
                              label={getHealthLabel(conn?.health ?? 0)}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                bgcolor: alpha(getHealthColor(conn?.health ?? 0), 0.1),
                                color: getHealthColor(conn?.health ?? 0),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                height: 24,
                                '& .MuiChip-icon': { color: getHealthColor(conn?.health ?? 0) }
                              }}
                            />
                            <Tooltip title="Expand details">
                              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                                <IconChevronDown
                                  size={16}
                                  style={{
                                    transition: 'transform 0.2s',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Chip
                            icon={<IconAlertCircle size={14} />}
                            label="Not connected"
                            size="small"
                            sx={{ borderRadius: 1.5, bgcolor: 'grey.100', color: 'text.secondary', fontSize: '0.75rem', height: 24 }}
                          />
                        )
                      )}

                      {/* Mobile status */}
                      {isMobile && !isConnecting && (
                        isConnected ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                              icon={<IconWifi size={12} />}
                              label={getHealthLabel(conn?.health ?? 0)}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                bgcolor: alpha(getHealthColor(conn?.health ?? 0), 0.1),
                                color: getHealthColor(conn?.health ?? 0),
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 22,
                                '& .MuiChip-icon': { color: getHealthColor(conn?.health ?? 0) }
                              }}
                            />
                            <IconButton size="small" sx={{ color: 'text.secondary', ml: 'auto' }}>
                              <IconChevronDown
                                size={16}
                                style={{
                                  transition: 'transform 0.2s',
                                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}
                              />
                            </IconButton>
                          </Stack>
                        ) : (
                          <Chip
                            icon={<IconAlertCircle size={12} />}
                            label="Not connected"
                            size="small"
                            sx={{ borderRadius: 1.5, bgcolor: 'grey.100', color: 'text.secondary', fontSize: '0.7rem', height: 22 }}
                          />
                        )
                      )}
                    </Stack>

                    {/* Action Button */}
                    <Button
                      variant={isConnected ? 'text' : 'contained'}
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
                        minWidth: { xs: '100%', sm: 130 },
                        ...(isConnected
                          ? { color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: alpha('#f44336', 0.04) } }
                          : { bgcolor: platform.color, '&:hover': { bgcolor: alpha(platform.color, 0.9) } })
                      }}
                    >
                      {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </Box>

                  {/* Expanded Details */}
                  <Collapse in={isConnected && isExpanded}>
                    <Box
                      sx={{
                        mx: { xs: 1.5, sm: 2 },
                        mb: 2,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      {/* Health Bar */}
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                            Connection Health
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: getHealthColor(conn?.health ?? 0), fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                            {conn?.health ?? 0}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={conn?.health ?? 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(getHealthColor(conn?.health ?? 0), 0.1),
                            '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: getHealthColor(conn?.health ?? 0) }
                          }}
                        />
                      </Box>

                      {/* Stats Row */}
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1.5, sm: 3 }}
                        sx={{ mb: 2 }}
                      >
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Followers</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{conn?.followers ?? '—'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Last Sync</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{conn?.lastSync ?? '—'}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Expires</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {conn?.expiresAt ? new Date(conn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Quick Actions */}
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                      >
                        <Button
                          size="small"
                          startIcon={<IconChartBar size={16} />}
                          onClick={() => handleSync(platform.name)}
                          disabled={syncing === platform.name}
                          sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          {syncing === platform.name ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        <Button
                          size="small"
                          startIcon={<IconPencil size={16} />}
                          sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          Create Post
                        </Button>
                        <Button
                          size="small"
                          startIcon={<IconEye size={16} />}
                          sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                        >
                          View Analytics
                        </Button>
                      </Stack>
                    </Box>
                  </Collapse>

                  {idx < filtered.length - 1 && <Divider sx={{ ml: { xs: 'calc(36px + 16px)', sm: 'calc(40px + 16px)' } }} />}
                </Box>
              );
            })
          )}
        </Box>

        {/* Security Notice */}
        <Box
          sx={{
            mt: { xs: 2, sm: 2.5 },
            p: { xs: 1.5, sm: 2 },
            borderRadius: 2,
            bgcolor: alpha('#2196f3', 0.04),
            border: '1px solid',
            borderColor: alpha('#2196f3', 0.1),
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5
          }}
        >
          <IconCheck size={18} color="#2196f3" style={{ flexShrink: 0, marginTop: { xs: '2px', sm: 0 } }} />
          <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.4, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Connections use OAuth 2.0 secure authentication. Your credentials are never stored on our servers.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
