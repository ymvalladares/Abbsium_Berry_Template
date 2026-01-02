import { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import SocialCard from './socialCard';

const PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Twitter'];

export default function SocialHub() {
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setConnections({
        Facebook: true,
        Instagram: false,
        YouTube: false
      });
      setLoading(false);
    }, 400);
  }, []);

  const connect = (p) => setConnections((prev) => ({ ...prev, [p]: true }));

  const disconnect = (p) => setConnections((prev) => ({ ...prev, [p]: false }));

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 5 }}>
      <Typography fontSize={32} fontWeight={800} textAlign="center">
        Social Media Connections
      </Typography>

      <Typography textAlign="center" color="text.secondary" sx={{ mt: 1, mb: 5, maxWidth: 640, mx: 'auto' }}>
        Connect and manage your social platforms from a single dashboard.
      </Typography>

      {/* Grid layout with full-width items */}
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {PLATFORMS.map((platform) => (
          <Grid item key={platform} xs={12}>
            <SocialCard
              platform={platform}
              connected={!!connections[platform]}
              onConnect={() => connect(platform)}
              onDisconnect={() => disconnect(platform)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
