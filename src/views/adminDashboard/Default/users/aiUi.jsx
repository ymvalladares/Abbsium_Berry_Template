import { Box } from '@mui/material';

export const ACCENT = '#3b82f6';
export const ACCENT_SOFT = '#60a5fa';
export const ACCENT_CYAN = '#14b8a6';

export const GRADIENT_MAIN = 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #14b8a6 100%)';
export const GRADIENT_WARM = 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)';
export const GRADIENT_DANGER = 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)';

export const NOISE_OVERLAY =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")";

export const gradientText = {
  backgroundImage: GRADIENT_MAIN,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

export const glowShadow = (rgb = '59,130,246', opacity = 0.5, size = 16) =>
  `0 ${Math.round(size / 2)}px ${size}px -6px rgba(${rgb},${opacity})`;

export const glassCard = (isDark) => ({
  position: 'relative',
  borderRadius: '20px',
  border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(59,130,246,0.16)'}`,
  background: isDark
    ? 'linear-gradient(165deg, rgba(30,58,138,0.45) 0%, rgba(15,23,42,0.78) 100%)'
    : 'linear-gradient(165deg, rgba(255,255,255,0.94) 0%, rgba(255,255,255,0.72) 100%)',
  backdropFilter: 'blur(24px) saturate(150%)',
  WebkitBackdropFilter: 'blur(24px) saturate(150%)',
  boxShadow: isDark
    ? '0 24px 60px -16px rgba(2,6,23,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 24px 60px -20px rgba(30,58,138,0.22), inset 0 1px 0 rgba(255,255,255,0.95)',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    pointerEvents: 'none',
    opacity: isDark ? 0.5 : 0.35,
    backgroundImage: NOISE_OVERLAY
  }
});

export const glassInput = (isDark) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: isDark ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(10px)',
    fontSize: '14px',
    transition: 'all 0.25s',
    '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.18)' },
    '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(59,130,246,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1.5px' },
    '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(59,130,246,0.14)' }
  },
  '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }
});

export const gradientButton = (gradient = GRADIENT_MAIN, glowRgb = '59,130,246') => ({
  backgroundImage: gradient,
  color: '#fff',
  borderRadius: '12px',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: glowShadow(glowRgb, 0.6, 20),
  transition: 'all 0.25s',
  '&:hover': {
    backgroundImage: gradient,
    filter: 'brightness(1.12) saturate(1.1)',
    boxShadow: glowShadow(glowRgb, 0.75, 24),
    transform: 'translateY(-1px)'
  },
  '&:active': { transform: 'translateY(0)' }
});

export const gradientIconBox = (size = 48, radius = '14px', gradient = GRADIENT_MAIN, glowRgb = '59,130,246') => ({
  width: size,
  height: size,
  minWidth: size,
  borderRadius: radius,
  backgroundImage: gradient,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: glowShadow(glowRgb, 0.5, 14),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: radius,
    border: '1px solid rgba(255,255,255,0.35)'
  }
});

const auroraBlobs = (isDark) => [
  { color: `rgba(59,130,246,${isDark ? 0.38 : 0.24})`, size: 420, top: '42%', left: '4%' },
  { color: `rgba(20,184,166,${isDark ? 0.28 : 0.18})`, size: 500, top: '58%', right: -140 },
  { color: `rgba(251,191,36,${isDark ? 0.16 : 0.12})`, size: 360, bottom: -140, left: '32%' },
  { color: `rgba(16,185,129,${isDark ? 0.18 : 0.1})`, size: 320, bottom: '10%', right: '12%' }
];

export const AuroraLayer = ({ isDark }) => (
  <Box
    sx={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      borderRadius: 'inherit'
    }}
  >
    {auroraBlobs(isDark).map((b, i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          width: b.size,
          height: b.size,
          top: b.top,
          left: b.left,
          right: b.right,
          bottom: b.bottom,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
          filter: 'blur(80px)'
        }}
      />
    ))}
  </Box>
);
