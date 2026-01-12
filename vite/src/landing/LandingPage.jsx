import React, { useState, useEffect } from 'react';
import { AppBar, Box, Button, Container, Typography, Grid, Card, CardContent, Chip, Stack, useTheme, useMediaQuery } from '@mui/material';
import {
  AutoAwesome,
  Rocket,
  Psychology,
  VideoLibrary,
  CloudUpload,
  Speed,
  TrendingUp,
  People,
  Bolt,
  ArrowForward
} from '@mui/icons-material';

export default function AbbsiumLanding() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogin = () => {
    window.location.href = '/authenticate';
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg,#ffffff,#f7f8ff)' }}>
      {/* ================= NAVBAR ================= */}
      <AppBar
        elevation={0}
        sx={{
          position: 'fixed',
          top: 18,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '90%', md: '70%' },
          maxWidth: 1250,
          height: 64,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderRadius: '999px',
          border: '1px solid rgba(102,126,234,.2)',
          boxShadow: scrolled ? '0 12px 32px rgba(102,126,234,.25)' : '0 6px 18px rgba(0,0,0,.08)',
          transition: 'all .3s ease',
          zIndex: 1000
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" justifyContent="space-between" height="64px">
            {/* Logo */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg,#667eea,#764ba2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(102,126,234,.45)'
                }}
              >
                <AutoAwesome sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg,#667eea,#764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Abbsium
              </Typography>
            </Stack>

            {/* Nav links */}
            {!isMobile && (
              <Stack direction="row" spacing={1}>
                {['Features', 'Pricing', 'Analytics'].map((item) => (
                  <Button
                    key={item}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '.9rem',
                      px: 2.5,
                      borderRadius: '999px',
                      color: '#475569',
                      '&:hover': {
                        background: 'rgba(102,126,234,.1)',
                        color: '#667eea'
                      }
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            )}

            {/* Actions */}
            <Stack direction="row" spacing={1.5}>
              <Button
                onClick={handleLogin}
                sx={{
                  fontWeight: 700,
                  fontSize: '.9rem',
                  textTransform: 'none',
                  color: '#667eea'
                }}
              >
                Login
              </Button>
              {!isMobile && (
                <Button
                  onClick={handleLogin}
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{
                    fontWeight: 800,
                    fontSize: '.9rem',
                    px: 3,
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                    boxShadow: '0 8px 22px rgba(102,126,234,.45)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 12px 28px rgba(102,126,234,.55)'
                    }
                  }}
                >
                  Get Started
                </Button>
              )}
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* ================= HERO ================= */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 14, md: 18 },
            textAlign: 'center',
            minHeight: '67vh'
          }}
        >
          <Chip
            icon={<Rocket />}
            label="AI-powered content platform"
            sx={{
              mb: 4,
              px: 2,
              fontWeight: 700,
              borderRadius: '999px',
              background: 'rgba(102,126,234,.12)',
              color: '#667eea'
            }}
          />

          <Typography
            sx={{
              fontSize: '2.5rem',
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3
            }}
          >
            Build Viral Content
            <Box component="span" sx={{ color: '#667eea' }}>
              {' '}
              Faster Than Ever
            </Box>
          </Typography>

          <Typography
            sx={{
              maxWidth: 720,
              mx: 'auto',
              fontSize: '1.15rem',
              color: '#64748b',
              lineHeight: 1.7,
              mb: 6
            }}
          >
            Abbsium helps creators, marketers and teams generate, edit and publish high-performing content using AI automation.
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              onClick={handleLogin}
              startIcon={<Bolt />}
              sx={{
                fontWeight: 800,
                px: 4,
                py: 1.6,
                borderRadius: '999px',
                background: 'linear-gradient(135deg,#667eea,#764ba2)',
                color: '#fff'
              }}
            >
              Start Free Trial
            </Button>
          </Stack>
        </Box>
      </Container>

      {/* ================= FEATURE CARDS ================= */}
      <Container maxWidth="lg">
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

      {/* ================= BRAND SECTION ================= */}
      <Box sx={{ mt: { xs: 9, md: 20 } }}>
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
      {/* ================= FOOTER ================= */}
      <Box
        sx={{
          mt: 20,
          background: 'linear-gradient(180deg,#f8fafc,#eef2ff)',
          color: '#334155'
        }}
      >
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Grid container spacing={8}>
            {/* BRAND */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg,#667eea,#764ba2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AutoAwesome sx={{ color: '#fff', fontSize: 18 }} />
                  </Box>

                  <Typography fontWeight={900} fontSize="1.1rem">
                    Abbsium
                  </Typography>
                </Stack>

                <Typography sx={{ color: '#475569', maxWidth: 420, lineHeight: 1.8 }}>
                  A modern content platform built for creators who value clarity, speed and creative control.
                </Typography>

                <Button
                  onClick={handleLogin}
                  endIcon={<ArrowForward />}
                  sx={{
                    alignSelf: 'flex-start',
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                    color: '#fff',
                    '&:hover': { opacity: 0.9 }
                  }}
                >
                  Get started
                </Button>
              </Stack>
            </Grid>

            {/* LINKS */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={6}>
                {[
                  { title: 'Product', links: ['Features', 'Pricing', 'Analytics'] },
                  { title: 'Company', links: ['About', 'Blog', 'Careers'] },
                  { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }
                ].map((group, i) => (
                  <Grid key={i} size={{ xs: 6, sm: 4 }}>
                    <Typography fontWeight={700} mb={2}>
                      {group.title}
                    </Typography>

                    <Stack spacing={1.5}>
                      {group.links.map((link) => (
                        <Typography
                          key={link}
                          sx={{
                            color: '#475569',
                            fontSize: '.9rem',
                            cursor: 'pointer',
                            '&:hover': { color: '#667eea' }
                          }}
                        >
                          {link}
                        </Typography>
                      ))}
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* BOTTOM */}
          <Box
            sx={{
              mt: 10,
              pt: 4,
              borderTop: '1px solid rgba(100,116,139,.25)',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Typography sx={{ color: '#64748b', fontSize: '.85rem' }}>
              © {new Date().getFullYear()} Abbsium. All rights reserved.
            </Typography>

            <Typography sx={{ color: '#64748b', fontSize: '.85rem' }}>Built with focus, not noise.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
