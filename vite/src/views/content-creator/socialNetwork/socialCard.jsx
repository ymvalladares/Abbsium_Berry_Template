// SocialCard.jsx
import { useState } from 'react';
import { Box, Paper, Typography, Button, Chip, IconButton, Menu, MenuItem, Divider, Stack, alpha } from '@mui/material';
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
  IconBrandTwitter
} from '@tabler/icons-react';

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

export default function SocialCard({ platform, connected, onConnect, onDisconnect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const config = PLATFORM_CONFIG[platform];
  const Icon = config.icon;

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

      <Box sx={{ p: 3, position: 'relative' }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3 }}>
          {/* Icon */}
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
              sx: {
                minWidth: 180,
                borderRadius: 2,
                mt: 0.5
              }
            }}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              <IconSettings size={16} style={{ marginRight: 8 }} />
              Settings
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
        </Stack>

        {/* Description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          {connected
            ? 'Your account is active and ready for publishing content and viewing analytics.'
            : 'Connect your account to start managing content and accessing insights.'}
        </Typography>

        {/* Action Button */}
        <Button
          fullWidth
          variant={connected ? 'outlined' : 'contained'}
          startIcon={connected ? <IconUnlink size={18} /> : <IconLink size={18} />}
          onClick={connected ? onDisconnect : onConnect}
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
          {connected ? 'Disconnect' : 'Connect Account'}
        </Button>
      </Box>
    </Paper>
  );
}
