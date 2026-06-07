import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Stack, IconButton } from '@mui/material';
import { Home, ArrowBack, Logout, RocketLaunch } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  size: i % 5 === 0 ? 3 : 2,
  top: ((i * 41 + 17) % 88) + '%',
  left: ((i * 67 + 11) % 100) + '%',
  opacity: 0.2 + ((i * 19) % 40) / 100,
  dur: 2.5 + ((i * 13) % 30) / 10,
  del: ((i * 7) % 25) / 10
}));

export default function NotFound() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGoHome = () => navigate('/');
  const handleGoBack = () => navigate(-1);
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleGoDashboard = () => navigate('/platform');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 35%, #6d28d9 60%, #4c1d95 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 4 + i * 2,
            height: 4 + i * 2,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            top: `${20 + i * 12}%`,
            left: `${10 + i * 15}%`,
            animation: `floatParticle ${4 + i}s ease-in-out infinite`,
            '@keyframes floatParticle': {
              '0%,100%': { transform: 'translateY(0px) translateX(0px)' },
              '50%': { transform: `translateY(-${20 + i * 5}px) translateX(${10 + i * 3}px)` }
            }
          }}
        />
      ))}

      {/* Glow effect following mouse */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.3s ease-out, top 0.3s ease-out',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
        {/* 404 Number */}
        <Typography
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 900,
            fontSize: { xs: '8rem', sm: '10rem', md: '12rem' },
            lineHeight: 1,
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 80px rgba(168,85,247,0.5)',
            mb: 2,
            animation: 'fadeUp 0.6s ease both',
            '@keyframes fadeUp': {
              from: { opacity: 0, transform: 'translateY(30px)' },
              to: { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          404
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
            color: 'white',
            mb: 1.5,
            animation: 'fadeUp 0.6s ease 0.1s both'
          }}
        >
          Oops! Page Not Found
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            color: 'rgba(255,255,255,0.7)',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
            maxWidth: 480,
            mx: 'auto',
            mb: 4,
            animation: 'fadeUp 0.6s ease 0.2s both'
          }}
        >
          The page you're looking for seems to have drifted into space. Don't worry, we'll help you get back on track.
        </Typography>

        {/* Rocket illustration */}
        <Box
          sx={{
            width: { xs: 120, sm: 150, md: 180 },
            height: { xs: 120, sm: 150, md: 180 },
            mx: 'auto',
            mb: 4,
            animation: 'rocketFloat 4s ease-in-out infinite',
            '@keyframes rocketFloat': {
              '0%,100%': { transform: 'translateY(0px) rotate(-5deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' }
            },
            filter: 'drop-shadow(0 20px 40px rgba(109,40,217,0.4))'
          }}
        >
          <RocketLaunch sx={{ fontSize: 'inherit', color: 'white', width: '100%', height: '100%' }} />
        </Box>

        {/* Action buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mb: 3, animation: 'fadeUp 0.6s ease 0.3s both' }}
        >
          <Button
            variant="contained"
            onClick={handleGoHome}
            startIcon={<Home />}
            sx={{
              background: 'linear-gradient(135deg, #f97316, #ef4444)',
              color: 'white',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 3.5,
              py: 1.3,
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
            Go Home
          </Button>

          <Button
            variant="contained"
            onClick={handleGoBack}
            startIcon={<ArrowBack />}
            sx={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: 'white',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 3.5,
              py: 1.3,
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
            Go Back
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
