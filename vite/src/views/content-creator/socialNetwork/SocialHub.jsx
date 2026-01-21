import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Stack, CircularProgress } from '@mui/material';
import SocialCard from './socialCard';
import { socialAPI } from '../../../services/AxiosService';
import Loader from '../../../ui-component/Loader';

const PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok'];

export default function SocialHub() {
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(true);

  // 1️⃣ Extraemos la lógica a una función reutilizable
  const fetchStatus = async () => {
    try {
      const res = await socialAPI.checkConnections();
      const map = {};
      PLATFORMS.forEach((p) => {
        map[p] = { connected: false, expiresAt: null };
      });

      res.data.forEach((item) => {
        const key = item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
        if (map.hasOwnProperty(key)) {
          map[key] = { connected: item.connected, expiresAt: item.expiresAt };
        }
      });
      setConnections(map);
    } catch (err) {
      console.error('Error fetching social connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // ----------- CONNECT ----------- //
  const connect = (platform) => {
    switch (platform) {
      case 'Facebook':
        socialAPI.connectFacebook(fetchStatus);
        break;
      case 'Instagram':
        socialAPI.connectInstagram();
        break;
      case 'YouTube':
        socialAPI.connectYouTube();
        break;
      case 'TikTok':
        socialAPI.connectTikTok();
        break;
      default:
        console.warn('Platform not supported:', platform);
    }
  };

  // ----------- DISCONNECT ----------- //
  const disconnect = async (platform) => {
    try {
      await socialAPI.disconnect(platform);
      setConnections((prev) => ({
        ...prev,
        [platform]: { connected: false, expiresAt: null }
      }));
    } catch (err) {
      console.error(`Error disconnecting ${platform}:`, err);
    }
  };

  const connectedCount = Object.values(connections).filter((x) => x?.connected).length;

  if (loading) {
    return <Loader />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EEF2F6', py: { xs: 6, md: 8 } }}>
      <Container>
        {/* Header */}
        <Box
          sx={{
            minWidth: '90%',
            mb: 4,
            p: { xs: 2, md: 2.5 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden',
            mt: { xs: -4, md: -6 },
            boxShadow: '0 10px 24px rgba(0,0,0,0.18)',

            // burbuja izquierda (alineada)
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: -60,
              transform: 'translateY(-50%)',
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)'
            },

            // burbuja derecha (alineada)
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              right: -70,
              transform: 'translateY(-50%)',
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)'
            }
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
            <Box>
              <Typography
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '1.05rem', sm: '1.2rem', md: '1.3rem' },
                  lineHeight: 1.2
                }}
              >
                Social Connections
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  mt: 0.5
                }}
              >
                {connectedCount}/{PLATFORMS.length} platforms connected
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Cards Grid */}
        <Grid container spacing={3}>
          {PLATFORMS.map((platform) => (
            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 4 }} key={platform}>
              <SocialCard
                platform={platform}
                connected={connections[platform]?.connected}
                expiresAt={connections[platform]?.expiresAt}
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
