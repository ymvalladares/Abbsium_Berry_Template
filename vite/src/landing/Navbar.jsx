import { useState, useEffect } from 'react';
import { AppBar, Stack, Button, Box, Typography, Container, useMediaQuery, IconButton } from '@mui/material';
import { Bolt, Menu, Close, Rocket, Layers, Star, Mail, ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      // Usamos requestAnimationFrame para que el cálculo sea fluido y no bloquee el hilo principal
      window.requestAnimationFrame(() => {
        const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        setScrollProgress((currentScroll / totalScroll) * 100);
        setScrolled(currentScroll > 40);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <AppBar
        elevation={0}
        sx={{
          position: 'fixed',
          // Mantenemos el top fijo para evitar saltos de layout
          top: 0,
          left: 0,
          right: 0,
          mx: 'auto',
          mt: scrolled ? '24px' : '0px',
          width: scrolled ? { xs: '94%', sm: '88%', md: '68%' } : '100%',
          maxWidth: 1140,
          // Altura fija para evitar el repintado constante
          height: 62,
          background: scrolled ? 'rgba(15, 12, 41, 0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          border: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
          borderRadius: scrolled ? '22px' : '0px',
          boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.4)' : 'none',
          // Optimizamos la transición solo a propiedades que no fuerzan layout
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Scroll progress bar - optimizada */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${Math.min(scrollProgress, 100)}%`,
            height: '2px',
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            transition: 'width 0.1s linear' // Más suave
          }}
        />

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
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bolt sx={{ color: '#fff', fontSize: '1.1rem' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>Abbsium</Typography>
            </Stack>

            {!isMobile && (
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

            {!isMobile && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Button
                  variant="outlined"
                  onClick={() => navigate('/authenticate')}
                  sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(99, 102, 241, 0.5)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    px: 2,
                    '&:hover': {
                      borderColor: '#6366f1',
                      background: 'rgba(99, 102, 241, 0.1)'
                    }
                  }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/authenticate')}
                  sx={{ borderRadius: '12px', textTransform: 'none', background: '#6366f1', fontWeight: 600 }}
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
      </AppBar>

      {/* Mobile menu */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 86,
            left: '4%',
            width: '92%',
            background: 'linear-gradient(180deg, rgba(15, 12, 41, 0.98) 0%, rgba(10, 8, 30, 0.98) 100%)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            transform: mobileOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            p: 1.5,
            zIndex: 1999,
            boxShadow: mobileOpen ? '0 20px 60px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1)' : 'none',
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
              background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), transparent)',
              opacity: mobileOpen ? 1 : 0,
              transition: 'opacity 0.5s ease 0.2s'
            }}
          />

          <Stack spacing={0.5}>
            {navItems.map((item, index) => (
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
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: '#fff',
                    '& .MuiSvgIcon-root': { opacity: 1 }
                  },
                  '& .MuiButton-startIcon': { mr: 1.5, color: 'rgba(99, 102, 241, 0.8)' }
                }}
              >
                {item.label}
              </Button>
            ))}

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
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'all 0.3s ease',
                  transitionDelay: mobileOpen ? '0.3s' : '0s',
                  '&:hover': {
                    borderColor: '#6366f1',
                    background: 'rgba(99, 102, 241, 0.1)'
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
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
                  transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  opacity: mobileOpen ? 1 : 0,
                  transition: 'all 0.3s ease',
                  transitionDelay: mobileOpen ? '0.25s' : '0s',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5558e6, #7c4feb)',
                    boxShadow: '0 6px 28px rgba(99, 102, 241, 0.45)',
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
