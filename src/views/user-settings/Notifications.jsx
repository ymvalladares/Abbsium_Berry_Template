import { useState } from 'react';
import { Box, Paper, Typography, Button, Switch, Divider, useMediaQuery, useTheme } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  Notifications,
  Email,
  PhoneAndroid,
  VolumeUp,
  Forum,
  AlternateEmail,
  Comment,
  Campaign,
  Star
} from '@mui/icons-material';

export default function NotificationsSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primaryColor = '#0EA5E9';
  const primaryHover = '#0284C7';
  const primaryLight = '#E0F2FE';

  const [notifState, setNotifState] = useState({
    emailMessages: true,
    emailMentions: true,
    emailComments: false,
    emailDigest: true,
    emailUpdates: false,
    pushBrowser: true,
    pushDesktop: false,
    pushSound: true,
  });

  const handleToggle = (key) => (event) => {
    setNotifState((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', notifState);
  };

  const handleReset = () => {
    setNotifState({
      emailMessages: true,
      emailMentions: true,
      emailComments: false,
      emailDigest: true,
      emailUpdates: false,
      pushBrowser: true,
      pushDesktop: false,
      pushSound: true,
    });
  };

  const itemRow = (label, desc, checked, onChange, icon) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2.5,
        px: { xs: 0, sm: 1 },
        '&:not(:last-of-type)': { borderBottom: `1px solid ${isDark ? '#374151' : '#f1f5f9'}` },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: isDark ? '#1e3a5f' : primaryLight,
            p: 1,
            borderRadius: 2,
            display: 'flex',
            color: primaryColor,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: isDark ? '#e2e8f0' : '#334155', fontSize: '0.875rem' }}
          >
            {label}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: isDark ? '#64748b' : '#94a3b8', display: 'block', mt: 0.3 }}
          >
            {desc}
          </Typography>
        </Box>
      </Box>
      <Switch
        checked={checked}
        onChange={onChange}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': { color: primaryColor },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            bgcolor: primaryColor,
          },
        }}
      />
    </Box>
  );

  const sectionHeader = (icon, title, subtitle) => (
    <Box
      sx={{
        px: { xs: 3, sm: 4, md: 5 },
        pt: { xs: 3, sm: 4 },
        pb: { xs: 2, sm: 3 },
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          bgcolor: isDark ? '#1e3a5f' : primaryLight,
          p: 1.2,
          borderRadius: 2.5,
          display: 'flex',
          boxShadow: isDark ? 'none' : `0 2px 8px ${primaryColor}1A`,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
        >
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.8rem' }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );

  const cardSx = {
    mb: 4,
    borderRadius: 4,
    border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
    overflow: 'hidden',
    background: isDark ? '#1e293b' : '#fff',
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Paper elevation={0} sx={cardSx}>
        {sectionHeader(<Email sx={{ color: primaryColor, fontSize: 20 }} />, 'Email notifications', 'Choose what emails you receive')}
        <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1, sm: 1.5 } }}>
          {itemRow('New messages', 'Get notified when someone sends you a message', notifState.emailMessages, handleToggle('emailMessages'), <Forum sx={{ fontSize: 18 }} />)}
          {itemRow('Mentions & replies', 'When someone mentions you or replies to your post', notifState.emailMentions, handleToggle('emailMentions'), <AlternateEmail sx={{ fontSize: 18 }} />)}
          {itemRow('Comments', 'Someone comments on your content', notifState.emailComments, handleToggle('emailComments'), <Comment sx={{ fontSize: 18 }} />)}
          {itemRow('Weekly digest', 'A summary of your weekly activity', notifState.emailDigest, handleToggle('emailDigest'), <Campaign sx={{ fontSize: 18 }} />)}
          {itemRow('Product updates', 'New features, tips, and improvements', notifState.emailUpdates, handleToggle('emailUpdates'), <Star sx={{ fontSize: 18 }} />)}
        </Box>
      </Paper>

      <Paper elevation={0} sx={cardSx}>
        {sectionHeader(<PhoneAndroid sx={{ color: primaryColor, fontSize: 20 }} />, 'Push notifications', 'Browser and device preferences')}
        <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1, sm: 1.5 } }}>
          {itemRow('Browser notifications', 'Receive notifications in your browser', notifState.pushBrowser, handleToggle('pushBrowser'), <Notifications sx={{ fontSize: 18 }} />)}
          {itemRow('Desktop alerts', 'Show native OS-level notifications', notifState.pushDesktop, handleToggle('pushDesktop'), <Notifications sx={{ fontSize: 18 }} />)}
          {itemRow('Notification sound', 'Play a sound when a notification arrives', notifState.pushSound, handleToggle('pushSound'), <VolumeUp sx={{ fontSize: 18 }} />)}
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          pt: 3,
          pb: 4,
          borderTop: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleReset}
          fullWidth={isMobile}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 4,
            py: 1.3,
            fontSize: '0.9rem',
            fontWeight: 600,
            borderColor: isDark ? '#374151' : '#e2e8f0',
            color: isDark ? '#e2e8f0' : '#64748b',
            borderWidth: '1.5px',
            bgcolor: isDark ? '#1e293b' : '#fff',
            '&:hover': {
              borderColor: isDark ? '#4b5563' : '#cbd5e1',
              bgcolor: isDark ? '#334155' : '#f8fafc',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Reset to default
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth={isMobile}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 5,
            py: 1.3,
            fontSize: '0.9rem',
            fontWeight: 600,
            bgcolor: primaryColor,
            boxShadow: `0 4px 12px ${primaryColor}4D`,
            '&:hover': {
              bgcolor: primaryHover,
              boxShadow: `0 6px 20px ${primaryColor}66`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Save preferences
        </Button>
      </Box>
    </Box>
  );
}
