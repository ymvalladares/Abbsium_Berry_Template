import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconSend,
  IconCheck
} from '@tabler/icons-react';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: IconBrandFacebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: IconBrandInstagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: IconBrandYoutube, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: IconBrandTiktok, color: '#000000' },
  { id: 'twitter', name: 'X', icon: IconBrandTwitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: IconBrandLinkedin, color: '#0A66C2' },
  { id: 'pinterest', name: 'Pinterest', icon: IconBrandPinterest, color: '#E60023' }
];

export default function PlatformSelector({
  platforms,
  onToggle,
  onSelectAll,
  onClearAll,
  connectedPlatforms,
  pages,
  loadingPages
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const plat = useMemo(() => (id) => PLATFORMS.find((p) => p.id === id), []);

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="small"
          onClick={onSelectAll}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#3b82f6', px: 1 }}
        >
          Select all
        </Button>
        <Typography sx={{ color: 'divider', fontSize: '0.75rem' }}>·</Typography>
        <Button
          size="small"
          onClick={onClearAll}
          sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', px: 1 }}
        >
          Clear
        </Button>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {platforms.length} selected
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
          gap: 1
        }}
      >
        {PLATFORMS.map((p) => {
          const on = connectedPlatforms.includes(p.id);
          const sel = platforms.includes(p.id);
          const Icon = p.icon;
          return (
            <Box
              key={p.id}
              onClick={() => on && onToggle(p.id)}
              sx={{
                position: 'relative',
                p: 1.5,
                borderRadius: 2,
                border: '2px solid',
                borderColor: sel ? p.color : on ? alpha(p.color, 0.4) : 'divider',
                bgcolor: sel ? alpha(p.color, 0.04) : on ? alpha(p.color, 0.02) : 'transparent',
                cursor: on ? 'pointer' : 'not-allowed',
                opacity: on ? 1 : 0.35,
                textAlign: 'center',
                transition: 'all 0.2s',
                '&:hover': on ? { borderColor: p.color, bgcolor: alpha(p.color, 0.06), boxShadow: `0 4px 12px ${alpha(p.color, 0.15)}` } : {},
                boxShadow: on && !sel ? `0 2px 8px ${alpha(p.color, 0.08)}` : 'none',
                minHeight: 68,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
              }}
            >
              {sel && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconCheck size={9} style={{ color: '#fff' }} />
                </Box>
              )}
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1.5,
                  bgcolor: sel ? p.color : on ? alpha(p.color, 0.15) : alpha(p.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={16} style={{ color: sel ? '#fff' : p.color }} />
              </Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{p.name}</Typography>
            </Box>
          );
        })}
      </Box>

      {platforms.length > 0 && (
        <Box
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconSend size={16} style={{ color: '#3b82f6' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
              {platforms.length} {platforms.length === 1 ? 'platform' : 'platforms'} selected
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 1.5
              }}
            >
              {platforms.map((id) => {
                const p = plat(id);
                if (!p) return null;
                const Icon = p.icon;
                const account = pages[id];
                return (
                  <Box
                    key={id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: '1px solid',
                      borderColor: alpha(p.color, 0.12)
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: p.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${alpha(p.color, 0.25)}`
                      }}
                    >
                      <Icon size={20} style={{ color: '#fff' }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{p.name}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                        {account ? account.accountName : 'Personal account'}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}

      {loadingPages && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
        </Box>
      )}
    </Stack>
  );
}
