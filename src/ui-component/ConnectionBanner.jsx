import { Box, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { WifiOff } from '@mui/icons-material';
import { useConnection } from 'contexts/ConnectionContext';

export default function ConnectionBanner() {
  const { isOffline } = useConnection();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!isOffline) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        px: 1.5,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderRadius: '16px',
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: `1px solid ${isDark ? 'rgba(251, 191, 36, 0.25)' : 'rgba(245, 158, 11, 0.3)'}`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        animation: 'bannerSlideDown 0.3s ease-out',
        '@keyframes bannerSlideDown': {
          from: { opacity: 0, transform: 'translate(-50%, -16px)' },
          to: { opacity: 1, transform: 'translate(-50%, 0)' }
        }
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '10px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark ? 'rgba(251, 191, 36, 0.15)' : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(245, 158, 11, 0.25)'}`
        }}
      >
        <WifiOff sx={{ fontSize: 15, color: isDark ? '#fbbf24' : '#d97706' }} />
      </Box>
      <Box sx={{ pr: 0.5 }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
          You're offline
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', fontWeight: 500, lineHeight: 1.4 }}>
          Check your connection. Retrying automatically...
        </Typography>
      </Box>
      <Box
        sx={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: isDark ? '#fbbf24' : '#f59e0b',
          boxShadow: `0 0 8px ${isDark ? 'rgba(251,191,36,0.6)' : 'rgba(245,158,11,0.6)'}`,
          animation: 'bannerPulse 1.2s ease-in-out infinite',
          '@keyframes bannerPulse': {
            '0%, 100%': { opacity: 1, transform: 'scale(1)' },
            '50%': { opacity: 0.4, transform: 'scale(0.7)' }
          }
        }}
      />
    </Box>
  );
}