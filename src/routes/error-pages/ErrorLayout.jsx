import { Box, Typography, Button, Stack, useTheme } from '@mui/material';
import { HomeRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ErrorLayout({ code, title, message, icon, color = '#6366f1' }) {
  const theme = useTheme();
  const navigate = useNavigate();

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
        background: `radial-gradient(ellipse at 20% 50%, ${color}10 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${color}08 0%, transparent 50%), #ffffff`,
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
          width: '400px',
          height: '400px',
          background: `radial-gradient(ellipse, ${color}08 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      <Box sx={{ zIndex: 1, textAlign: 'center', animation: 'fadeInDown 0.6s ease both',
        '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-30px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
      }}>
        {icon && (
          <Box sx={{ fontSize: '4rem', mb: 1, color }}>{icon}</Box>
        )}

        {code && (
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: { xs: '6rem', md: '10rem' },
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: `2px ${color}`,
              userSelect: 'none',
              textShadow: `0 0 60px ${color}20`,
              mb: 1
            }}
          >
            {code}
          </Typography>
        )}

        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 900,
            letterSpacing: '0.08em',
            color: '#111827',
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
            color: '#6b7280',
            lineHeight: 1.8,
            fontSize: '0.85rem',
            maxWidth: 460,
            mx: 'auto',
            mb: 4
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
              background: `linear-gradient(135deg, ${color}, ${color}dd)`,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              '&:hover': { opacity: 0.9 }
            }}
          >
            Go Home
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: `${color}40`,
              color: '#6b7280',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              textTransform: 'uppercase',
              '&:hover': { borderColor: color, color, background: `${color}08` }
            }}
          >
            Go Back
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
