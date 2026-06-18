// 404 Page - Material UI + React
// Dependencies: @mui/material @mui/icons-material @emotion/react @emotion/styled

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Chip, Stack, useTheme, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { HomeRounded, RefreshRounded, SearchRounded, WifiOffRounded, ErrorOutlineRounded } from '@mui/icons-material';

// ─── Custom light theme ────────────────────────────────────────────────────
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#8b5cf6' },
    background: { default: '#ffffff', paper: '#f9fafb' },
    text: { primary: '#111827', secondary: '#6b7280' }
  },
  typography: {
    fontFamily: `'Roboto', sans-serif`
  },
  shape: { borderRadius: 16 }
});

// ─── Glitch Text ─────────────────────────────────────────────────────────────
function GlitchText({ children, sx = {} }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'relative', display: 'inline-block', ...sx }}>
      <Typography
        component="span"
        sx={{
          fontFamily: `'Roboto', sans-serif`,
          fontSize: { xs: '7rem', md: '13rem' },
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          color: 'transparent',
          WebkitTextStroke: '2px #6366f1',
          display: 'block',
          userSelect: 'none',
          position: 'relative',
          textShadow: glitch ? '4px 0 #6366f1, -4px 0 #8b5cf6' : '0 0 60px rgba(99,102,241,0.15)',
          transform: glitch ? 'skewX(-2deg)' : 'skewX(0deg)',
          transition: 'transform 0.05s, text-shadow 0.05s',
          '&::before': glitch
            ? {
                content: '"404"',
                position: 'absolute',
                top: '2px',
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
                top: '-2px',
                left: '4px',
                color: 'transparent',
                WebkitTextStroke: '2px #6366f1',
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

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => i);
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
            background: i % 3 === 0 ? '#6366f1' : i % 3 === 1 ? '#8b5cf6' : 'rgba(99,102,241,0.2)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float-${i % 4} ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            opacity: 0.3 + Math.random() * 0.4,
            '@keyframes float-0': {
              '0%,100%': { transform: 'translateY(0px) translateX(0px)' },
              '50%': { transform: 'translateY(-30px) translateX(10px)' }
            },
            '@keyframes float-1': {
              '0%,100%': { transform: 'translateY(0px) translateX(0px)' },
              '50%': { transform: 'translateY(20px) translateX(-15px)' }
            },
            '@keyframes float-2': {
              '0%,100%': { transform: 'translateY(0px) scale(1)' },
              '50%': { transform: 'translateY(-20px) scale(1.5)' }
            },
            '@keyframes float-3': {
              '0%,100%': { transform: 'rotate(0deg) translateY(0)' },
              '50%': { transform: 'rotate(180deg) translateY(-25px)' }
            }
          }}
        />
      ))}
    </Box>
  );
}

// ─── Grid Lines Background ────────────────────────────────────────────────────
function GridBackground() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
      }}
    />
  );
}

// ─── Scan Line Effect ─────────────────────────────────────────────────────────
function ScanLine() {
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
          background: 'linear-gradient(transparent, rgba(99,102,241,0.08), transparent)',
          animation: 'scan 6s linear infinite'
        },
        '@keyframes scan': {
          '0%': { top: '-10px' },
          '100%': { top: '110%' }
        }
      }}
    />
  );
}

// ─── Status Chip ─────────────────────────────────────────────────────────────
function StatusChip({ icon, label, color }) {
  return (
    <Chip
      icon={icon}
      label={label}
      size="small"
      sx={{
        background: `${color}10`,
        border: `1px solid ${color}30`,
        color: color,
        fontFamily: '"Space Mono", monospace',
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        '& .MuiChip-icon': { color: color, fontSize: '0.85rem' },
        backdropFilter: 'blur(8px)'
      }}
    />
  );
}

// ─── Main 404 Page ────────────────────────────────────────────────────────────
function NotFoundPage() {
  const [countdown, setCountdown] = useState(15);
  const [hover, setHover] = useState(false);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      // window.location.href = "/"; // Uncomment to enable redirect
      return;
    }
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
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.05) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 50%), #ffffff',
        px: 3,
        py: 6,
        fontFamily: '"Space Mono", monospace'
      }}
    >
      <GridBackground />
      <ScanLine />
      <Particles />

      {/* Corner decoration */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => (
        <Box
          key={pos}
          sx={{
            position: 'fixed',
            ...(pos.includes('top') ? { top: 24 } : { bottom: 24 }),
            ...(pos.includes('left') ? { left: 24 } : { right: 24 }),
            width: 40,
            height: 40,
            borderTop: pos.includes('top') ? '2px solid rgba(99,102,241,0.3)' : 'none',
            borderBottom: pos.includes('bottom') ? '2px solid rgba(99,102,241,0.3)' : 'none',
            borderLeft: pos.includes('left') ? '2px solid rgba(99,102,241,0.3)' : 'none',
            borderRight: pos.includes('right') ? '2px solid rgba(99,102,241,0.3)' : 'none',
            zIndex: 1
          }}
        />
      ))}

      {/* Status chips row */}
      <Stack direction="row" spacing={1} sx={{ mb: 5, zIndex: 1, flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
        <StatusChip icon={<WifiOffRounded />} label="CONNECTION LOST" color="#6366f1" />
        <StatusChip icon={<ErrorOutlineRounded />} label="ERROR 404" color="#8b5cf6" />
        <StatusChip icon={<SearchRounded />} label="PAGE NOT FOUND" color="#6b7280" />
      </Stack>

      {/* Giant 404 */}
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
        {/* Glow blob behind numbers */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />
        <GlitchText>404</GlitchText>
      </Box>

      {/* Divider line */}
      <Box
        sx={{
          width: { xs: 200, md: 340 },
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
          mb: 4,
          zIndex: 1,
          animation: 'expandLine 1s ease 0.4s both',
          '@keyframes expandLine': {
            from: { width: 0, opacity: 0 },
            to: { width: '100%', opacity: 1 }
          }
        }}
      />

      {/* Message */}
      <Box
        sx={{
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 480,
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
            fontFamily: `'Roboto', sans-serif`,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: '#111827',
            mb: 1.5,
            textTransform: 'uppercase'
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#6b7280',
            lineHeight: 1.8,
            fontSize: '0.8rem',
            letterSpacing: '0.03em'
          }}
        >
          The page you're looking for has been moved, deleted, or never existed in this dimension.
          <br />
          Try going back home or searching for what you need.
        </Typography>
      </Box>

      {/* Auto-redirect countdown bar */}
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
              color: '#6b7280',
              letterSpacing: '0.1em'
            }}
          >
            AUTO-REDIRECT IN
          </Typography>
          <Typography
            sx={{
              fontSize: '0.65rem',
              color: '#6366f1',
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
            background: '#f3f4f6',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              borderRadius: 2,
              transition: 'width 1s linear',
              boxShadow: '0 0 8px rgba(99,102,241,0.3)'
            }}
          />
        </Box>
      </Box>

      {/* CTA Buttons */}
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
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'uppercase',
            boxShadow: hover ? '0 0 30px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.3)' : '0 0 15px rgba(99,102,241,0.2)',
            transition: 'all 0.3s ease',
            transform: hover ? 'translateY(-2px)' : 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)'
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
            borderColor: 'rgba(99,102,241,0.3)',
            color: '#6b7280',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            px: 4,
            py: 1.5,
            borderRadius: '8px',
            textTransform: 'uppercase',
            backdropFilter: 'blur(8px)',
            background: 'rgba(99,102,241,0.03)',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#6366f1',
              background: 'rgba(99,102,241,0.08)',
              color: '#6366f1',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 20px rgba(99,102,241,0.15)'
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
            color: '#9ca3af',
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            px: 3,
            py: 1.5,
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#6366f1',
              background: 'transparent'
            }
          }}
        >
          Search
        </Button>
      </Stack>

      {/* Bottom error code */}
      <Typography
        sx={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.6rem',
          color: 'rgba(107,114,128,0.25)',
          letterSpacing: '0.25em',
          fontFamily: '"Space Mono", monospace',
          zIndex: 1,
          whiteSpace: 'nowrap'
        }}
      >
        ERR_NOT_FOUND · HTTP 404 · {new Date().toISOString().split('T')[0]}
      </Typography>
    </Box>
  );
}

// ─── Export wrapped with ThemeProvider ───────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
      `}</style>
      <NotFoundPage />
    </ThemeProvider>
  );
}
