// SocialHub.jsx
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Stack, Chip, alpha } from '@mui/material';
import { IconSparkles, IconChartBar, IconUsers, IconBolt } from '@tabler/icons-react';
import SocialCard from './socialCard';

const PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Twitter'];

export default function SocialHub() {
  const [connections, setConnections] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setConnections({
        Facebook: false,
        Instagram: false,
        YouTube: true,
        TikTok: true,
        Twitter: false
      });
    }, 600);
  }, []);

  const connect = (platform) => {
    setConnections((prev) => ({ ...prev, [platform]: true }));
  };

  const disconnect = (platform) => {
    setConnections((prev) => ({ ...prev, [platform]: false }));
  };

  const connectedCount = Object.values(connections).filter(Boolean).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#EEF2F6',
        py: { xs: 6, md: 8 }
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            mt: { xs: -4, md: -6 }
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(40px)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -40,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(40px)'
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap={3}
            sx={{ position: 'relative', zIndex: 1 }}
          >
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                <IconSparkles size={24} style={{ color: 'white' }} />
                <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                  Social Connections
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: 'white'
                  }}
                >
                  {connectedCount}/{PLATFORMS.length}
                </Box>
                platforms connected and ready
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {[
                { icon: IconBolt, label: 'Real-time Sync' },
                { icon: IconChartBar, label: 'Analytics' },
                { icon: IconUsers, label: 'Audience Insights' }
              ].map((item, index) => (
                <Chip
                  key={index}
                  icon={<item.icon size={14} />}
                  label={item.label}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 28,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)'
                    }
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Box>

        {/* Cards Grid */}
        <Grid container spacing={3}>
          {PLATFORMS.map((platform) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={platform}>
              <SocialCard
                platform={platform}
                connected={!!connections[platform]}
                onConnect={() => connect(platform)}
                onDisconnect={() => disconnect(platform)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
