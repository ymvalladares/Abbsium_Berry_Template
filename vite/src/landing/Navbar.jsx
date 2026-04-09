import React, { useState, useEffect } from 'react';
import { AppBar, Stack, Button, Box, Typography, Container, useMediaQuery } from '@mui/material';
import { Bolt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
      setScrolled(currentScroll > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Features', 'Solutions', 'Architecture', 'Pricing'];

  return (
    <AppBar
      elevation={0}
      sx={{
        position: 'fixed',
        top: scrolled ? 15 : 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: scrolled ? { xs: '95%', md: '65%' } : '100%',
        maxWidth: scrolled ? 1100 : '100%',
        height: scrolled ? 64 : 80,
        // CORRECCIÓN: Fondo transparente cuando no hay scroll
        background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backgroundImage: 'none',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        border: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        borderRadius: scrolled ? '20px' : '0px',
        boxShadow: scrolled ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : 'none',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 2000,
        overflow: 'hidden'
      }}
    >
      {scrolled && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${scrollProgress}%`,
            height: '3px',
            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
            zIndex: 100,
            transition: 'width 0.2s ease-out'
          }}
        />
      )}

      <Container maxWidth={scrolled ? 'lg' : 'xl'} sx={{ height: '100%' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" height="100%">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: scrolled ? '#6366f1' : '#1E143C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bolt sx={{ color: '#fff', fontSize: '1.3rem' }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: '1.3rem',
                color: scrolled ? '#fff' : '#1E143C',
                letterSpacing: '-1px'
              }}
            >
              Abbisum
            </Typography>
          </Stack>

          {!isMobile && (
            <Stack direction="row" spacing={1}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '.9rem',
                    color: scrolled ? 'rgba(255,255,255,0.7)' : '#5F6368',
                    '&:hover': { color: scrolled ? '#fff' : '#6366f1' }
                  }}
                >
                  {item}
                </Button>
              ))}
            </Stack>
          )}

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              onClick={() => navigate('/authenticate')}
              sx={{
                fontWeight: 700,
                fontSize: '.9rem',
                textTransform: 'none',
                color: scrolled ? '#cbd5e1' : '#1E143C'
              }}
            >
              Log in
            </Button>
            <Button
              onClick={() => navigate('/authenticate')}
              variant="contained"
              disableElevation
              sx={{
                fontWeight: 800,
                fontSize: '.9rem',
                px: 3,
                borderRadius: scrolled ? '12px' : '8px',
                bgcolor: scrolled ? '#6366f1' : '#1E143C',
                color: '#fff',
                textTransform: 'none',
                '&:hover': { bgcolor: scrolled ? '#4f46e5' : '#000' }
              }}
            >
              Get Started{' '}
            </Button>
          </Stack>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;
