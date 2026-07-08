import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { HomeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ErrorLayout({ code, title, message, icon, color = '#6366f1' }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: isDark
          ? `radial-gradient(ellipse at 20% 50%, ${color}15 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${color}10 0%, transparent 50%), #0a0a0f`
          : `radial-gradient(ellipse at 20% 50%, ${color}10 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${color}08 0%, transparent 50%), #ffffff`,
        px: 3,
        py: 6
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: `radial-gradient(ellipse, ${color}12 0%, transparent 70%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: isDark
            ? `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`
            : `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ zIndex: 1, textAlign: 'center', animation: 'fadeInDown 0.6s ease both',
        '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-30px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      }}>
        {icon && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: isDark ? `${color}15` : `${color}10`,
                border: `1px solid ${color}30`,
                color: color,
                mb: 1,
                boxShadow: isDark ? `0 0 40px ${color}20` : `0 0 30px ${color}15`,
                animation: 'pulse 3s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%,100%': { boxShadow: isDark ? `0 0 40px ${color}20` : `0 0 30px ${color}15` },
                  '50%': { boxShadow: isDark ? `0 0 60px ${color}30` : `0 0 50px ${color}25` }
                }
              }}
            >
              {icon}
            </Box>
          </Box>
        )}

        {code && (
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: { xs: '5rem', md: '9rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: `2px ${color}`,
              userSelect: 'none',
              textShadow: `0 0 80px ${color}30`,
              mb: 1,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
          >
            {code}
          </Typography>
        )}

        <Box
          sx={{
            width: { xs: 100, md: 160 },
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            mx: 'auto',
            mb: 3,
            borderRadius: 2
          }}
        />

        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: isDark ? '#f1f5f9' : '#111827',
            mb: 1.5,
            textTransform: 'uppercase',
            mt: code ? 0 : 2
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: isDark ? '#94a3b8' : '#6b7280',
            lineHeight: 1.8,
            fontSize: '0.9rem',
            maxWidth: 480,
            mx: 'auto',
            mb: 5
          }}
        >
          {message}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            startIcon={<HomeRounded />}
            onClick={() => navigate('/')}
            sx={{
              background: `linear-gradient(135deg, ${color}, ${color}cc)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${color}40`,
              '&:hover': {
                background: `linear-gradient(135deg, ${color}, ${color})`,
                boxShadow: `0 6px 30px ${color}50`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: isDark ? `${color}50` : `${color}30`,
              color: isDark ? '#94a3b8' : '#6b7280',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              px: 4,
              py: 1.5,
              borderRadius: '10px',
              textTransform: 'uppercase',
              background: isDark ? `${color}08` : `${color}05`,
              '&:hover': {
                borderColor: color,
                color: color,
                background: isDark ? `${color}15` : `${color}10`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 2,
          zIndex: 1
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color,
              opacity: 0.3 + i * 0.2,
              animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite both`,
              '@keyframes bounce': {
                '0%, 80%, 100%': { transform: 'scale(1)' },
                '40%': { transform: 'scale(1.3)' }
              }
            }}
          />
        ))}
      </Box>
    </Box>
  );
}