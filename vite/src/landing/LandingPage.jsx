import React from 'react';
import { Box, Button, Container, Typography, Grid, Card, Stack, useTheme, useMediaQuery } from '@mui/material';
import { Psychology, VideoLibrary, CloudUpload, Speed, ArrowForward } from '@mui/icons-material';
import AbbsiumHero from './AbbsiumHero';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import PricingComponent from './PricingComponent';

export default function AbbsiumLanding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  return (
    <Box sx={{ background: 'linear-gradient(180deg,#ffffff,#f7f8ff)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= MAIN CONTENT ================= */}
      <Box sx={{ flex: 1, pt: { xs: 10, md: 12 } }}>
        {/* ================= HERO ================= */}
        <AbbsiumHero />

        <Container sx={{ mt: 12 }} maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: <Psychology />,
                title: 'AI Content Engine',
                text: 'Generate high-converting captions, hooks and scripts instantly.'
              },
              {
                icon: <VideoLibrary />,
                title: 'Video Automation',
                text: 'Turn long videos into short-form content optimized for virality.'
              },
              {
                icon: <CloudUpload />,
                title: 'Auto Publishing',
                text: 'Publish content to all major platforms with one click.'
              },
              {
                icon: <Speed />,
                title: 'High Performance',
                text: 'Fast processing powered by scalable cloud infrastructure.'
              }
            ].map((item, i) => (
              <Grid key={i} size={{ xs: 6, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    p: 3,
                    textAlign: 'left',
                    boxShadow: '0 8px 24px rgba(102,126,234,.15)',
                    transition: 'all .3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 14px 40px rgba(102,126,234,.3)'
                    }
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        background: 'rgba(102,126,234,.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#667eea'
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography fontWeight={800} fontSize="1rem">
                      {item.title}
                    </Typography>

                    <Typography fontSize=".9rem" color="#64748b" lineHeight={1.6}>
                      {item.text}
                    </Typography>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <PricingComponent />

        {/* ================= BRAND SECTION ================= */}
        <Box sx={{ mt: { xs: 9 }, mb: { xs: 9, md: 20 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={8} alignItems="center" justifyContent="space-between">
              {/* LEFT TEXT */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2rem', md: '2.6rem' },
                    lineHeight: 1.15,
                    mb: 1
                  }}
                >
                  Built for creators
                  <Box component="span" sx={{ color: '#667eea' }}>
                    {' '}
                    who think bigger
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: '#64748b',
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                    mb: 4,
                    maxWidth: 520
                  }}
                >
                  Abbsium is being designed as a modern content platform focused on speed, simplicity and creative freedom.
                </Typography>

                <Typography
                  sx={{
                    color: '#64748b',
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                    maxWidth: 520
                  }}
                >
                  No noise. No complexity. Just tools that help creators move faster and stay focused on what matters.
                </Typography>
              </Grid>

              {/* RIGHT VISUAL */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 280, md: 380 },
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, rgba(102,126,234,.12), rgba(118,75,162,.12))',
                    overflow: 'hidden'
                  }}
                >
                  {/* Abstract layers */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 40,
                      left: 40,
                      right: 80,
                      height: { xs: 50, md: 80 },
                      borderRadius: 3,
                      background: '#ffffff',
                      boxShadow: '0 10px 30px rgba(0,0,0,.08)'
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 120, md: 140 },
                      left: 80,
                      right: 40,
                      height: { xs: 50, md: 80 },
                      borderRadius: 3,
                      background: '#ffffff',
                      boxShadow: '0 10px 30px rgba(0,0,0,.08)'
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: 200, md: 240 },
                      left: 60,
                      right: 120,
                      height: { xs: 50, md: 80 },
                      borderRadius: 3,
                      background: '#ffffff',
                      boxShadow: '0 10px 30px rgba(0,0,0,.08)'
                    }}
                  />

                  {/* Accent glow */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at top right, rgba(102,126,234,.25), transparent 60%)'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* ================= FOOTER ================= */}
      <Footer />
    </Box>
  );
}
