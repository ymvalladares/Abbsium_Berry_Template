import { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { IconBrandYoutube, IconBrandFacebook, IconBrandInstagram, IconBrandTiktok } from '@tabler/icons-react';

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube', icon: IconBrandYoutube, color: '#E22F2F' },
  { id: 'facebook', label: 'Facebook', icon: IconBrandFacebook, color: '#1E52DC' },
  { id: 'instagram', label: 'Instagram', icon: IconBrandInstagram, color: '#B35DDE' },
  { id: 'tiktok', label: 'TikTok', icon: IconBrandTiktok, color: '#161A25' }
];

export default function PlatformSelector({ value, onChange }) {
  const [configOpen, setConfigOpen] = useState(false);
  const [activePlatform, setActivePlatform] = useState(null);

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((p) => p !== id) : [...value, id]);
  };

  const openConfig = (platform) => {
    setActivePlatform(platform);
    setConfigOpen(true);
  };

  return (
    <>
      <Typography fontWeight={600} mb={1}>
        1. Select platforms
      </Typography>

      <Grid container spacing={3} mb={4} justifyContent="center">
        {PLATFORMS.map((platform) => {
          const active = value.includes(platform.id);
          const Icon = platform.icon;

          const solidColor = platform.color;
          const fadedColor = alpha(platform.color, 0.35);
          const uiColor = active ? solidColor : fadedColor;

          return (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={platform.id}>
              <Paper
                onClick={() => toggle(platform.id)}
                sx={{
                  p: 3,
                  minHeight: 110,
                  borderRadius: 4,
                  cursor: 'pointer',
                  border: '3px solid',
                  borderColor: uiColor,
                  bgcolor: '#FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: '0.25s ease',
                  '&:hover': {
                    transform: 'scale(1.06)'
                  }
                }}
              >
                {/* CHECK */}
                {active && (
                  <CheckCircleIcon
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      color: '#007C01',
                      fontSize: 20,
                      fontWeight: 'bold'
                    }}
                  />
                )}

                {/* CONFIG BUTTON */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfig(platform);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    opacity: 0.6,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

                {/* ICON BOX */}
                <Box
                  mb={1}
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: uiColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.25s ease'
                  }}
                >
                  <Icon size={22} stroke={2} color="#FFFFFF" />
                </Box>

                <Typography
                  fontWeight={600}
                  sx={{
                    color: uiColor,
                    transition: '0.25s ease'
                  }}
                >
                  {platform.label}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* CONFIG MODAL */}
      <Dialog open={configOpen} onClose={() => setConfigOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Connect {activePlatform?.label}</DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Connect your account to allow posting.
          </Typography>

          <TextField fullWidth label="Email / Username" sx={{ mb: 2 }} />
          <TextField fullWidth label="Password" type="password" sx={{ mb: 2 }} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cancel</Button>
          <Button variant="contained">Connect</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
