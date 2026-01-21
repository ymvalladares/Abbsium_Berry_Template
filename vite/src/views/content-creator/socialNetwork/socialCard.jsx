import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
  alpha,
  Popover,
  CircularProgress
} from '@mui/material';
import { BeatLoader } from 'react-spinners';
import {
  IconDotsVertical,
  IconSettings,
  IconRefresh,
  IconTrash,
  IconLink,
  IconUnlink,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandTwitter,
  IconShieldCheck
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';

const PLATFORM_CONFIG = {
  Facebook: {
    icon: IconBrandFacebook,
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0C63D4 100%)'
  },
  Instagram: {
    icon: IconBrandInstagram,
    color: '#E4405F',
    gradient: 'linear-gradient(135deg, #833AB4 0%, #E4405F 50%, #FCAF45 100%)'
  },
  YouTube: {
    icon: IconBrandYoutube,
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)'
  },
  TikTok: {
    icon: IconBrandTiktok,
    color: '#000000',
    gradient: 'linear-gradient(135deg, #00F2EA 0%, #FF0050 100%)'
  },
  Twitter: {
    icon: IconBrandTwitter,
    color: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0C85D0 100%)'
  }
};

export default function SocialCard({ platform, connected, expiresAt, onConnect, onDisconnect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Popover info Facebook
  const [infoAnchor, setInfoAnchor] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;
  const Icon = config.icon;

  const getTimeRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    return 'Expires soon';
  };

  // ✅ wrapper solo para conectar
  const handleConnect = () => {
    setIsConnecting(true);

    try {
      onConnect?.(); // abre popup
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      return;
    }

    const onFocus = () => {
      setIsConnecting(false);
      window.removeEventListener('focus', onFocus);
    };

    window.addEventListener('focus', onFocus);

    // seguridad
    setTimeout(() => {
      setIsConnecting(false);
    }, 8000);
  };

  // Abrir popover info al click en Settings
  const handleOpenInfo = async (event) => {
    setInfoAnchor(event.currentTarget);

    if (platform === 'Facebook' && connected && !userInfo) {
      setLoadingInfo(true);
      try {
        const res = await socialAPI.facebookProfile(); // backend /facebook/test-profile
        console.log('Facebook Profile Info:', res.data);
        setUserInfo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInfo(false);
      }
    }
  };

  const handleCloseInfo = () => setInfoAnchor(null);

  const openInfo = Boolean(infoAnchor);

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: connected ? alpha(config.color, 0.3) : 'divider',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        bgcolor: 'background.paper',
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          borderColor: config.color,
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(config.color, 0.15)}`
        }
      }}
    >
      {/* Gradient accent bar */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: config.gradient,
          opacity: connected ? 1 : 0.3,
          transition: 'opacity 0.3s'
        }}
      />

      {/* Background glow effect */}
      {connected && (
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: config.gradient,
            opacity: isHovered ? 0.08 : 0.05,
            transition: 'opacity 0.5s',
            pointerEvents: 'none'
          }}
        />
      )}

      <Box sx={{ p: 3, position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: connected ? config.gradient : alpha(config.color, 0.1),
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.05) rotate(3deg)' : 'scale(1)',
              boxShadow: connected ? `0 4px 12px ${alpha(config.color, 0.25)}` : 'none'
            }}
          >
            <Icon size={28} style={{ color: connected ? '#fff' : config.color }} />
          </Box>

          {/* Platform info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
              {platform}
            </Typography>
            <Chip
              size="small"
              label={connected ? 'Connected' : 'Not Connected'}
              sx={{
                bgcolor: connected ? alpha(config.color, 0.1) : 'grey.100',
                color: connected ? config.color : 'text.secondary',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24
              }}
            />
          </Box>

          {/* Menu */}
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              opacity: 0.6,
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 1, bgcolor: alpha(config.color, 0.08) }
            }}
          >
            <IconDotsVertical size={18} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 8,
              sx: { minWidth: 180, borderRadius: 2, mt: 0.5 }
            }}
          >
            <MenuItem
              onClick={(e) => {
                setAnchorEl(null);
                handleOpenInfo(e);
              }}
            >
              <IconSettings size={16} style={{ marginRight: 8 }} />
              Show Info
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>
              <IconRefresh size={16} style={{ marginRight: 8 }} />
              Refresh Token
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
              <IconTrash size={16} style={{ marginRight: 8 }} />
              Remove
            </MenuItem>
          </Menu>

          {/* Popover con info Facebook */}
          <Popover
            open={openInfo}
            anchorEl={infoAnchor}
            onClose={handleCloseInfo}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Paper sx={{ p: 2, minWidth: 250 }}>
              {loadingInfo ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : userInfo ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Name
                  </Typography>
                  <Typography variant="body1">{userInfo.name}</Typography>

                  <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1 }}>
                    Email
                  </Typography>
                  <Typography variant="body2">{userInfo.email || 'Not available'}</Typography>

                  {userInfo.picture?.data?.url && (
                    <Box
                      component="img"
                      src={userInfo.picture.data.url}
                      alt="Avatar"
                      sx={{ width: 80, height: 80, borderRadius: '50%', mt: 1 }}
                    />
                  )}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No info available
                </Typography>
              )}
            </Paper>
          </Popover>
        </Stack>

        {/* Content */}
        <Box sx={{ flex: 1, minHeight: 140, mb: 3 }}>
          {connected ? (
            <Stack spacing={1.5}>
              {/* Provider Info */}
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        display: 'block',
                        mb: 0.5
                      }}
                    >
                      PROVIDER
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {platform}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: alpha(config.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: config.color
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: config.color,
                        fontWeight: 700,
                        fontSize: '0.7rem'
                      }}
                    >
                      Active
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Token Expiration */}
              {expiresAt && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    TOKEN EXPIRES
                  </Typography>
                  <Stack direction="row" alignItems="baseline" justifyContent="space-between">
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.25 }}>
                        {new Date(expiresAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        {new Date(expiresAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#f57c00',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        bgcolor: alpha('#f57c00', 0.1),
                        px: 1,
                        py: 0.5,
                        borderRadius: 1
                      }}
                    >
                      {getTimeRemaining()}
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          ) : (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: '1px dashed',
                borderColor: 'divider',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <IconShieldCheck size={40} color="#bdbdbd" style={{ margin: '0 auto 12px' }} />
              <Typography variant="subtitle2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                No Active Connection
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                Connect your {platform} account to manage content, schedule posts, and access analytics
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Button */}
        <Button
          fullWidth
          disabled={isConnecting}
          variant={connected ? 'outlined' : 'contained'}
          startIcon={isConnecting ? null : connected ? <IconUnlink size={18} /> : <IconLink size={18} />}
          onClick={connected ? onDisconnect : handleConnect}
          sx={{
            borderRadius: 2,
            py: 1.25,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '0.9rem',
            ...(connected
              ? {
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'error.main',
                    color: 'error.main',
                    bgcolor: alpha('#f44336', 0.04)
                  }
                }
              : {
                  background: config.gradient,
                  boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
                  '&:hover': {
                    boxShadow: `0 6px 16px ${alpha(config.color, 0.4)}`,
                    transform: 'translateY(-1px)'
                  }
                })
          }}
        >
          {isConnecting ? (
            <Box direction="row" spacing={1} alignItems="center">
              <BeatLoader size={8} color="#fff" />
            </Box>
          ) : connected ? (
            'Disconnect'
          ) : (
            'Connect Account'
          )}
        </Button>
      </Box>
    </Paper>
  );
}
