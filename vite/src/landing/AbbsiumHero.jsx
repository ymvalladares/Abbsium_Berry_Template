import React from 'react';
import { Box, Button, Container, IconButton, Typography, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import RocketLaunch from '../assets/images/landing/rocket-removebg-preview.png';

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
            pointerEvents: 'none',
            // 👇 Aquí está la magia para arreglar la línea fina
            display: 'block',
            transform: 'translateY(2px)'
          }}
        >
          {/* Main white blob - TUS MONTAÑAS ORIGINALES */}
          <path
            fill="#ffffff"
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
          {/* Second semi-transparent wave for depth - TUS MONTAÑAS ORIGINALES */}
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
              pt: { xs: 18, sm: 14, md: 14, lg: 16 },
              pb: { xs: '32vw', sm: '24vw', md: '18vw', lg: '14vw', xl: '12vw' },
              gap: { xs: 3, md: 2 }
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
                  mb: { xs: 2, md: 3.5 },
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
                  mb: { xs: 2, md: 3.5 },
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
                  mb: { xs: 2.5, md: 4 },
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

            {/* RIGHT: Illustration / Image */}
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: { xs: 280, sm: 340, md: 380 }
              }}
            >
              <Box
                component="img"
                src={RocketLaunch}
                alt="Ilustración principal"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '280px', sm: '360px', md: '460px', lg: '560px' },
                  height: 'auto',
                  objectFit: 'contain',
                  animation: 'floatImg 6s ease-in-out infinite',
                  '@keyframes floatImg': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' }
                  },
                  filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.25))',
                  mixBlendMode: 'normal'
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
