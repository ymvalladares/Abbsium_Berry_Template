import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Stack,
  alpha
} from '@mui/material';
import {
  IconDotsVertical,
  IconInfoCircle,
  IconLink,
  IconLinkOff,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconCheck
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';

const PLATFORM_CONFIG = {
  Facebook: {
    icon: IconBrandFacebook,
    color: '#1877F2',
    bgColor: '#E7F3FF'
  },
  Instagram: {
    icon: IconBrandInstagram,
    color: '#E4405F',
    bgColor: '#FFE4E8'
  },
  YouTube: {
    icon: IconBrandYoutube,
    color: '#FF0000',
    bgColor: '#FFE5E5'
  },
  TikTok: {
    icon: IconBrandTiktok,
    color: '#000000',
    bgColor: '#F0F0F0'
  }
};

export default function SocialCard({ platform, connection, onConnect, onDisconnect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const config = PLATFORM_CONFIG[platform];
  if (!config) return null;
  const Icon = config.icon;

  const connected = connection?.connected || false;
  const expiresAt = connection?.expiresAt;
  const isActive = connection?.isActive;
  const accountName = connection?.accountName;
  const createdAt = connection?.createdAt;

  const handleConnect = () => {
    setIsConnecting(true);
    try {
      onConnect?.();
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

    setTimeout(() => {
      setIsConnecting(false);
    }, 8000);
  };

  const getTimeRemaining = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}d remaining`;
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h remaining`;
    return 'Expires soon';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: connected ? alpha(config.color, 0.2) : 'divider',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          borderColor: connected ? config.color : alpha(config.color, 0.3),
          boxShadow: `0 4px 12px ${alpha(config.color, 0.08)}`
        }
      }}
    >
      <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: connected ? config.color : config.bgColor,
                transition: 'all 0.2s'
              }}
            >
              <Icon size={24} style={{ color: connected ? '#fff' : config.color }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
                {platform}
              </Typography>
              {connected ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: isActive ? '#4CAF50' : '#f59e0b'
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: isActive ? '#4CAF50' : '#f59e0b',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  >
                    {isActive ? 'Connected & Active' : 'Connected & Inactive'}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  Not connected
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Menu */}
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <IconDotsVertical size={18} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ elevation: 8, sx: { borderRadius: 2, minWidth: 160 } }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              <IconInfoCircle size={16} style={{ marginRight: 8 }} />
              View Details
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
              <IconLinkOff size={16} style={{ marginRight: 8 }} />
              Disconnect
            </MenuItem>
          </Menu>
        </Stack>

        {/* Content Area */}
        <Box sx={{ flex: 1, mb: 3 }}>
          {connected ? (
            <Stack spacing={2}>
              {accountName && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600, display: 'block', mb: 0.5 }}
                  >
                    ACCOUNT
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {accountName}
                  </Typography>
                </Box>
              )}

              {expiresAt && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', fontSize: '0.7rem', fontWeight: 600, display: 'block', mb: 0.5 }}
                  >
                    TOKEN EXPIRES
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {new Date(expiresAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {getTimeRemaining()}
                    </Typography>
                  </Stack>
                </Box>
              )}

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(config.color, 0.04),
                  border: '1px solid',
                  borderColor: alpha(config.color, 0.1)
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconCheck size={16} color={config.color} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    Ready to publish content
                  </Typography>
                </Stack>
              </Box>
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
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Connect your {platform} account
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.75rem' }}>
                Schedule posts, view analytics & more
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Button */}
        <Button
          fullWidth
          disabled={isConnecting}
          variant={connected ? 'outlined' : 'contained'}
          startIcon={connected ? <IconLinkOff size={18} /> : <IconLink size={18} />}
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
                  bgcolor: config.color,
                  '&:hover': {
                    bgcolor: alpha(config.color, 0.9)
                  }
                })
          }}
        >
          {isConnecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect'}
        </Button>
      </Box>
    </Paper>
  );
}
