import { useState } from 'react';
import { Box, Grid, Typography, Button, Chip, IconButton, Popover, Paper, Divider, Stack } from '@mui/material';

import {
  IconDotsVertical,
  IconSettings,
  IconRefresh,
  IconTrash,
  IconLink,
  IconUnlink,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconActivity,
  IconChartBar,
  IconCalendar,
  IconBrandTiktok,
  IconBrandTwitter
} from '@tabler/icons-react';

const ICONS = {
  Facebook: IconBrandFacebook,
  Instagram: IconBrandInstagram,
  YouTube: IconBrandYoutube,
  TikTok: IconBrandTiktok,
  Twitter: IconBrandTwitter
};

export default function SocialCard({ platform, connected, onConnect, onDisconnect }) {
  const Icon = ICONS[platform];
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 320,
        height: 380,
        borderRadius: 3,
        border: '1.5px solid',
        borderColor: connected ? 'success.light' : 'divider',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all .25s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 28px rgba(0,0,0,.08)',
          transform: 'translateY(-4px)'
        }
      }}
    >
      {/* MENU */}
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconDotsVertical size={18} />
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Paper sx={{ p: 1.5, minWidth: 180 }}>
          <Stack spacing={1}>
            <Button size="small" startIcon={<IconSettings size={16} />}>
              Settings
            </Button>
            <Button size="small" startIcon={<IconRefresh size={16} />}>
              Refresh token
            </Button>
            <Divider />
            <Button size="small" color="error" startIcon={<IconTrash size={16} />}>
              Remove
            </Button>
          </Stack>
        </Paper>
      </Popover>

      {/* HEADER */}
      <Grid container alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Grid item>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              border: '1.5px solid',
              borderColor: connected ? 'success.main' : 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={26} />
          </Box>
        </Grid>

        <Grid item>
          <Typography fontWeight={700}>{platform}</Typography>
          <Chip size="small" label={connected ? 'Connected' : 'Disconnected'} color={connected ? 'success' : 'default'} />
        </Grid>
      </Grid>

      {/* FIXED CONTENT arranged as 4 rows: description, stat1, stat2, stat3 */}
      <Grid container direction="column" spacing={1} sx={{ flexGrow: 1, mb: 2 }}>
        <Grid item>
          <Typography variant="body2" color="text.secondary">
            {connected ? 'Platform ready for publishing and analytics.' : 'Connect to enable publishing and insights.'}
          </Typography>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconActivity size={16} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Status: {connected ? 'Active' : 'Idle'}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconCalendar size={16} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Scheduled: {connected ? '3 posts' : '—'}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconChartBar size={16} />
            </Grid>
            <Grid item>
              <Typography variant="caption">Analytics enabled</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* ACTION (NO CAMBIA TAMAÑO) */}
      <Button
        fullWidth
        variant={connected ? 'outlined' : 'contained'}
        color={connected ? 'error' : 'primary'}
        startIcon={connected ? <IconUnlink size={18} /> : <IconLink size={18} />}
        onClick={connected ? onDisconnect : onConnect}
        sx={{ borderRadius: 2 }}
      >
        {connected ? 'Disconnect' : 'Connect'}
      </Button>
    </Paper>
  );
}
