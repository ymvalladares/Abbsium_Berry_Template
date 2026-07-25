import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import ShieldRounded from '@mui/icons-material/ShieldRounded';
import { useMaintenance } from '../../../contexts/MaintenanceContext';
import { useNotification } from 'contexts/NotificationContext';

export default function MaintenanceSettings() {
  const theme = useTheme();
  const { isUnderMaintenance, toggleMaintenance, maintenanceStartedAt, loading } = useMaintenance();
  const notify = useNotification();
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    try {
      const wasMaintenance = isUnderMaintenance;
      await toggleMaintenance();
      if (!wasMaintenance) {
        notify.success('Maintenance mode activated', 'Maintenance Mode');
      } else {
        notify.success('Site is back online', 'System Online');
      }
    } catch {
      notify.error('Failed to update maintenance mode', 'Error');
    } finally {
      setToggling(false);
    }
  };

  const formatDuration = (startAt) => {
    if (!startAt) return null;
    const diff = Date.now() - new Date(startAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m ago`;
  };

  const statusColor = isUnderMaintenance ? theme.palette.error.main : theme.palette.success.main;
  const statusBg = isUnderMaintenance
    ? theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)'
    : theme.palette.mode === 'dark' ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.08)';

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 680 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
          Site Maintenance
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Control site availability for all non-admin users
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ height: 4, bgcolor: statusColor, transition: 'bgcolor 0.3s' }} />

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: statusBg
                }}
              >
                {isUnderMaintenance
                  ? <ConstructionRounded sx={{ color: statusColor, fontSize: 24 }} />
                  : <CheckCircleRounded sx={{ color: statusColor, fontSize: 24 }} />
                }
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                    {isUnderMaintenance ? 'Maintenance Active' : 'All Systems Online'}
                  </Typography>
                  <Chip
                    label={isUnderMaintenance ? 'RESTRICTED' : 'PUBLIC'}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      bgcolor: statusBg,
                      color: statusColor
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                  {isUnderMaintenance
                    ? 'Non-admin users see a maintenance page'
                    : 'All users can access the site normally'}
                </Typography>
              </Box>
            </Box>

            <Switch
              checked={isUnderMaintenance}
              onChange={handleToggle}
              disabled={toggling || loading}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: theme.palette.error.main,
                  '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)' }
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: theme.palette.error.main
                }
              }}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ShieldRounded sx={{ fontSize: 18, color: 'primary.main' }} />
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Admin Access
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Always Available
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: isUnderMaintenance ? 'error.main' : 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'background.paper' }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Visitors
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {isUnderMaintenance ? 'Blocked' : 'Allowed'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
              <AccessTimeRounded sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Box>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isUnderMaintenance ? 'Since' : 'Last Updated'}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  {maintenanceStartedAt
                    ? formatDuration(maintenanceStartedAt)
                    : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
