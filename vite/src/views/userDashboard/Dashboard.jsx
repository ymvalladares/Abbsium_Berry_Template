import React from 'react';
import { Box, Container, Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { Add, Upload, CalendarMonth, BarChart, Description, Visibility, People, TrendingUp } from '@mui/icons-material';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import AddIcon from '@mui/icons-material/Add';

export default function Dashboard() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sx: '100%', md: '75%' }, mx: 'auto', mb: 3, mt: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1f2937', mb: 1.5 }}>
            Welcome, Yordan Jesus Martínez Valladares! 👋
          </Typography>
          <Typography variant="h5" sx={{ color: '#6b7280', fontWeight: 400 }}>
            Comienza a distribuir tu contenido en todas las plataformas.
          </Typography>
        </Box>

        {/* Row 1 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #ffffff 90%)',
                color: '#fff',
                height: 180,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 5,
                transition: '0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Add sx={{ fontSize: 56, mb: 2 }} />
                <Typography variant="h5" fontWeight={600}>
                  Crear publicación
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={cardMuted}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Upload sx={iconMuted} />
                <Typography variant="h5" sx={textMuted}>
                  Subir contenido
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={cardMuted}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarMonth sx={iconMuted} />
                <Typography variant="h5" sx={textMuted}>
                  Programar
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={cardMuted}>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChart sx={iconMuted} />
                <Typography variant="h5" sx={textMuted}>
                  Analytics
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Stats */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Publicaciones" value="0" icon={<Description />} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Vistas totales" value="0" icon={<Visibility />} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Seguidores" value="0" icon={<People />} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard title="Engagement" value="0%" icon={<TrendingUp />} />
          </Grid>
        </Grid>
        <Box
          sx={{
            width: '100%',
            borderRadius: 4,
            background: '#ffffff',
            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 8,
            mt: 6
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #7c3aed, #ffffff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 30px  rgba(124, 58, 237, 0.35)'
              }}
            >
              <VideoCameraBackIcon sx={{ color: '#fff', fontSize: 32 }} />
            </Box>

            {/* Title */}
            <Typography variant="h5" sx={{ color: '#111827', fontWeight: 600, mb: 1.5 }}>
              No tienes contenido aún
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                color: '#6b7280',
                fontSize: 15,
                lineHeight: 1.6,
                mb: 4
              }}
            >
              Comienza subiendo tu primer video o creando contenido con IA para distribuirlo en todas tus redes.
            </Typography>

            {/* Button */}
            <Button
              startIcon={<AddIcon />}
              sx={{
                px: 4,
                py: 1.4,
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                color: '#fff',
                background: 'linear-gradient(135deg, #7c3aed 0%, #ffffff 100%)',
                boxShadow: '0 8px 25px rgba(124, 58, 237, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #ffffff 100%)'
                }
              }}
            >
              Crear mi primer post
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/* Helpers */
const cardMuted = {
  bgcolor: '#fff',
  height: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: 5,
  transition: '0.2s',
  '&:hover': { transform: 'translateY(-4px)' }
};

const iconMuted = { fontSize: 56, mb: 2, color: '#d1d5db' };
const textMuted = { fontWeight: 600, color: '#d1d5db' };

function StatCard({ title, value, icon }) {
  return (
    <Card sx={{ height: 180, borderRadius: 5 }}>
      <CardContent sx={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography color="text.secondary">{title}</Typography>
          <Box sx={{ bgcolor: '#f3f4f6', p: 1.5, borderRadius: 2 }}>{React.cloneElement(icon, { sx: { color: '#7c3aed' } })}</Box>
        </Box>
        <Typography variant="h2" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
