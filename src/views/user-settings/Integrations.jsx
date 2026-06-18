import { useState } from 'react';
import { Box, Paper, Typography, Button, Chip, Divider, useMediaQuery, useTheme, Switch } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  Extension,
  Link as LinkIcon,
  LinkOff,
  CheckCircle,
  GitHub,
  Google,
  Apple,
  Storage,
  AttachMoney,
  Groups,
} from '@mui/icons-material';

const initialIntegrations = [
  {
    id: 'github',
    name: 'GitHub',
    desc: 'Sync repositories, commits, and pull requests',
    icon: <GitHub sx={{ fontSize: 22 }} />,
    connected: true,
    popular: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    desc: 'Receive notifications and updates in your workspace',
    icon: <Groups sx={{ fontSize: 22 }} />,
    connected: true,
    popular: true,
  },
  {
    id: 'google',
    name: 'Google Drive',
    desc: 'Import and export documents & spreadsheets',
    icon: <Google sx={{ fontSize: 22 }} />,
    connected: false,
    popular: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    desc: 'Process payments and manage subscriptions',
    icon: <AttachMoney sx={{ fontSize: 22 }} />,
    connected: false,
    popular: false,
  },
  {
    id: 'aws',
    name: 'AWS S3',
    desc: 'Store and retrieve files from cloud storage',
    icon: <Storage sx={{ fontSize: 22 }} />,
    connected: false,
    popular: false,
  },
  {
    id: 'apple',
    name: 'Apple Sign-In',
    desc: 'Allow users to sign in with their Apple ID',
    icon: <Apple sx={{ fontSize: 22 }} />,
    connected: false,
    popular: false,
  },
];

export default function Integrations() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const primaryColor = '#8b5cf6';
  const primaryHover = '#7c3aed';
  const primaryLight = '#ede9fe';

  const [integrations, setIntegrations] = useState(initialIntegrations);

  const toggleConnection = (id) => {
    setIntegrations((prev) =>
      prev.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  const handleSave = () => {
    console.log('Saving integrations:', integrations);
  };

  const connected = integrations.filter((i) => i.connected);
  const available = integrations.filter((i) => !i.connected);

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

  const integrationCard = (item) => (
    <Box
      key={item.id}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2.5,
        px: { xs: 0, sm: 1 },
        '&:not(:last-of-type)': { borderBottom: `1px solid ${isDark ? '#374151' : '#f1f5f9'}` },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            bgcolor: item.connected ? `${primaryColor}10` : isDark ? '#0f172a' : '#f8fafc',
            border: item.connected ? `1.5px solid ${primaryColor}30` : `1.5px solid ${isDark ? '#374151' : '#e2e8f0'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: item.connected ? primaryColor : isDark ? '#64748b' : '#94a3b8',
            flexShrink: 0,
            transition: 'all 0.25s ease',
          }}
        >
          {item.icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: isDark ? '#f1f5f9' : '#1e293b', fontSize: '0.9rem' }}
            >
              {item.name}
            </Typography>
            {item.popular && (
              <Chip
                label="Popular"
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  bgcolor: isDark ? '#78350f' : '#fef3c7',
                  color: isDark ? '#fbbf24' : '#d97706',
                  borderRadius: '4px',
                }}
              />
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: isDark ? '#64748b' : '#94a3b8',
              display: 'block',
              mt: 0.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: 180, sm: 300 },
            }}
          >
            {item.desc}
          </Typography>
        </Box>
      </Box>

      {item.connected ? (
        <Button
          variant="outlined"
          size="small"
          onClick={() => toggleConnection(item.id)}
          startIcon={<LinkOff sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            py: 0.6,
            px: 1.5,
            borderColor: isDark ? '#374151' : '#e2e8f0',
            color: isDark ? '#94a3b8' : '#64748b',
            borderWidth: '1.5px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            '&:hover': {
              borderColor: '#ef4444',
              color: '#ef4444',
              bgcolor: isDark ? '#450a0a' : '#fef2f2',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Disconnect
        </Button>
      ) : (
        <Button
          variant="contained"
          size="small"
          onClick={() => toggleConnection(item.id)}
          startIcon={<LinkIcon sx={{ fontSize: 14 }} />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 600,
            py: 0.6,
            px: 1.5,
            bgcolor: primaryColor,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: `0 2px 8px ${primaryColor}33`,
            '&:hover': {
              bgcolor: primaryHover,
              boxShadow: `0 4px 14px ${primaryColor}4D`,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Connect
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Paper elevation={0} sx={cardSx}>
        {sectionHeader(
          <CheckCircle sx={{ color: primaryColor, fontSize: 20 }} />,
          'Connected apps',
          `${connected.length} integration${connected.length !== 1 ? 's' : ''} active`,
        )}
        <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1, sm: 1.5 } }}>
          {connected.length > 0 ? (
            connected.map(integrationCard)
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Extension sx={{ fontSize: 40, color: isDark ? '#4B5563' : '#cbd5e1', mb: 1.5 }} />
              <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                No apps connected yet
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#4B5563' : '#cbd5e1' }}>
                Connect an app below to get started
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} sx={cardSx}>
        {sectionHeader(
          <Extension sx={{ color: primaryColor, fontSize: 20 }} />,
          'Available integrations',
          'Extend your workflow with these services',
        )}
        <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: { xs: 1, sm: 1.5 } }}>
          {available.length > 0 ? (
            available.map(integrationCard)
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: '#10b981', mb: 1.5 }} />
              <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8' }}>
                All popular integrations are connected
              </Typography>
            </Box>
          )}
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
          fullWidth={isMobile}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 4,
            py: 1.3,
            fontSize: '0.9rem',
            fontWeight: 600,
            borderColor: isDark ? '#374151' : '#e2e8f0',
            color: isDark ? '#94a3b8' : '#64748b',
            borderWidth: '1.5px',
            bgcolor: isDark ? '#1e293b' : '#fff',
            '&:hover': {
              borderColor: isDark ? '#4B5563' : '#cbd5e1',
              bgcolor: isDark ? '#0f172a' : '#f8fafc',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Browse marketplace
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
          Save changes
        </Button>
      </Box>
    </Box>
  );
}
