import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Person, Notifications, Lock, CreditCard, Group, Extension, Settings as SettingsIcon, VerifiedUser } from '@mui/icons-material';
import Account from './Account';
import Security from './Security';
import { useAuth } from '../../contexts/AuthContext';
import Billings from './Billings';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('account');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3
        }}
      >
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} user={user} />

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {activeSection === 'account' && <Account user={user} />}
          {activeSection === 'notifications' && <Typography variant="h6">Notifications Settings</Typography>}
          {activeSection === 'security' && <Security />}
          {activeSection === 'billing' && <Billings />}
          {activeSection === 'integrations' && <Typography variant="h6">Integrations</Typography>}
        </Paper>
      </Box>
    </Box>
  );
}

const Sidebar = ({ activeSection, setActiveSection, user }) => {
  const personalItems = [
    { id: 'account', label: 'Account', icon: <Person /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
    { id: 'security', label: 'Security', icon: <Lock /> }
  ];

  const organizationItems = [
    { id: 'billing', label: 'Billing & plans', icon: <CreditCard /> },
    { id: 'integrations', label: 'Integrations', icon: <Extension /> }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '100%', md: 280 },
        height: 'fit-content',
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Typography
        variant="caption"
        sx={{
          px: 2,
          mb: 1.5,
          display: 'block',
          color: '#64748b',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '0.7rem'
        }}
      >
        Personal
      </Typography>
      <List sx={{ px: 1 }}>
        {personalItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                borderRadius: 2,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: '#f1f5f9',
                  '&:hover': {
                    backgroundColor: '#e2e8f0'
                  }
                },
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? '#3b82f6' : '#64748b' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: activeSection === item.id ? 600 : 500,
                  color: activeSection === item.id ? '#1e293b' : '#475569'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Typography
        variant="caption"
        sx={{
          px: 2,
          mb: 1.5,
          mt: 3,
          display: 'block',
          color: '#64748b',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          fontSize: '0.7rem'
        }}
      >
        Organization
      </Typography>
      <List sx={{ px: 1 }}>
        {organizationItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
              sx={{
                borderRadius: 2,
                py: 1.2,
                '&.Mui-selected': {
                  backgroundColor: '#f1f5f9',
                  '&:hover': {
                    backgroundColor: '#e2e8f0'
                  }
                },
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: activeSection === item.id ? '#3b82f6' : '#64748b' }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: activeSection === item.id ? 600 : 500,
                  color: activeSection === item.id ? '#1e293b' : '#475569'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3, mx: 1 }} />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          transition: 'background-color 0.2s',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: '#f8fafc'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100"
            sx={{ width: 44, height: 44, mr: 1.5, border: '2px solid #e2e8f0' }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 12,
              bgcolor: '#10b981',
              borderRadius: '50%',
              p: 0.3,
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <VerifiedUser sx={{ fontSize: 12, color: 'white' }} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.9rem' }}>
            {user.userName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontSize: '0.75rem',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
