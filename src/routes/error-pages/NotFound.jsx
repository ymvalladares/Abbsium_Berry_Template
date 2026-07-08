import { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Stack, useTheme, CssBaseline } from '@mui/material';
import { HomeRounded, RefreshRounded, SearchRounded, WifiOffRounded, ErrorOutlineRounded } from '@mui/icons-material';

function GlitchText({ children, sx = {}, color = '#6366f1' }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', ...sx }}>
      <Typography
        component="span"
        sx={{
          fontFamily: `'Inter', sans-serif`,
          fontSize: { xs: '6rem', md: '12rem' },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '2px ' + color,
          display: 'block',
          userSelect: 'none',
          position: 'relative',
          textShadow: glitch ? `4px 0 ${color}, -4px 0 #8b5cf6` : `0 0 80px ${color}40`,
          transform: glitch ? 'skewX(-2deg)' : 'skewX(0deg)',
          transition: 'transform 0.05s, text-shadow 0.05s',
          '&::before': glitch
            ? {
                content: '"404"',
                position: 'absolute',
                top: '3px',
                left: '-4px',
                color: 'transparent',
                WebkitTextStroke: '2px #8b5cf6',
                opacity: 0.7,
                clipPath: 'polygon(0 30%, 100% 30%, 100% 55%, 0 55%)'
              }
            : {},
          '&::after': glitch
            ? {
                content: '"404"',
                position: 'absolute',
                top: '-3px',
                left: '4px',
                color: 'transparent',
                WebkitTextStroke: '2px ' + color,
                opacity: 0.5,
                clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)'
              }
            : {}
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function Particles({ color = '#6366f1', secondaryColor = '#8b5cf6' }) {
  const particles = Array.from({ length: 25 }, (_, i) => i);
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0
      }}
    >
      {particles.map((i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? color : i % 3 === 1 ? secondaryColor : color + '40',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i % 4} ${5 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0.2 + Math.random() * 0.4
          }}
        />
      ))}
    </Box>
  );
}

function GridBackground({ isDark = false, color = '#6366f1' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: isDark
          ? `linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)`
          : `linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
      }}
    />
  );
}

function ScanLine({ isDark = false, color = '#6366f1' }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '3px',
          background: `linear-gradient(transparent, ${isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.08)'}, transparent)`,
          animation: 'scan 8s linear infinite'
        },
        '@keyframes scan': {
          '0%': { top: '-10px' },
          '100%': { top: '110%' }
        }
      }}
    />
  );
}

function StatusChip({ icon, label, color }) {
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        background: color + '15',
        border: `1px solid ${color}30`,
        color: color,
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        fontWeight: 600,
        '& .MuiChip-icon': { color: color, fontSize: '0.9rem' },
        backdropFilter: 'blur(8px)'
      }}
    />
  );
}

export default function NotFoundPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [countdown, setCountdown] = useState(15);
  const [hover, setHover] = useState(false);

  const color = '#6366f1';
  const secondaryColor = '#8b5cf6';

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const progressPct = ((15 - countdown) / 15) * 100;

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
          ? 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.05) 0%, transparent 50%), #0a0a0f'
          : 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 50%), #ffffff',
        px: 3,
        py: 6,
        fontFamily: '"Space Grotesk", sans-serif'
      }}
    >
      <CssBaseline />
      <GridBackground isDark={isDark} color={color} />
      <ScanLine isDark={isDark} color={color} />
      <Particles color={color} secondaryColor={secondaryColor} />

      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
        <Box
          key={pos}
          sx={{
            position: 'fixed',
            ...(pos.includes('top') ? { top: 24 } : { bottom: 24 }),
            ...(pos.includes('left') ? { left: 24 } : { right: 24 }),
            width: 48,
            height: 48,
            borderTop: pos.includes('top') ? `2px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.3)'}` : 'none',
            borderBottom: pos.includes('bottom') ? `2px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.3)'}` : 'none',
            borderLeft: pos.includes('left') ? `2px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.3)'}` : 'none',
            borderRight: pos.includes('right') ? `2px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.3)'}` : 'none',
            zIndex: 1,
            borderRadius: '4px'
          }}
        />
      ))}

      <Stack direction="row" spacing={1} sx={{ mb: 5, zIndex: 1, flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
        <StatusChip icon={<WifiOffRounded />} label="CONNECTION LOST" color={color} />
        <StatusChip icon={<ErrorOutlineRounded />} label="ERROR 404" color={secondaryColor} />
        <StatusChip icon={<SearchRounded />} label="PAGE NOT FOUND" color={isDark ? '#94a3b8' : '#6b7280'} />
      </Stack>

      <Box
        sx={{
          zIndex: 1,
          textAlign: 'center',
          position: 'relative',
          mb: 1,
          animation: 'fadeInDown 0.8s ease both',
          '@keyframes fadeInDown': {
            from: { opacity: 0, transform: 'translateY(-40px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '350px',
            background: `radial-gradient(ellipse, ${color}10 0%, transparent 70%)`,
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}
        />
        <GlitchText color={color}>404</GlitchText>
      </Box>

      <Box
        sx={{
          width: { xs: 200, md: 360 },
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, ${secondaryColor}, transparent)`,
          mb: 4,
          zIndex: 1,
          animation: 'expandLine 1s ease 0.4s both',
          '@keyframes expandLine': {
            from: { width: 0, opacity: 0 },
            to: { width: '100%', opacity: 1 }
          }
        }}
      />

      <Box
        sx={{
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 500,
          animation: 'fadeIn 0.8s ease 0.5s both',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(20px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: `'Inter', sans-serif`,
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: isDark ? '#f1f5f9' : '#111827',
            mb: 1.5,
            textTransform: 'uppercase'
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: isDark ? '#94a3b8' : '#6b7280',
            lineHeight: 1.8,
            fontSize: '0.85rem',
            letterSpacing: '0.02em'
          }}
        >
          The page you're looking for has been moved, deleted, or never existed in this dimension.
          <br />
          Try going back home or searching for what you need.
        </Typography>
      </Box>

      <Box
        sx={{
          zIndex: 1,
          width: { xs: '90%', md: 420 },
          mt: 4,
          animation: 'fadeIn 0.8s ease 0.7s both'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 0.8
          }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: isDark ? '#64748b' : '#9ca3af',
              letterSpacing: '0.1em',
              fontWeight: 600
            }}
          >
            AUTO-REDIRECT IN
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: color,
              letterSpacing: '0.1em',
              fontWeight: 700
            }}
          >
            {countdown}s
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '3px',
            background: isDark ? '#1e293b' : '#f1f5f9',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, ${color}, ${secondaryColor})`,
              borderRadius: 2,
              transition: 'width 1s linear',
              boxShadow: `0 0 10px ${color}50`
            }}
          />
        </Box>
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mt: 4,
          zIndex: 1,
          animation: 'fadeIn 0.8s ease 0.9s both'
        }}
      >
        <Button
          variant="contained"
          startIcon={<HomeRounded />}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => (window.location.href = '/')}
          sx={{
            background: `linear-gradient(135deg, ${color}, ${secondaryColor})`,
            color: '#fff',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            textTransform: 'uppercase',
            boxShadow: hover ? `0 0 30px ${color}50, 0 8px 32px ${color}40` : `0 0 15px ${color}30`,
            transition: 'all 0.3s ease',
            transform: hover ? 'translateY(-2px)' : 'none',
            '&:hover': {
              background: `linear-gradient(135deg, #4f46e5, #7c3aed)`,
              boxShadow: `0 0 40px ${color}50, 0 12px 40px ${color}40`
            }
          }}
        >
          Go Home
        </Button>

        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={() => window.location.reload()}
          sx={{
            borderColor: isDark ? `${color}40` : `${color}30`,
            color: isDark ? '#94a3b8' : '#6b7280',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '10px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            background: isDark ? `${color}08` : `${color}05`,
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: color,
              background: isDark ? `${color}15` : `${color}10`,
              color: color,
              transform: 'translateY(-2px)',
              boxShadow: `0 4px 20px ${color}25`
            }
          }}
        >
          Try Again
        </Button>

        <Button
          variant="text"
          startIcon={<SearchRounded />}
          onClick={() => (window.location.href = '/search')}
          sx={{
            color: isDark ? '#475569' : '#9ca3af',
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            px: 3,
            py: 1.5,
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: color,
              background: 'transparent'
            }
          }}
        >
          Search
        </Button>
      </Stack>

      <Typography
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.6rem',
          color: isDark ? 'rgba(71,85,105,0.3)' : 'rgba(107,114,128,0.25)',
          letterSpacing: '0.25em',
          fontFamily: '"Space Grotesk", monospace',
          zIndex: 1,
          whiteSpace: 'nowrap'
        }}
      >
        ERR_NOT_FOUND · HTTP 404 · {new Date().toISOString().split('T')[0]}
      </Typography>
    </Box>
  );
}