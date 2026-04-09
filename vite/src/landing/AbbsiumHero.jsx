import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Typography, Stack, Chip, LinearProgress, Grid, Paper } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';
import BoltIcon from '@mui/icons-material/Bolt';
import { useNavigate } from 'react-router-dom';

const KEYFRAMES = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

const VisualDashboard = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress((prev) => (prev >= 100 ? 0 : prev + 1)), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { md: 15 }
      }}
    >
      {/* 1. TERMINAL PRINCIPAL - MAXIMIZADA */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '560px', // Aumentado para mayor impacto visual
          height: '360px', // Más alta para que se vea robusta
          bgcolor: '#0f172a',
          borderRadius: '28px',
          p: 4,
          boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          zIndex: 2,
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          animation: 'float 6s ease-in-out infinite',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Stack direction="row" spacing={1.5} mb={3}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FF5F56' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27C93F' }} />
        </Stack>

        <Typography sx={{ color: '#6366f1', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', fontWeight: 700, mb: 1.5 }}>
          root@abbsium:~${' '}
          <Box component="span" sx={{ color: '#fff' }}>
            deploy --prod --verbose
          </Box>
        </Typography>

        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: 'JetBrains Mono', lineHeight: 2 }}>
          <Box component="span" sx={{ color: '#22c55e' }}>
            [OK]
          </Box>{' '}
          Analyzing cluster integrity...
          <br />
          <Box component="span" sx={{ color: '#22c55e' }}>
            [OK]
          </Box>{' '}
          SSL Certificates validated.
          <br />
          <Box component="span" sx={{ color: '#6366f1' }}>
            [WAIT]
          </Box>{' '}
          Syncing 24 global edge nodes...
        </Typography>

        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Stack direction="row" justifyContent="space-between" mb={1.5}>
            <Typography sx={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1.5 }}>
              INFRASTRUCTURE_REPLICATION
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>{progress}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 4 }
            }}
          />
        </Box>
      </Box>

      {/* 2. WIDGET SUPERIOR - POSICIÓN EXTERNA PARA ANCHURA */}
      <Paper
        sx={{
          position: 'absolute',
          top: '12%',
          right: { xs: '0%', md: '-2%' },
          width: 190,
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '22px',
          p: 2.5,
          boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
          border: '1px solid #fff',
          zIndex: 3,
          animation: 'float 7s ease-in-out infinite reverse'
        }}
      >
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', animation: 'pulse 2s infinite' }} />
            <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Live Traffic</Typography>
          </Stack>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            2.4k{' '}
            <Box component="span" sx={{ fontSize: '0.7rem', color: '#22c55e' }}>
              req/s
            </Box>
          </Typography>
        </Stack>
      </Paper>

      {/* 3. WIDGET INFERIOR - POSICIÓN EXTERNA */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '12%',
          left: { xs: '0%', md: '-2%' },
          bgcolor: '#fff',
          borderRadius: '20px',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 30px 60px rgba(99, 102, 241, 0.15)',
          border: '1px solid rgba(255,255,255,1)',
          zIndex: 4
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: '14px',
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BoltIcon sx={{ color: '#6366f1', fontSize: '1.6rem' }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>Verified Layer</Typography>
          <Typography sx={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 700 }}>AES-256 Active</Typography>
        </Box>
      </Box>

      {/* Efecto de resplandor de fondo */}
      <Box
        sx={{
          position: 'absolute',
          width: '130%',
          height: '130%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export default function AdvancedHero() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          bgcolor: 'transparent',
          py: { xs: 8, md: 0 },
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* LADO IZQUIERDO: TEXTO COMPACTO Y ALINEADO */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ pr: { md: 6 }, textAlign: { xs: 'center', md: 'left' } }}>
                <Chip
                  label="v2.0 Infrastructure"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                    mb: 3,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    color: '#6366f1',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    px: 1
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: 'Syne',
                    fontWeight: 800,
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    color: '#0f172a',
                    mb: 3,
                    lineHeight: 1,
                    letterSpacing: '-0.04em'
                  }}
                >
                  Engineer Your <br />
                  <Box component="span" sx={{ color: 'transparent', WebkitTextStroke: '1.5px #6366f1' }}>
                    Digital
                  </Box>{' '}
                  Vision.
                </Typography>

                <Typography
                  sx={{
                    fontSize: '1.15rem',
                    color: '#475569',
                    lineHeight: 1.7,
                    mb: 5,
                    maxWidth: '500px',
                    mx: { xs: 'auto', md: 0 },
                    fontWeight: 500
                  }}
                >
                  The standard for modern data architecture. Build, scale, and deploy global infrastructures with absolute precision and
                  security.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Button
                    onClick={() => navigate('/authenticate')}
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: '#0f172a',
                      px: 5,
                      py: 2,
                      borderRadius: '14px',
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                      '&:hover': { bgcolor: '#6366f1' }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    startIcon={<TerminalIcon />}
                    sx={{
                      color: '#0f172a',
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem'
                    }}
                  >
                    Documentation
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* LADO DERECHO: VISUALIZACIÓN ANCHA Y PODEROSA */}
            <Grid size={{ xs: 12, md: 6 }}>
              <VisualDashboard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
