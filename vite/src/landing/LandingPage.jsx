import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material';
import {
  AutoAwesome,
  Bolt,
  VideoLibrary,
  CalendarMonth,
  CloudUpload,
  TrendingUp,
  Rocket,
  Speed,
  Psychology,
  Login
} from '@mui/icons-material';

export default function AbbsiumLanding() {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = () => {
    window.location.href = '/platform';
  };

  const handleLogin = () => {
    window.location.href = '/authenticate';
  };

  const features = [
    {
      icon: <CloudUpload sx={{ fontSize: 40 }} />,
      title: 'Multi-Platform Publishing',
      description: 'Publish on multiple platforms with an optimized workflow. One-click upload and scheduling made simple.'
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI Content Generation',
      description: 'Leverage AI to generate engaging content automatically. Save time and maintain quality.'
    },
    {
      icon: <VideoLibrary sx={{ fontSize: 40 }} />,
      title: 'Viral Clip Generator',
      description: 'Turn long videos into optimized short-form content for social media in seconds.'
    },

    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Optimized Workflow',
      description: 'Streamlined process from content creation to publication. Work smarter, not harder.'
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1a1a1a',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Enhanced Orbital Background with Complete Coverage */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {/* Grid Pattern Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(94, 53, 177, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94, 53, 177, 0.04) 1px, transparent 1px)
          `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Multiple Strategic Gradient Blobs for Full Coverage */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            left: '-5%',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(94, 53, 177, 0.12) 0%, rgba(94, 53, 177, 0.05) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            right: '-10%',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(94, 53, 177, 0.10) 0%, rgba(94, 53, 177, 0.04) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '10%',
            width: 650,
            height: 650,
            background: 'radial-gradient(circle, rgba(94, 53, 177, 0.11) 0%, rgba(94, 53, 177, 0.05) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(45px)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            width: 550,
            height: 550,
            background: 'radial-gradient(circle, rgba(94, 53, 177, 0.09) 0%, rgba(94, 53, 177, 0.04) 40%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(94, 53, 177, 0.06) 0%, transparent 60%)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }}
        />

        {/* Consistent Orbital Circles System */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Inner orbit */}
          <circle cx="50%" cy="50%" r="150" fill="none" stroke="rgba(94, 53, 177, 0.12)" strokeWidth="1.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 960 540"
              to="360 960 540"
              dur="35s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Small dots on inner orbit */}
          <circle cx="50%" cy="50%" r="4" fill="#5E35B1" opacity="0.4">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 960 540"
              to="360 960 540"
              dur="35s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          </circle>

          {/* Medium orbit */}
          <circle cx="50%" cy="50%" r="250" fill="none" stroke="rgba(94, 53, 177, 0.10)" strokeWidth="1.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 960 540"
              to="0 960 540"
              dur="45s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Dots on medium orbit */}
          <circle cx="50%" cy="50%" r="5" fill="#5E35B1" opacity="0.3">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="90 960 540"
              to="450 960 540"
              dur="45s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Large orbit */}
          <circle cx="50%" cy="50%" r="350" fill="none" stroke="rgba(94, 53, 177, 0.08)" strokeWidth="1.5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 960 540"
              to="360 960 540"
              dur="55s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Dots on large orbit */}
          <circle cx="50%" cy="50%" r="6" fill="#5E35B1" opacity="0.25">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="180 960 540"
              to="540 960 540"
              dur="55s"
              repeatCount="indefinite"
            />
            <animate attributeName="opacity" values="0.25;0.6;0.25" dur="5s" repeatCount="indefinite" />
          </circle>

          {/* Extra large orbit for more coverage */}
          <circle cx="50%" cy="50%" r="450" fill="none" stroke="rgba(94, 53, 177, 0.06)" strokeWidth="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 960 540"
              to="0 960 540"
              dur="65s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Connecting lines for visual interest */}
          <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="rgba(94, 53, 177, 0.05)" strokeWidth="1">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 960 540"
              to="360 960 540"
              dur="40s"
              repeatCount="indefinite"
            />
          </line>
        </svg>

        {/* Floating accent dots throughout the space */}
        {[...Array(30)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: '#5E35B1',
              borderRadius: '50%',
              opacity: Math.random() * 0.3 + 0.1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              '@keyframes float': {
                '0%, 100%': { transform: 'translate(0, 0)' },
                '25%': { transform: `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)` },
                '50%': { transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)` },
                '75%': { transform: `translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px)` }
              }
            }}
          />
        ))}
      </Box>

      {/* Floating Navbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '95%', md: '90%' },
          maxWidth: 1200,
          background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '50px',
          border: scrolled ? '1px solid rgba(94, 53, 177, 0.2)' : '1px solid rgba(94, 53, 177, 0.1)',
          boxShadow: scrolled ? '0 8px 32px rgba(94, 53, 177, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1.5,
              px: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: '#5E35B1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(94, 53, 177, 0.3)'
                }}
              >
                <AutoAwesome sx={{ fontSize: 22, color: 'white' }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#5E35B1',
                  letterSpacing: '-0.5px'
                }}
              >
                Abbsium
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4 }}>
                <Button
                  href="#features"
                  sx={{
                    textTransform: 'none',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#5E35B1',
                      background: 'rgba(94, 53, 177, 0.05)'
                    }
                  }}
                >
                  Features
                </Button>
                <Button
                  href="#how-it-works"
                  sx={{
                    textTransform: 'none',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#5E35B1',
                      background: 'rgba(94, 53, 177, 0.05)'
                    }
                  }}
                >
                  How It Works
                </Button>
                <Button
                  href="#pricing"
                  sx={{
                    textTransform: 'none',
                    color: '#1a1a1a',
                    fontWeight: 500,
                    '&:hover': {
                      color: '#5E35B1',
                      background: 'rgba(94, 53, 177, 0.05)'
                    }
                  }}
                >
                  Pricing
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                onClick={handleLogin}
                variant="text"
                sx={{
                  textTransform: 'none',
                  color: '#5E35B1',
                  fontWeight: 600,
                  px: 2.5,
                  '&:hover': {
                    background: 'rgba(94, 53, 177, 0.08)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>

              <Button
                onClick={handleAuth}
                variant="contained"
                sx={{
                  background: '#5E35B1',
                  borderRadius: '50px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(94, 53, 177, 0.4)',
                  '&:hover': {
                    background: '#4a2c8d',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(94, 53, 177, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            pt: 12
          }}
        >
          <Fade in timeout={1000}>
            <Chip
              icon={<Rocket sx={{ color: '#5E35B1 !important' }} />}
              label="The Future of Content Creation"
              sx={{
                background: 'rgba(94, 53, 177, 0.08)',
                border: '1px solid rgba(94, 53, 177, 0.3)',
                color: '#5E35B1',
                mb: 3,
                fontSize: '0.95rem',
                py: 2.5,
                height: 'auto',
                fontWeight: 600
              }}
            />
          </Fade>

          <Fade in timeout={1200}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.8rem', md: '5rem' },
                fontWeight: 900,
                mb: 3,
                color: '#1a1a1a',
                lineHeight: 1.1,
                letterSpacing: '-2px'
              }}
            >
              Create. Publish.{' '}
              <Box component="span" sx={{ color: '#5E35B1' }}>
                Dominate.
              </Box>
            </Typography>
          </Fade>

          <Fade in timeout={1400}>
            <Typography
              variant="h5"
              sx={{
                mb: 6,
                color: '#666',
                maxWidth: 700,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                lineHeight: 1.7,
                fontWeight: 400
              }}
            >
              The all-in-one platform for content creators. AI-powered generation, multi-platform publishing, and viral clip creation in one
              seamless workflow.
            </Typography>
          </Fade>

          <Zoom in timeout={1600}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                onClick={handleAuth}
                variant="contained"
                size="large"
                startIcon={<Bolt />}
                sx={{
                  background: '#5E35B1',
                  borderRadius: '50px',
                  px: 5,
                  py: 1.8,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 8px 24px rgba(94, 53, 177, 0.35)',
                  '&:hover': {
                    background: '#4a2c8d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(94, 53, 177, 0.45)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Creating Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: '50px',
                  px: 5,
                  py: 1.8,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#5E35B1',
                  color: '#5E35B1',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#5E35B1',
                    background: 'rgba(94, 53, 177, 0.08)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </Zoom>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ py: 12 }}>
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2.2rem', md: '3.5rem' },
              fontWeight: 800,
              color: '#1a1a1a',
              letterSpacing: '-1px'
            }}
          >
            Powerful Features
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              mb: 8,
              color: '#666',
              maxWidth: 600,
              mx: 'auto',
              fontWeight: 400
            }}
          >
            Everything you need to scale your content creation and reach millions
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                <Zoom in timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(94, 53, 177, 0.15)',
                      borderRadius: 4,
                      p: 4,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(94, 53, 177, 0.08)',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderColor: '#5E35B1',
                        boxShadow: '0 12px 40px rgba(94, 53, 177, 0.25)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          color: '#5E35B1',
                          mb: 3
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1a1a1a' }}>
                        {feature.title}
                      </Typography>
                      <Typography sx={{ color: '#666', lineHeight: 1.8, fontSize: '1rem' }}>{feature.description}</Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: 12,
            textAlign: 'center'
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(94, 53, 177, 0.08) 0%, rgba(94, 53, 177, 0.12) 100%)',
              border: '2px solid rgba(94, 53, 177, 0.2)',
              borderRadius: 6,
              p: { xs: 6, md: 10 },
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative elements in CTA */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(94, 53, 177, 0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 200,
                height: 200,
                background: 'radial-gradient(circle, rgba(94, 53, 177, 0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{ mb: 3, fontWeight: 900, fontSize: { xs: '2rem', md: '3.5rem' }, color: '#1a1a1a', letterSpacing: '-1px' }}
              >
                Ready to Transform Your Content?
              </Typography>
              <Typography variant="h6" sx={{ mb: 5, color: '#666', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                Join thousands of creators who are already growing with Abbsium
              </Typography>
              <Button
                onClick={handleAuth}
                variant="contained"
                size="large"
                startIcon={<Rocket />}
                sx={{
                  background: '#5E35B1',
                  borderRadius: '50px',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.25rem',
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 12px 32px rgba(94, 53, 177, 0.4)',
                  '&:hover': {
                    background: '#4a2c8d',
                    transform: 'scale(1.05)',
                    boxShadow: '0 16px 48px rgba(94, 53, 177, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started Now
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: '1px solid rgba(94, 53, 177, 0.15)',
          py: 4,
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography sx={{ color: '#999', fontWeight: 400 }}>© 2025 Abbsium. All rights reserved.</Typography>
      </Box>
    </Box>
  );
}
