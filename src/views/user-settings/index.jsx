import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, Chip, Paper, IconButton, Stack, Divider } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Person, Notifications, Lock, CreditCard, Extension, Edit as EditIcon } from '@mui/icons-material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { HorizontalStepper } from './HorizontalStepper';
import Account from './Account';
import Security from './Security';
import { useAuth } from '../../contexts/AuthContext';
import Billings from './Billings';
import NotificationsSection from './Notifications';
import IntegrationsSection from './Integrations';

const sections = [
  { id: 'account', label: 'Account', icon: Person, desc: 'Personal information' },
  { id: 'notifications', label: 'Notifications', icon: Notifications, desc: 'Alerts & preferences' },
  { id: 'security', label: 'Security', icon: Lock, desc: 'Password & 2FA' },
  { id: 'billing', label: 'Billing', icon: CreditCard, desc: 'Plans & payments' },
  { id: 'integrations', label: 'Integrations', icon: Extension, desc: 'Apps' }
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [activeSection, setActiveSection] = useState('account');
  const [animateIn, setAnimateIn] = useState(false);

  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200'
  );

  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, [activeSection]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isPremium = user?.rol?.toLowerCase() === 'premium' || user?.rol?.toLowerCase() === 'admin';

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <Account user={user} />;
      case 'notifications':
        return <NotificationsSection />;
      case 'security':
        return <Security />;
      case 'billing':
        return <Billings />;
      case 'integrations':
        return <IntegrationsSection />;
      default:
        return null;
    }
  };

  return (
      <Box sx={{ width: { xs: '100%', lg: '80%' }, mx: 'auto' }}>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2.5, sm: 3.5 } }}>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" style={{ display: 'none' }} />

          {/* Ultra-Slim & Compact Profile Header */}
          <Paper
            sx={{
              mb: 3,
              px: 2.5,
              py: 1.5, // Padding vertical ultra recortado para eliminar espacios muertos
              bgcolor: 'background.paper',
              border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
              borderRadius: 2.5,
              boxShadow: '0 1px 6px rgba(0,0,0,0.01)'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2
              }}
            >
              {/* Información de Usuario Compacta */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}
              >
                <Box
                  sx={{ position: 'relative', flexShrink: 0, cursor: 'pointer', '&:hover .avatar-overlay': { opacity: 1 } }}
                  onClick={triggerFileInput}
                >
                  <Avatar src={avatarPreview} sx={{ width: 46, height: 46, border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}` }} />
                  <Box
                    className="avatar-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      bgcolor: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15, 23, 42, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      opacity: 0,
                      transition: 'opacity 0.15s ease'
                    }}
                  >
                    <CameraAltIcon sx={{ fontSize: 14 }} />
                  </Box>
                </Box>

                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={650} sx={{ color: 'text.primary', fontSize: '0.95rem', lineHeight: 1.2 }}>
                      {user?.userName || 'User'}
                    </Typography>
                    <Chip
                      label={user?.rol || 'Free'}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        bgcolor: isPremium ? 'rgba(139, 92, 246, 0.06)' : 'primary.light',
                        color: isPremium ? '#8b5cf6' : 'primary.main',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', mt: 0.25 }}>{user?.email}</Typography>
                </Box>
              </Box>

              {/* Bloques de Estado Estilizados, Delgados y Minimalistas (Active & Tokens) */}
              <Stack direction="row" spacing={3} alignItems="center" justifyContent="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {/* Active Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#10b981' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'text.primary', lineHeight: 1.1 }}>Active</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 500, letterSpacing: '0.02em' }}>
                      STATUS
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem sx={{ borderColor: isDark ? '#374151' : '#f1f5f9', height: 20, my: 'auto' }} />

                {/* Tokens Status */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#8b5cf6' }} />
                  <Box>
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 500, color: 'text.primary', lineHeight: 1.1 }}>840k</Typography>
                    <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', fontWeight: 500, letterSpacing: '0.02em' }}>
                      TOKENS
                    </Typography>
                  </Box>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderColor: isDark ? '#374151' : '#f1f5f9', height: 20, my: 'auto', display: { xs: 'none', sm: 'block' } }}
                />

                {/* Botón de Ajustes Rápido Acoplado en la misma fila */}
                <IconButton
                  onClick={triggerFileInput}
                  sx={{
                    color: 'text.secondary',
                    width: 28,
                    height: 28,
                    border: '1px solid',
                    borderColor: isDark ? '#374151' : '#e2e8f0',
                    borderRadius: 1.2,
                    '&:hover': { bgcolor: 'primary.light', borderColor: 'primary.main', color: 'primary.main' },
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  <EditIcon sx={{ fontSize: 13 }} />
                </IconButton>
              </Stack>
            </Box>
          </Paper>

          {/* Horizontal Stepper Component */}
          <Paper sx={{ mb: 3, px: { xs: 2, sm: 3, md: 5 }, borderRadius: 3, border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}` }}>
            <HorizontalStepper sections={sections} activeSection={activeSection} onSectionChange={setActiveSection} />
          </Paper>

          {/* Dynamic Views Content */}
          <Box
            sx={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {renderContent()}
          </Box>
        </Box>
      </Box>
  );
}
