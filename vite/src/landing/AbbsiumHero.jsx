import { useEffect, useState } from 'react';
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
        height: { xs: '320px', sm: '400px', md: '500px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 0, sm: 2, md: 4 }
      }}
    >
      {/* 1. TERMINAL PRINCIPAL */}
      <Box
        sx={{
          width: { xs: '85%', sm: '80%', md: '90%' },
          maxWidth: '560px',
          height: { xs: '200px', sm: '260px', md: '340px' },
          bgcolor: '#0f172a',
          borderRadius: { xs: '16px', sm: '22px', md: '28px' },
          p: { xs: 2, sm: 3, md: 4 },
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 2,
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          animation: 'float 6s ease-in-out infinite',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Stack direction="row" spacing={1.5} mb={{ xs: 1.5, md: 3 }}>
          <Box sx={{ width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 }, borderRadius: '50%', bgcolor: '#FF5F56' }} />
          <Box sx={{ width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 }, borderRadius: '50%', bgcolor: '#FFBD2E' }} />
          <Box sx={{ width: { xs: 8, md: 10 }, height: { xs: 8, md: 10 }, borderRadius: '50%', bgcolor: '#27C93F' }} />
        </Stack>

        <Typography sx={{ color: '#6366f1', fontFamily: 'JetBrains Mono', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }, fontWeight: 700, mb: { xs: 1, md: 1.5 } }}>
          root@abbsium:~${' '}
          <Box component="span" sx={{ color: '#fff' }}>
            deploy --prod
          </Box>
        </Typography>

        <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' }, fontFamily: 'JetBrains Mono', lineHeight: { xs: 1.6, md: 2 } }}>
          <Box component="span" sx={{ color: '#22c55e' }}>
            [OK]
          </Box>{' '}
          Analyzing cluster...
          <br />
          <Box component="span" sx={{ color: '#22c55e' }}>
            [OK]
          </Box>{' '}
          SSL validated.
          <br />
          <Box component="span" sx={{ color: '#6366f1' }}>
            [WAIT]
          </Box>{' '}
          Syncing edge nodes...
        </Typography>

        <Box sx={{ mt: 'auto', pt: { xs: 2, md: 4 } }}>
          <Stack direction="row" justifyContent="space-between" mb={1}>
            <Typography sx={{ color: '#6366f1', fontSize: { xs: '0.6rem', md: '0.7rem' }, fontWeight: 800, letterSpacing: 1 }}>
              REPLICATION
            </Typography>
            <Typography sx={{ color: '#fff', fontSize: { xs: '0.6rem', md: '0.7rem' }, fontWeight: 700 }}>{progress}%</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: { xs: 6, md: 8 },
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 4 }
            }}
          />
        </Box>
      </Box>

      {/* 2. WIDGET SUPERIOR */}
      <Paper
        sx={{
          position: 'absolute',
          top: { xs: '2%', sm: '8%', md: '12%' },
          right: { xs: '2%', sm: '0%', md: '-2%' },
          width: { xs: '140px', sm: '160px', md: '190px' },
          bgcolor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: { xs: '14px', md: '22px' },
          p: { xs: 1.5, sm: 2, md: 2.5 },
          boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
          border: '1px solid #fff',
          zIndex: 3,
          animation: 'float 7s ease-in-out infinite reverse'
        }}
      >
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22c55e', animation: 'pulse 2s infinite' }} />
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.6rem', md: '0.7rem' }, color: '#64748b', textTransform: 'uppercase' }}>Live Traffic</Typography>
          </Stack>
          <Typography sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            2.4k{' '}
            <Box component="span" sx={{ fontSize: { xs: '0.6rem', md: '0.7rem' }, color: '#22c55e' }}>
              req/s
            </Box>
          </Typography>
        </Stack>
      </Paper>

      {/* 3. WIDGET INFERIOR */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '2%', sm: '8%', md: '12%' },
          left: { xs: '2%', sm: '0%', md: '-2%' },
          bgcolor: '#fff',
          borderRadius: { xs: '14px', md: '20px' },
          p: { xs: 1.5, sm: 2, md: 2.5 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1.5, md: 2 },
          boxShadow: '0 20px 50px rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(255,255,255,1)',
          zIndex: 4
        }}
      >
        <Box
          sx={{
            width: { xs: 36, md: 44 },
            height: { xs: 36, md: 44 },
            borderRadius: { xs: '10px', md: '14px' },
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <BoltIcon sx={{ color: '#6366f1', fontSize: { xs: '1.2rem', md: '1.6rem' } }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: { xs: '0.7rem', md: '0.8rem' }, fontWeight: 900, color: '#0f172a' }}>Verified Layer</Typography>
          <Typography sx={{ fontSize: { xs: '0.55rem', md: '0.65rem' }, color: '#22c55e', fontWeight: 700 }}>AES-256 Active</Typography>
        </Box>
      </Box>

      {/* Efecto de resplandor de fondo */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: '100%', md: '130%' },
          height: { xs: '100%', md: '130%' },
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)',
          zIndex: 0
        }}
      />
    </Box>
  );
};

export default function AdvancedHero() {
  const navigate = useNavigate();
  return (
    <>
      <style>{KEYFRAMES}</style>
      <Box
        sx={{
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          position: 'relative',
          bgcolor: 'transparent',
          pt: { xs: 12, sm: 14, md: 8 },
          pb: { xs: 8, sm: 10, md: 12 },
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
            {/* LADO IZQUIERDO: TEXTO */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'flex', md: 'block' }, justifyContent: 'center' }}>
              <Box sx={{ pr: { md: 4 }, textAlign: { xs: 'center', md: 'left' }, mx: { xs: 'auto', md: 0 }, maxWidth: { xs: '480px', md: '100%' } }}>
                <Chip
                  label="v2.0 Infrastructure"
                  sx={{
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                    mb: 2.5,
                    fontWeight: 800,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
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
                    fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                    color: '#0f172a',
                    mb: 2.5,
                    lineHeight: 1.05,
                    letterSpacing: '-0.04em'
                  }}
                >
                  Engineer Your <br />
                  <Box
                    component="span"
                    sx={{
                      color: '#6366f1',
                      fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem', lg: '4.5rem' }
                    }}
                  >
                    Digital
                  </Box>{' '}
                  Vision.
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' },
                    color: '#475569',
                    lineHeight: 1.7,
                    mb: 4,
                    maxWidth: { xs: '100%', md: '500px' },
                    mx: { xs: 'auto', md: 0 },
                    fontWeight: 500
                  }}
                >
                  The standard for modern data architecture. Build, scale, and deploy global infrastructures with absolute precision and
                  security.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center">
                  <Button
                    onClick={() => navigate('/authenticate')}
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: '#0f172a',
                      px: { xs: 4, sm: 5 },
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: '14px',
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      width: { xs: '100%', sm: 'auto' },
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
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }}
                  >
                    Documentation
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* LADO DERECHO: VISUALIZACIÓN (solo desktop) */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <VisualDashboard />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
