import { useState, useEffect } from 'react';
import { Stack, Button, Box, Typography, Container, useMediaQuery, IconButton } from '@mui/material';
import { Bolt, Menu, Close, Rocket, Layers, Star, Mail, ArrowForward, Home } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPolicyPage = location.pathname === '/privacy-policy' || location.pathname === '/terms';
  const [scrolled, setScrolled] = useState(isPolicyPage);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        setScrollProgress((currentScroll / totalScroll) * 100);
        if (!isPolicyPage) {
          setScrolled(currentScroll > 40);
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPolicyPage]);

  const navItems = [
    { label: 'Features', id: 'features', icon: <Rocket fontSize="small" /> },
    { label: 'Solutions', id: 'solutions', icon: <Layers fontSize="small" /> },
    { label: 'Pricing', id: 'pricing', icon: <Star fontSize="small" /> },
    { label: 'Contact', id: 'contact', icon: <Mail fontSize="small" /> }
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
      {isPolicyPage && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 62,
            backgroundColor: 'rgba(8, 6, 20, 0.96)',
            zIndex: 1999,
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      )}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          mx: 'auto',
          mt: scrolled ? { xs: '16px', sm: '24px' } : 0,
          width: scrolled ? { xs: '94%', sm: '88%', md: '68%' } : '100%',
          height: 62,
          backgroundColor: scrolled ? 'rgba(8, 6, 20, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          border: scrolled ? '1px solid rgba(6, 182, 212, 0.12)' : '1px solid transparent',
          borderRadius: scrolled ? '22px' : '0px',
          maxWidth: scrolled ? 1140 : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(6, 182, 212, 0.08), 0 0 80px rgba(139, 92, 246, 0.04)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {!isPolicyPage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${Math.min(scrollProgress, 100)}%`,
            height: '2px',
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #a855f7)',
            transition: 'width 0.1s linear'
          }}
        />
        )}

        <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bolt sx={{ color: '#fff', fontSize: '1.1rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>Abbsium</Typography>
            </Stack>

            {!isMobile && !isPolicyPage && (
              <Stack direction="row" spacing={1}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => scrollTo(item.id)}
                    sx={{ color: '#fff', textTransform: 'none', borderRadius: '8px', '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Stack>
            )}

            {!isMobile && isPolicyPage && (
              <Button
                onClick={() => navigate('/')}
                startIcon={<Home fontSize="small" />}
                sx={{ color: '#fff', textTransform: 'none', borderRadius: '8px', fontWeight: 500, '&:hover': { background: 'rgba(255,255,255,0.05)' } }}
              >
                Home
              </Button>
            )}

            {!isMobile && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/authenticate')}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(6, 182, 212, 0.5)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    px: 2,
                    '&:hover': {
                      borderColor: '#06b6d4',
                      background: 'rgba(6, 182, 212, 0.1)'
                    }
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/authenticate')}
                  sx={{ borderRadius: '12px', textTransform: 'none', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', fontWeight: 600, boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)' }}
                >
                  Get Started
                </Button>
              </Stack>
            )}

            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: '#fff' }}>
                {mobileOpen ? <Close /> : <Menu />}
              </IconButton>
            )}
          </Box>
        </Container>
      </Box>

      {/* Mobile menu */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 62,
            left: '4%',
            width: '92%',
            background: 'linear-gradient(180deg, rgba(8, 6, 20, 0.98) 0%, rgba(6, 4, 16, 0.98) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(6, 182, 212, 0.12)',
            transform: mobileOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            p: 1.5,
            zIndex: 1999,
            boxShadow: mobileOpen ? '0 20px 60px rgba(6, 182, 212, 0.15), 0 0 0 1px rgba(6, 182, 212, 0.08)' : 'none',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.6), transparent)',
              opacity: mobileOpen ? 1 : 0,
              transition: 'opacity 0.5s ease 0.2s'
            }}
          />

          <Stack spacing={0.5}>
            {!isPolicyPage &&
              navItems.map((item, index) => (
                <Button
                  key={item.label}
                  onClick={() => { scrollTo(item.id); setMobileOpen(false); }}
                  startIcon={item.icon}
                  endIcon={<ArrowForward sx={{ fontSize: '0.9rem', opacity: 0.4 }} />}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textTransform: 'none',
                    borderRadius: '12px',
                    justifyContent: 'space-between',
                    py: 1.2,
                    px: 1.5,
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                    opacity: mobileOpen ? 1 : 0,
                    transitionDelay: mobileOpen ? `${index * 0.06}s` : '0s',
                    '&:hover': {
                      background: 'rgba(6, 182, 212, 0.12)',
                      color: '#fff',
                      '& .MuiSvgIcon-root': { opacity: 1 }
                    },
                    '& .MuiButton-startIcon': { mr: 1.5, color: 'rgba(6, 182, 212, 0.8)' }
                  }}
                >
                  {item.label}
                </Button>
              ))}

            {isPolicyPage && (
              <Button
                onClick={() => { navigate('/'); setMobileOpen(false); }}
                startIcon={<Home />}
                endIcon={<ArrowForward sx={{ fontSize: '0.9rem', opacity: 0.4 }} />}
                sx={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  textTransform: 'none',
                  borderRadius: '12px',
                  justifyContent: 'space-between',
                  py: 1.2,
                  px: 1.5,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  '&:hover': { background: 'rgba(6, 182, 212, 0.12)', color: '#fff' },
                  '& .MuiButton-startIcon': { mr: 1.5, color: 'rgba(6, 182, 212, 0.8)' }
                }}
              >
                Home
              </Button>
            )}

            {/* Divider */}
            <Box sx={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', my: 0.5 }} />

            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { navigate('/authenticate'); setMobileOpen(false); }}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2,
                  fontSize: '0.95rem',
                  borderColor: 'rgba(6, 182, 212, 0.4)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'all 0.3s ease',
                  transitionDelay: mobileOpen ? '0.3s' : '0s',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    background: 'rgba(6, 182, 212, 0.1)'
                  }
                }}
              >
                Log In
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => { navigate('/authenticate'); setMobileOpen(false); }}
                endIcon={<ArrowForward sx={{ fontSize: '1rem' }} />}
                sx={{
                  borderRadius: '14px',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2,
                  fontSize: '0.95rem',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.35)',
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'all 0.3s ease',
                  transitionDelay: mobileOpen ? '0.25s' : '0s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2, #2563eb)',
                    boxShadow: '0 6px 28px rgba(6, 182, 212, 0.45)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Navbar;
