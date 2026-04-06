import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Stack, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

// ─── Global styles & keyframes ────────────────────────────────────────────────
const KEYFRAMES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  @keyframes slideUpFade {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.88); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px) rotate(-0.8deg); }
    50%       { transform: translateY(-14px) rotate(0.8deg); }
  }
  @keyframes floatBadge1 {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50%       { transform: translateY(-9px) translateX(4px); }
  }
  @keyframes floatBadge2 {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50%       { transform: translateY(7px) translateX(-5px); }
  }
  @keyframes orbit {
    from { transform: rotate(0deg) translateX(108px) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(108px) rotate(-360deg); }
  }
  @keyframes orbitReverse {
    from { transform: rotate(0deg) translateX(66px) rotate(0deg); }
    to   { transform: rotate(-360deg) translateX(66px) rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes blobDrift {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(28px, -18px) scale(1.05); }
    66%       { transform: translate(-18px, 14px) scale(0.97); }
  }
  @keyframes blobDrift2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(-22px, 18px) scale(1.04); }
    66%       { transform: translate(16px, -10px) scale(0.97); }
  }
  @keyframes ringPulse {
    0%, 100% { opacity: 0.14; }
    50%       { opacity: 0.3; }
  }
  @keyframes dotBlink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.25; }
  }
  @keyframes lineGrow {
    from { stroke-dashoffset: 400; opacity: 0; }
    to   { stroke-dashoffset: 0;   opacity: 1; }
  }
  @keyframes arrowNudge {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(4px); }
  }
`;

// ─── Background blobs (light theme) ───────────────────────────────────────────
function BgBlobs() {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          left: -140,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,100,198,0.11) 0%, transparent 68%)',
          animation: 'blobDrift 13s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,100,198,0.08) 0%, transparent 65%)',
          animation: 'blobDrift2 15s ease-in-out infinite 2s',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,100,198,0.06) 0%, transparent 65%)',
          animation: 'blobDrift 11s ease-in-out infinite 1s',
          pointerEvents: 'none'
        }}
      />
      {/* Dot grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(109,100,198,0.11) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          opacity: 0.6,
          pointerEvents: 'none'
        }}
      />
    </>
  );
}

// ─── Floating stat badge ───────────────────────────────────────────────────────
function StatBadge({ label, value, icon, animationName, delay = '0s', sx }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        px: 2,
        py: 1.5,
        borderRadius: '16px',
        background: '#ffffff',
        border: '1px solid rgba(109,100,198,0.14)',
        boxShadow: '0 8px 32px rgba(109,100,198,0.13), 0 2px 8px rgba(0,0,0,0.05)',
        zIndex: 3,
        minWidth: 124,
        animation: `${animationName} 5.5s ease-in-out infinite ${delay}`,
        ...sx
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #6D64C6, #a89ef5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            flexShrink: 0
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.6rem',
              color: 'rgba(30,20,60,0.4)',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              lineHeight: 1.3
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1E143C',
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

// ─── Right side visual ─────────────────────────────────────────────────────────
function VisualCard() {
  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: '100%', md: 460 },
        height: { xs: 300, sm: 360, md: 460 },
        flexShrink: 0,
        animation: 'scaleIn 0.9s cubic-bezier(0.34,1.4,0.64,1) 0.5s both'
      }}
    >
      {/* Card shell */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '28px',
          background: 'linear-gradient(145deg, #f4f2ff 0%, #eceaff 50%, #f8f7ff 100%)',
          border: '1px solid rgba(109,100,198,0.16)',
          boxShadow: '0 20px 64px rgba(109,100,198,0.16), 0 4px 14px rgba(109,100,198,0.09)',
          overflow: 'hidden',
          animation: 'floatCard 8s ease-in-out infinite'
        }}
      >
        {/* Top shimmer line */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: '15%',
            width: '70%',
            height: '1.5px',
            background: 'linear-gradient(90deg, transparent, rgba(109,100,198,0.55), transparent)'
          }}
        />

        {/* SVG */}
        <Box
          component="svg"
          viewBox="0 0 460 460"
          xmlns="http://www.w3.org/2000/svg"
          sx={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          {/* Rings */}
          <circle cx="230" cy="230" r="172" fill="none" stroke="rgba(109,100,198,0.07)" strokeWidth="1.5" />
          <circle
            cx="230"
            cy="230"
            r="130"
            fill="none"
            stroke="rgba(109,100,198,0.1)"
            strokeWidth="1"
            strokeDasharray="8 5"
            style={{ animation: 'ringPulse 4.5s ease-in-out infinite' }}
          />
          <circle cx="230" cy="230" r="90" fill="none" stroke="rgba(109,100,198,0.13)" strokeWidth="1" />

          {/* Core */}
          <circle cx="230" cy="230" r="44" fill="rgba(109,100,198,0.07)" />
          <circle cx="230" cy="230" r="27" fill="rgba(109,100,198,0.15)" />
          <circle cx="230" cy="230" r="14" fill="#6D64C6" />
          <circle cx="230" cy="230" r="6" fill="#fff" />

          {/* Connector lines */}
          {[
            { x1: 98, y1: 148, x2: 230, y2: 230 },
            { x1: 362, y1: 143, x2: 230, y2: 230 },
            { x1: 118, y1: 342, x2: 230, y2: 230 },
            { x1: 352, y1: 337, x2: 230, y2: 230 },
            { x1: 230, y1: 68, x2: 230, y2: 230 }
          ].map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="rgba(109,100,198,0.22)"
              strokeWidth="1"
              strokeDasharray="400"
              style={{
                animation: `lineGrow 1s ease ${0.55 + i * 0.1}s both`
              }}
            />
          ))}

          {/* Satellite dots */}
          {[
            { cx: 98, cy: 148, r: 9, d: '0s' },
            { cx: 362, cy: 143, r: 7, d: '0.3s' },
            { cx: 118, cy: 342, r: 8, d: '0.6s' },
            { cx: 352, cy: 337, r: 10, d: '0.9s' },
            { cx: 230, cy: 68, r: 6, d: '1.2s' }
          ].map((n, i) => (
            <circle
              key={i}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill="rgba(109,100,198,0.5)"
              style={{ animation: `dotBlink ${2.4 + i * 0.35}s ease-in-out infinite ${n.d}` }}
            />
          ))}

          {/* Decorative arc */}
          <path d="M 75 315 Q 230 145 385 315" fill="none" stroke="rgba(109,100,198,0.13)" strokeWidth="1.5" strokeDasharray="7 5" />
        </Box>

        {/* Orbiting dots */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 9,
            height: 9,
            mt: '-4.5px',
            ml: '-4.5px',
            borderRadius: '50%',
            background: '#6D64C6',
            boxShadow: '0 0 12px 3px rgba(109,100,198,0.45)',
            animation: 'orbit 6s linear infinite',
            transformOrigin: 'center'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 6,
            height: 6,
            mt: '-3px',
            ml: '-3px',
            borderRadius: '50%',
            background: '#a89ef5',
            boxShadow: '0 0 8px 2px rgba(168,158,245,0.55)',
            animation: 'orbitReverse 3.8s linear infinite',
            transformOrigin: 'center'
          }}
        />
      </Box>

      {/* Floating stat badges */}
      <StatBadge label="Active Users" value="128K+" icon="👥" animationName="floatBadge1" delay="0s" sx={{ top: -18, left: -22 }} />
      <StatBadge label="Uptime SLA" value="99.99%" icon="✦" animationName="floatBadge2" delay="0.9s" sx={{ bottom: 22, right: -22 }} />
    </Box>
  );
}

// ─── Main Hero export ──────────────────────────────────────────────────────────
export default function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{KEYFRAMES}</style>

      <Box
        component="section"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          background: '#ffffff'
        }}
      >
        <BgBlobs />

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            px: { xs: 3, sm: 5, md: 8 },
            py: { xs: 12, sm: 14, md: 12 },
            mx: 'auto'
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between" spacing={{ xs: 8, md: 6 }}>
            {/* ── LEFT COLUMN ── */}
            <Box
              sx={{
                flex: 1,
                maxWidth: { md: 560 },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              {/* Badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  mb: 3.5,
                  animation: ready ? 'slideUpFade 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both' : 'none',
                  opacity: ready ? undefined : 0
                }}
              >
                <Chip
                  label="✦  Now in public beta"
                  size="small"
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.07em',
                    color: '#6D64C6',
                    background: 'rgba(109,100,198,0.07)',
                    border: '1px solid rgba(109,100,198,0.22)',
                    px: 1,
                    height: 28,
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              </Box>

              {/* Wordmark */}
              <Box
                sx={{
                  animation: ready ? 'slideUpFade 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both' : 'none',
                  opacity: ready ? undefined : 0,
                  mb: 1.5
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: '0.78rem', md: '0.84rem' },
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: '#6D64C6'
                  }}
                >
                  Abbsium
                </Typography>
              </Box>

              {/* Headline */}
              <Box
                sx={{
                  animation: ready ? 'slideUpFade 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both' : 'none',
                  opacity: ready ? undefined : 0,
                  mb: 2.5
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4rem', lg: '4.5rem' },
                    lineHeight: 1.07,
                    letterSpacing: '-0.025em',
                    color: '#1E143C'
                  }}
                >
                  Intelligence
                  <br />
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, #6D64C6 0%, #a89ef5 35%, #6D64C6 70%)',
                      backgroundSize: '300% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer 4s linear infinite',
                      display: 'inline-block'
                    }}
                  >
                    re-imagined.
                  </Box>
                </Typography>
              </Box>

              {/* Sub */}
              <Box
                sx={{
                  animation: ready ? 'slideUpFade 0.7s cubic-bezier(0.22,1,0.36,1) 0.38s both' : 'none',
                  opacity: ready ? undefined : 0,
                  mb: 5
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: { xs: '1rem', md: '1.12rem' },
                    lineHeight: 1.82,
                    color: 'rgba(30,20,60,0.5)',
                    maxWidth: 460,
                    mx: { xs: 'auto', md: 0 }
                  }}
                >
                  Abbsium gives your team a unified AI workspace — automate decisions, surface insights, and ship faster without
                  compromising control.
                </Typography>
              </Box>

              {/* Buttons */}
              <Box
                sx={{
                  animation: ready ? 'slideUpFade 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both' : 'none',
                  opacity: ready ? undefined : 0,
                  mb: 5
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  justifyContent={{ xs: 'center', md: 'flex-start' }}
                  alignItems="center"
                >
                  {/* Primary */}
                  <Button
                    variant="contained"
                    endIcon={
                      <ArrowForwardIcon
                        sx={{
                          fontSize: '1rem !important',
                          transition: 'transform 0.28s ease'
                        }}
                      />
                    }
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      letterSpacing: '0.01em',
                      textTransform: 'none',
                      px: 3.5,
                      py: 1.6,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6D64C6 0%, #8a82d4 100%)',
                      boxShadow: '0 4px 20px rgba(109,100,198,0.28)',
                      color: '#fff',
                      transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7b73d0 0%, #9c94e0 100%)',
                        boxShadow: '0 10px 36px rgba(109,100,198,0.42)',
                        transform: 'translateY(-3px) scale(1.03)',
                        '& .MuiButton-endIcon svg': {
                          transform: 'translateX(4px)'
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(0.99)'
                      }
                    }}
                  >
                    Get Started
                  </Button>

                  {/* Secondary */}
                  <Button
                    variant="outlined"
                    startIcon={
                      <PlayCircleOutlineIcon
                        sx={{
                          fontSize: '1.15rem !important',
                          color: '#6D64C6',
                          transition: 'transform 0.28s ease'
                        }}
                      />
                    }
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 400,
                      fontSize: '0.95rem',
                      textTransform: 'none',
                      px: 3,
                      py: 1.6,
                      borderRadius: '12px',
                      color: '#6D64C6',
                      border: '1.5px solid rgba(109,100,198,0.25)',
                      background: 'transparent',
                      transition: 'all 0.28s cubic-bezier(0.34,1.4,0.64,1)',
                      '&:hover': {
                        background: 'rgba(109,100,198,0.05)',
                        borderColor: '#6D64C6',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 18px rgba(109,100,198,0.14)',
                        '& .MuiButton-startIcon svg': {
                          transform: 'scale(1.18)'
                        }
                      }
                    }}
                  >
                    Watch demo
                  </Button>
                </Stack>
              </Box>

              {/* Social proof */}
              <Box
                sx={{
                  animation: ready ? 'fadeIn 0.8s ease 0.75s both' : 'none',
                  opacity: ready ? undefined : 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Stack direction="row" spacing={-0.75}>
                  {['#8B83F7', '#6D64C6', '#A89EF5', '#5048B0'].map((bg, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: bg,
                        border: '2.5px solid #fff',
                        boxShadow: '0 2px 6px rgba(109,100,198,0.18)',
                        zIndex: 4 - i
                      }}
                    />
                  ))}
                </Stack>
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '0.8rem',
                    color: 'rgba(30,20,60,0.42)'
                  }}
                >
                  Trusted by{' '}
                  <Box component="span" sx={{ color: '#1E143C', fontWeight: 600 }}>
                    4,200+
                  </Box>{' '}
                  teams worldwide
                </Typography>
              </Box>
            </Box>

            {/* ── RIGHT COLUMN ── */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                px: { xs: 2, md: 0 },
                mt: { xs: 2, md: 0 }
              }}
            >
              <VisualCard />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}
