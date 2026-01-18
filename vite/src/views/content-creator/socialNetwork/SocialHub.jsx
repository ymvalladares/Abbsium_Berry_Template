import { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Stack, CircularProgress } from '@mui/material';
import SocialCard from './socialCard';
import { socialAPI } from '../../../services/AxiosService';

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
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#EEF2F6', py: { xs: 6, md: 8 } }}>
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
          <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={3}>
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
                Social Connections
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {connectedCount}/{PLATFORMS.length} platforms connected
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Cards Grid */}
        <Grid container spacing={3}>
          {PLATFORMS.map((platform) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={platform}>
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
