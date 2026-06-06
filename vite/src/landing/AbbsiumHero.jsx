import { Box, Button, Container, IconButton, Typography, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';

const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } }
});

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  size: i % 5 === 0 ? 3 : 2,
  top: ((i * 41 + 17) % 88) + '%',
  left: ((i * 67 + 11) % 100) + '%',
  opacity: 0.2 + ((i * 19) % 40) / 100,
  dur: 2.5 + ((i * 13) % 30) / 10,
  del: ((i * 7) % 25) / 10
}));

function Rocket() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 260 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="rBody" x1="90" y1="55" x2="175" y2="275" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="rNose" x1="90" y1="10" x2="175" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="rFin" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
        <radialGradient id="rWindow" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <linearGradient id="rFlameA" x1="130" y1="288" x2="130" y2="338" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rFlameB" x1="130" y1="290" x2="130" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="130" cy="308" rx="30" ry="24" fill="url(#rFlameA)" opacity="0.9">
        <animate attributeName="ry" values="24;32;24" dur="0.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;1;0.9" dur="0.5s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="130" cy="300" rx="15" ry="16" fill="url(#rFlameB)">
        <animate attributeName="ry" values="16;22;16" dur="0.35s" repeatCount="indefinite" />
      </ellipse>
      <path d="M88 215 L52 292 L100 262 Z" fill="url(#rFin)" filter="url(#glow)" />
      <path d="M172 215 L208 292 L160 262 Z" fill="url(#rFin)" filter="url(#glow)" />
      <path
        d="M130 48 C103 92 90 152 90 210 C90 248 108 268 130 268 C152 268 170 248 170 210 C170 152 157 92 130 48 Z"
        fill="url(#rBody)"
      />
      <path
        d="M130 48 C117 92 110 152 110 210 C110 238 117 255 130 268 C108 268 90 248 90 210 C90 152 103 92 130 48 Z"
        fill="rgba(255,255,255,0.09)"
      />
      <path d="M130 16 C116 36 104 62 104 86 C104 97 115 105 130 105 C145 105 156 97 156 86 C156 62 144 36 130 16 Z" fill="url(#rNose)" />
      <circle cx="130" cy="148" r="29" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="3" />
      <circle cx="130" cy="148" r="23" fill="url(#rWindow)" />
      <ellipse cx="122" cy="140" rx="8" ry="5.5" fill="rgba(255,255,255,0.3)" />
      <path d="M102 182 Q130 191 158 182" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M98 208 Q130 217 162 208" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="113" y="262" width="34" height="18" rx="5" fill="#3b0764" stroke="#7c3aed" strokeWidth="1.5" />
      {[
        [42, 75],
        [218, 55],
        [28, 188],
        [230, 200],
        [58, 288],
        [205, 272]
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 2 : 1.5} fill="white" opacity={0.45 + (i % 3) * 0.15}>
          <animate
            attributeName="opacity"
            values={`${0.35 + (i % 3) * 0.15};0.95;${0.35 + (i % 3) * 0.15}`}
            dur={`${1.3 + i * 0.28}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function Planet({ size = 88 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(251,146,60,0.5), 0 0 80px rgba(251,146,60,0.2)',
        flexShrink: 0,
        animation: 'pltFlt 6s ease-in-out infinite',
        '@keyframes pltFlt': {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        }
      }}
    >
      {Array.from({ length: 7 }).map((_, i) => (
        <Box key={i} sx={{ height: `${100 / 7}%`, background: i % 2 === 0 ? '#f97316' : '#fb923c' }} />
      ))}
    </Box>
  );
}

export default function HeroSection() {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));

  return (
    <ThemeProvider theme={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 35%, #6d28d9 60%, #4c1d95 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Stars */}
        {STARS.map((s) => (
          <Box
            key={s.id}
            sx={{
              position: 'absolute',
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: 'white',
              top: s.top,
              left: s.left,
              opacity: s.opacity,
              zIndex: 0,
              animation: `twkl ${s.dur}s ease-in-out ${s.del}s infinite`,
              '@keyframes twkl': {
                '0%,100%': { opacity: s.opacity * 0.3 },
                '50%': { opacity: Math.min(s.opacity * 2.8, 1) }
              }
            }}
          />
        ))}

        {/* White wave — fills bottom, purple shows on top */}
        {/* Uses padding-bottom trick so wave scales with viewport */}
        <Box
          component="svg"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          {/* Main white blob */}
          <path
            fill="white"
            d="
              M 0 900
              L 0 580
              C 60 520, 160 475, 290 515
              C 420 555, 465 595, 570 555
              C 675 515, 710 450, 815 448
              C 920 446, 965 488, 1015 488
              C 1115 488, 1210 510, 1295 552
              C 1355 582, 1400 700, 1440 860
              L 1440 900
              Z
            "
          />
          {/* Second semi-transparent wave for depth */}
          <path
            fill="rgba(255,255,255,0.16)"
            d="
              M 0 900
              L 0 640
              C 85 590, 205 558, 338 588
              C 471 618, 515 648, 628 618
              C 741 588, 788 545, 880 540
              C 972 535, 1028 558, 1108 572
              C 1208 590, 1308 628, 1388 688
              C 1425 715, 1460 762, 1500 900
              Z
            "
          />
        </Box>

        {/* Floating ring */}
        <Box
          sx={{
            position: 'absolute',
            top: '35%',
            right: '16%',
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.4)',
            zIndex: 2,
            animation: 'ringFlt 5s ease-in-out 0.4s infinite',
            '@keyframes ringFlt': {
              '0%,100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' }
            }
          }}
        />

        {/* Small dot */}
        <Box
          sx={{
            position: 'absolute',
            top: '14%',
            right: '9%',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            zIndex: 2,
            animation: 'ringFlt 4s ease-in-out 1s infinite'
          }}
        />

        {/* Main content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              alignItems: 'center',
              pt: { xs: 20, sm: 18, md: 20, lg: 22 },
              // bottom padding reserves space so text never overlaps the wave
              pb: { xs: '38vw', sm: '28vw', md: '18vw', lg: '14vw', xl: '12vw' },
              gap: { xs: 4, md: 2 }
            }}
          >
            {/* LEFT: text */}
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 400,
                  fontSize: { xs: '1.9rem', sm: '2.4rem', md: '2.8rem' },
                  color: 'white',
                  lineHeight: 1.2,
                  animation: 'fadeUp 0.6s ease both',
                  '@keyframes fadeUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                We help you to
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: '2.2rem', sm: '2.9rem', md: '3.4rem' },
                  color: 'white',
                  lineHeight: 1.1,
                  mb: 2,
                  animation: 'fadeUp 0.6s ease 0.1s both'
                }}
              >
                Grow Your Business
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: { xs: '0.88rem', md: '0.95rem' },
                  lineHeight: 1.75,
                  maxWidth: 400,
                  mx: { xs: 'auto', md: 0 },
                  mb: 3.5,
                  animation: 'fadeUp 0.6s ease 0.2s both'
                }}
              >
                Turn Your Streams Into Viral Clips Our AI finds your best moments and turns them into ready-to-post content in seconds.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mb: 4,
                  animation: 'fadeUp 0.6s ease 0.3s both'
                }}
              >
                <Button
                  sx={{
                    background: 'linear-gradient(135deg, #f97316, #ef4444)',
                    color: 'white',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    px: 3,
                    py: 1.2,
                    borderRadius: '50px',
                    boxShadow: '0 6px 20px rgba(249,115,22,0.45)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 28px rgba(249,115,22,0.55)'
                    },
                    transition: 'all 0.25s ease'
                  }}
                >
                  Ideal project
                </Button>
                <Button
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                    color: 'white',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    px: 3,
                    py: 1.2,
                    borderRadius: '50px',
                    boxShadow: '0 6px 20px rgba(6,182,212,0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 28px rgba(6,182,212,0.5)'
                    },
                    transition: 'all 0.25s ease'
                  }}
                >
                  Contact us
                </Button>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  animation: 'fadeUp 0.6s ease 0.4s both'
                }}
              >
                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                  <IconButton
                    key={i}
                    size="small"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      p: 0.8,
                      '&:hover': { color: 'white', transform: 'translateY(-3px)' },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Icon sx={{ fontSize: '1.15rem' }} />
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* RIGHT: planet + rocket — clipped so nothing bleeds out */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // clip so planet never bleeds off-screen on any size
                overflow: 'hidden',
                // enough height for planet + rocket stack
                minHeight: { xs: 280, sm: 340, md: 380 }
              }}
            >
              {/* Planet — absolutely placed top-right of this cell */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: '12px', md: '20px' },
                  right: { xs: '5%', sm: '8%', md: '6%', lg: '4%' },
                  zIndex: 2
                }}
              >
                <Planet size={isMobile ? 64 : isXL ? 100 : 88} />
              </Box>

              {/* Rocket — centred in cell */}
              <Box
                sx={{
                  width: { xs: 180, sm: 220, md: 260, xl: 300 },
                  height: { xs: 228, sm: 278, md: 328, xl: 380 },
                  animation: 'rktBob 5s ease-in-out infinite',
                  filter: 'drop-shadow(0 20px 44px rgba(109,40,217,0.45))',
                  '@keyframes rktBob': {
                    '0%,100%': { transform: 'translateY(0px) rotate(-6deg)' },
                    '50%': { transform: 'translateY(-26px) rotate(6deg)' }
                  },
                  mt: { xs: 5, md: 3 }
                }}
              >
                <Rocket />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
