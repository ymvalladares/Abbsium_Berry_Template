import { useState, useEffect } from 'react';
import { AppBar, Stack, Button, Box, Typography, Container, useMediaQuery, IconButton } from '@mui/material';
import { Bolt, Menu, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Solutions', id: 'solutions' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'Contact', id: 'contact' }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <AppBar
        elevation={0}
        sx={{
          position: 'fixed',
          top: scrolled ? 15 : 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: scrolled ? { xs: '94%', sm: '88%', md: '68%' } : '100%',
          maxWidth: scrolled ? 1140 : '100%',
          height: scrolled ? 62 : 80,
          background: scrolled ? 'rgba(15, 12, 41, 0.82)' : 'transparent',
          backgroundImage: 'none',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          borderRadius: scrolled ? '22px' : '0px',
          boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2000,
          overflow: 'hidden'
        }}
      >
        {/* ── Scroll progress bar ── */}
        {scrolled && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${scrollProgress}%`,
              height: '2.5px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
              zIndex: 100,
              transition: 'width 0.15s ease-out',
              borderRadius: '0 2px 2px 0'
            }}
          />
        )}

        <Container maxWidth={scrolled ? 'lg' : 'xl'} sx={{ height: '100%', px: scrolled ? 3 : { xs: 2, md: 4 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" height="100%">
            {/* ── Logo ── */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '11px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Bolt sx={{ color: '#fff', fontSize: '1.2rem' }} />
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  background: 'linear-gradient(135deg, #ffffff, #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                Abbsium
              </Typography>
            </Stack>

            {/* ── Desktop nav ── */}
            {!isMobile && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => scrollTo(item.id)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.88rem',
                      color: '#ffffff',
                      px: 2,
                      py: 0.8,
                      borderRadius: '10px',
                      position: 'relative',
                      '&:hover': {
                        color: '#fff',
                        background: 'rgba(255,255,255,0.06)'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 4,
                        left: '50%',
                        transform: 'translateX(-50%) scaleX(0)',
                        width: '60%',
                        height: '2px',
                        borderRadius: '1px',
                        background: '#6366f1',
                        transition: 'transform 0.25s ease',
                        transformOrigin: 'center'
                      },
                      '&:hover::after': {
                        transform: 'translateX(-50%) scaleX(1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            {/* ── Right actions ── */}
            {!isMobile && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  onClick={() => navigate('/authenticate')}
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    textTransform: 'none',
                    color: '#ffffff',
                    px: 2,
                    py: 0.8,
                    borderRadius: '10px',
                    '&:hover': {
                      color: '#fff',
                      background: 'rgba(255,255,255,0.06)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/authenticate')}
                  variant="contained"
                  disableElevation
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    px: 2.8,
                    py: 0.9,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    textTransform: 'none',
                    boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 20px rgba(99,102,241,0.45)'
                    },
                    transition: 'all 0.25s ease'
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            )}

            {/* ── Mobile hamburger ── */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(!mobileOpen)}
                sx={{
                  color: '#fff',
                  p: 1,
                  borderRadius: '10px',
                  '&:hover': { background: 'rgba(255,255,255,0.08)' }
                }}
              >
                {mobileOpen ? <Close /> : <Menu />}
              </IconButton>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* ── Mobile menu ── */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: scrolled ? 80 : 72,
            left: '50%',
            transform: mobileOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
            width: '92%',
            maxWidth: 400,
            background: 'rgba(15, 12, 41, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            zIndex: 1999,
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
            p: 2
          }}
        >
          <Stack spacing={0.5}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                fullWidth
                onClick={() => { scrollTo(item.id); setMobileOpen(false); }}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: '#ffffff',
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.2,
                  borderRadius: '12px',
                  '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' }
                }}
              >
                {item.label}
              </Button>
            ))}
            <Box sx={{ height: '1px', background: 'rgba(255,255,255,0.08)', my: 1 }} />
            <Button
              fullWidth
              onClick={() => { navigate('/authenticate'); setMobileOpen(false); }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#ffffff',
                justifyContent: 'flex-start',
                px: 2,
                py: 1.2,
                borderRadius: '12px',
                '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' }
              }}
            >
              Log in
            </Button>
            <Button
              fullWidth
              onClick={() => { navigate('/authenticate'); setMobileOpen(false); }}
              variant="contained"
              disableElevation
              sx={{
                fontWeight: 700,
                fontSize: '0.95rem',
                py: 1.3,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                '&:hover': { background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Navbar;
