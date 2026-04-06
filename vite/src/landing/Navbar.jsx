import React, { useState, useEffect } from 'react';
import { AppBar, Stack, Button, Box, Typography, Container, useMediaQuery, useTheme } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogin = () => {
    navigate('/authenticate');
  };

  const navItems = ['Features', 'Solutions', 'Docs', 'Pricing', 'Contact'];

  return (
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
        border: '1px solid rgba(99,102,241,.2)',
        boxShadow: scrolled ? '0 12px 32px rgba(99,102,241,.25)' : '0 6px 18px rgba(0,0,0,.08)',
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
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(99,102,241,.45)'
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.1rem' }}>A</Typography>
            </Box>

            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Abbisum
            </Typography>
          </Stack>

          {/* Navigation */}
          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '.9rem',
                    px: 2.5,
                    borderRadius: '999px',
                    color: '#64748b',
                    '&:hover': {
                      background: 'rgba(99,102,241,.1)',
                      color: '#6366f1'
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
                color: '#6366f1'
              }}
            >
              Sign in
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
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 8px 22px rgba(99,102,241,.45)',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 12px 28px rgba(99,102,241,.55)'
                  }
                }}
              >
                Get started
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;
