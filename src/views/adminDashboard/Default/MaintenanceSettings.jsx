import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ConstructionRounded from '@mui/icons-material/ConstructionRounded';
import WarningRounded from '@mui/icons-material/WarningRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import { useMaintenance } from '../../../contexts/MaintenanceContext';
import { useNotification } from 'contexts/NotificationContext';

const MaintenanceCard = styled(Box)(({ theme }) => ({
  padding: '24px',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.mode === 'dark'
    ? 'rgba(30,41,59,0.5)'
    : 'rgba(255,255,255,0.8)',
  backdropFilter: 'blur(12px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main + '40',
    boxShadow: `0 4px 24px ${theme.palette.primary.main}10`
  }
}));

const StatusIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  background: active
    ? '#ef4444'
    : theme.palette.mode === 'dark'
      ? '#4b5563'
      : '#d1d5db',
  boxShadow: active ? '0 0 12px #ef4444' : 'none',
  animation: active ? 'pulse 2s infinite' : 'none',
  '@keyframes pulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
    '70%': { boxShadow: '0 0 0 10px rgba(239,68,68,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' }
  }
}));

const GlassSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    '&.Mui-checked': {
      transform: 'translateX(28px)',
      '& .MuiSwitch-thumb:before': {
        content: '""',
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        opacity: 0.3
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
        border: 'none'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    width: 32,
    height: 32,
    '&:before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #475569, #334155)'
        : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    background: theme.palette.mode === 'dark' ? '#334155' : '#cbd5e1',
    borderRadius: 20,
    border: '1px solid ' + (theme.palette.mode === 'dark' ? '#475569' : '#94a3b8')
  }
}));

export default function MaintenanceSettings() {
  const theme = useTheme();
  const { isUnderMaintenance, setMaintenance } = useMaintenance();
  const notify = useNotification();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setMaintenance(!isUnderMaintenance);
    setLoading(false);
    if (!isUnderMaintenance) {
      notify.warning('Maintenance mode activated - site is now restricted', 'Maintenance Enabled');
    } else {
      notify.success('Site is back online and accessible to all users', 'Maintenance Disabled');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Site Maintenance
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Control the maintenance mode for the entire application
        </Typography>
      </Box>

      <MaintenanceCard sx={{ maxWidth: 600 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isUnderMaintenance
                ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.15))'
                : theme.palette.mode === 'dark'
                  ? 'rgba(99,102,241,0.15)'
                  : 'rgba(99,102,241,0.1)',
              border: `1px solid ${isUnderMaintenance ? 'rgba(239,68,68,0.3)' : theme.palette.primary.main + '30'}`,
              flexShrink: 0
            }}
          >
            <ConstructionRounded sx={{
              fontSize: 28,
              color: isUnderMaintenance ? '#ef4444' : theme.palette.primary.main,
              filter: isUnderMaintenance ? 'drop-shadow(0 0 8px rgba(239,68,68,0.5))' : 'none'
            }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Maintenance Mode
              </Typography>
              <StatusIndicator active={isUnderMaintenance} />
            </Box>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {isUnderMaintenance
                ? 'The site is currently showing a maintenance page to all visitors.'
                : 'The site is running normally and accessible to all users.'}
            </Typography>

            <Tooltip
              title={loading ? 'Applying changes...' : 'Toggle maintenance mode'}
              arrow
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                <GlassSwitch
                  checked={isUnderMaintenance}
                  onChange={handleToggle}
                  disabled={loading}
                  inputProps={{ 'aria-label': 'Maintenance mode toggle' }}
                />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {isUnderMaintenance && (
          <Alert
            severity="warning"
            icon={<WarningRounded fontSize="inherit" />}
            sx={{
              mt: 3,
              borderRadius: '12px',
              border: '1px solid rgba(245,158,11,0.3)',
              background: 'rgba(245,158,11,0.08)',
              '& .MuiAlert-icon': { color: '#f59e0b' }
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Active Maintenance</AlertTitle>
            All routes except this page will display the maintenance error. Only admins can access the dashboard during maintenance.
          </Alert>
        )}

        {!isUnderMaintenance && (
          <Alert
            severity="info"
            icon={<InfoRounded fontSize="inherit" />}
            sx={{
              mt: 3,
              borderRadius: '12px',
              border: '1px solid rgba(14,165,233,0.3)',
              background: 'rgba(14,165,233,0.08)',
              '& .MuiAlert-icon': { color: '#0ea5e9' }
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Normal Operation</AlertTitle>
            All users can access the site normally. Toggle maintenance when you need to perform updates.
          </Alert>
        )}
      </MaintenanceCard>
    </Box>
  );
}
