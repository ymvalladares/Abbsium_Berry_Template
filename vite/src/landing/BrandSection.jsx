import React from 'react';
import { Box, Container, Typography, Grid, Stack, Avatar, AvatarGroup, Tooltip, Paper, Divider } from '@mui/material';
import { MousePointer2, Sparkles, Zap, CheckCircle2, Clock, Layers3, FileText, UserPlus, Flame } from 'lucide-react';

// --- Micro-Módulo Componente (Para rellenar complejidad) ---
const StatMiniCard = ({ icon: Icon, title, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '16px',
      bgcolor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(15, 23, 42, 0.08)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
      display: 'flex',
      alignItems: 'center',
      gap: 2
    }}
  >
    <Box sx={{ color: color, display: 'flex' }}>
      <Icon size={20} strokeWidth={2.5} />
    </Box>
    <Box>
      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>{value}</Typography>
    </Box>
  </Paper>
);

const BrandSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 8 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Luces de profundidad de fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          zIndex: 0
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '30%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)',
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={10} alignItems="center">
          {/* COLUMNA IZQUIERDA: Mantenemos el estilo minimalista y potente */}
          <Grid size={{ xs: 12, md: 5.5 }}>
            <Stack spacing={4}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.8rem', md: '3.8rem' },
                    lineHeight: 1.05,
                    mb: 3,
                    letterSpacing: '-2.5px',
                    color: '#0f172a'
                  }}
                >
                  Built for creators <br />
                  <Box component="span" sx={{ color: '#6366f1' }}>
                    who think bigger.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: '#64748b',
                    fontSize: '1.2rem',
                    lineHeight: 1.8,
                    mb: 5,
                    maxWidth: 540
                  }}
                >
                  Abbsium is being designed as a modern content ecosystem focused on speed, simplicity, and unlimited creative freedom.
                </Typography>
              </Box>

              <Stack spacing={3.5}>
                {[
                  { icon: <Zap size={20} />, title: 'No Noise. Just Tools.', desc: 'Focus on creating, we handle the infrastructure.' },
                  {
                    icon: <Sparkles size={20} />,
                    title: 'Real-Time Collaboration',
                    desc: 'Built-in tools for teams that need to move fast.'
                  }
                ].map((item, i) => (
                  <Stack key={i} direction="row" spacing={2.5} alignItems="flex-start">
                    <Box
                      sx={{
                        p: 1.2,
                        borderRadius: '12px',
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        display: 'flex'
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', mb: 0.5 }}>{item.title}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* COLUMNA DERECHA: EXPLOSIÓN DE COMPLEJIDAD VISUAL */}
          <Grid size={{ xs: 12, md: 6.5 }}>
            <Box sx={{ position: 'relative', height: '100%', minHeight: { xs: 400, md: 550 } }}>
              {/* 1. MÓDULO CENTRAL: DASHBOARD MOCKUP */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', md: '100%' },
                  height: { xs: 320, md: 450 },
                  borderRadius: '32px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  border: '1px solid rgba(15, 23, 42, 0.05)',
                  boxShadow: '0 50px 100px -20px rgba(15, 23, 42, 0.15)',
                  zIndex: 1,
                  p: 4,
                  overflow: 'hidden'
                }}
              >
                {/* Contenido simulado de Dashboard */}
                <Stack spacing={2.5}>
                  <Box sx={{ width: '30%', height: 10, bgcolor: 'rgba(15, 23, 42, 0.08)', borderRadius: 2 }} />
                  <Box sx={{ width: '90%', height: 14, bgcolor: '#6366f1', borderRadius: 2 }} />
                  <Grid container spacing={2.5} sx={{ mt: 2 }}>
                    {[1, 2, 3].map((i) => (
                      <Grid item xs={4} key={i}>
                        <Box
                          sx={{
                            height: 100,
                            borderRadius: '16px',
                            bgcolor: '#fff',
                            border: '1px solid rgba(0,0,0,0.03)',
                            p: 2,
                            display: 'flex',
                            alignItems: 'flex-end'
                          }}
                        >
                          <Box sx={{ width: '60%', height: 8, bgcolor: 'rgba(15, 23, 42, 0.05)', borderRadius: 2 }} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box sx={{ width: '70%', height: 10, bgcolor: 'rgba(15, 23, 42, 0.08)', borderRadius: 2 }} />
                </Stack>
              </Box>

              {/* 2. ELEMENTOS FLOTANTES DE DATOS Y COLABORACIÓN */}

              {/* Live Activity Feed (NUEVO) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  left: 100,
                  zIndex: 3,
                  animation: 'float 5s infinite ease-in-out'
                }}
              >
                <StatMiniCard icon={Clock} title="Live Feed" value="Updated" color="#6366f1" />
              </Box>

              {/* Performance Ticker (NUEVO) */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 100,
                  left: -60,
                  zIndex: 4,
                  bgcolor: '#22c55e',
                  color: '#fff',
                  p: '6px 14px',
                  borderRadius: '99px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  boxShadow: '0 10px 20px rgba(34,197,94,0.3)',
                  animation: 'pulse 2s infinite'
                }}
              >
                <Zap size={16} />
                <Typography sx={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px' }}>1.2s LOAD SPEED</Typography>
              </Box>

              {/* Content Structure Tree (NUEVO - RELLENO DE CONTENIDO) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '15%',
                  right: -80,
                  zIndex: 2,
                  p: 2.5,
                  borderRadius: '20px',
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  minWidth: 160
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Layers3 size={18} color="#94a3b8" />
                    <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                      Structure
                    </Typography>
                  </Stack>
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {[
                    { label: 'Blog Posts', icon: FileText, color: '#6366f1' },
                    { label: 'Products', icon: Layers3, color: '#3b82f6' },
                    { label: 'Users', icon: UserPlus, color: '#ec4899' }
                  ].map((node, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1} sx={{ pl: i * 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: node.color }} />
                      <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>{node.label}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              {/* Collaboration avatars (NUEVO - RELLENO) */}
              <Tooltip title="Team Presence" placement="top" arrow>
                <AvatarGroup
                  max={4}
                  sx={{
                    position: 'absolute',
                    top: '25%',
                    left: -30,
                    zIndex: 4,
                    bgcolor: '#fff',
                    p: '3px',
                    borderRadius: '99px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #f1f5f9',
                    cursor: 'help'
                  }}
                >
                  <Avatar sx={{ width: 30, height: 30, bgcolor: '#6366f1', fontSize: '11px' }}>JD</Avatar>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: '#ec4899', fontSize: '11px' }}>AM</Avatar>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: '#22c55e', fontSize: '11px' }}>SV</Avatar>
                  <Avatar sx={{ width: 30, height: 30, bgcolor: '#f59e0b', fontSize: '11px' }}>+5</Avatar>
                </AvatarGroup>
              </Tooltip>

              {/* Cursor de edición */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '35%',
                  right: 100,
                  zIndex: 4,
                  color: '#ec4899',
                  display: { xs: 'none', md: 'block' },
                  animation: 'float 6s infinite ease-in-out'
                }}
              >
                <MousePointer2 size={30} fill="currentColor" stroke="#fff" strokeWidth={1} />
                <Box
                  sx={{
                    bgcolor: '#ec4899',
                    color: '#fff',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    ml: 2,
                    mt: -1
                  }}
                >
                  Sara editing...
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 152, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(34, 197, 152, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 152, 0); }
        }
      `}</style>
    </Box>
  );
};

export default BrandSection;
