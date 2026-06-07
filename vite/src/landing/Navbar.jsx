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
              <Button
                variant="contained"
                onClick={() => navigate('/authenticate')}
                sx={{ borderRadius: '12px', textTransform: 'none', background: '#6366f1' }}
              >
                Get Started
              </Button>
            )}

            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: '#fff' }}>
                {mobileOpen ? <Close /> : <Menu />}
              </IconButton>
            )}
          </Box>
        </Container>
      </AppBar>

      {/* Mobile menu - ahora con animación de escala para más fluidez */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 90,
            left: '4%',
            width: '92%',
            background: 'rgba(15, 12, 41, 0.95)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            transform: mobileOpen ? 'scale(1)' : 'scale(0.95)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
            p: 2,
            zIndex: 1999
          }}
        >
          {/* Tu contenido de menú móvil aquí */}
        </Box>
      )}
    </>
  );
};

export default Navbar;
