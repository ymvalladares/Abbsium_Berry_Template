import { useState, useEffect } from 'react';
import { Paper, Box, Typography, TextField, Button, Avatar, IconButton, Fade, CircularProgress, Stack, Divider } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import ShieldIcon from '@mui/icons-material/Shield';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import api from '../../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

import { AuroraLayer, glassInput, gradientButton, gradientText, glowShadow, GRADIENT_MAIN } from './aiUi';

const ROLES = [
  { id: 'Admin', label: 'Administrator', desc: 'Full access to all system modules and settings.' },
  { id: 'User', label: 'Standard User', desc: 'Limited access to personal data and basic tools.' },
  { id: 'Dealer', label: 'Dealer', desc: 'Access to manage vehicle inventory and dealership operations.' }
];

const UsersUpsertPaper = ({ open, mode = 'create', initialData, onClose, onSuccess }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();
  const [form, setForm] = useState({ id: '', username: '', email: '', role: null });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setForm({
        id: initialData.id || '',
        username: initialData.username || '',
        email: initialData.email || '',
        role: initialData.role || null
      });
    } else if (mode === 'create') {
      setForm({ id: '', username: '', email: '', role: null });
    }
    setErrors({});
  }, [mode, initialData, open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    else if (/\s/.test(form.username)) newErrors.username = 'Username cannot contain spaces';
    if (mode === 'create') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email.trim()) {
        newErrors.email = 'Email address is required';
      } else if (!emailRegex.test(form.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!form.role) newErrors.role = 'Security role is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const payload = { ...form, emailConfirmed: true };
      const result = await api.post('/User/Upsert', payload);
      if (result.status === 200) {
        notify.success(
          mode === 'create' ? 'Member successfully added' : 'Profile updated',
          mode === 'create' ? 'Member Added' : 'Profile Updated'
        );
        if (onSuccess) onSuccess(result);
        onClose();
      }
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      let errorMsg = 'Operation failed';

      if (typeof data === 'string') {
        errorMsg = data;
      } else if (data?.errors && Array.isArray(data.errors)) {
        errorMsg = data.errors.join('\n');
      } else if (data?.message) {
        errorMsg = data.message;
      }

      setErrors({ submit: errorMsg });
      notify.error(errorMsg, 'Operation Failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const emailBg = mode === 'edit' ? (isDark ? 'rgba(15,23,42,0.35)' : 'rgba(241,245,249,0.8)') : 'rgba(255,255,255,0.75)';

  const sectionLabelSx = {
    fontWeight: 800,
    fontSize: '0.78rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: isDark ? '#f1f5f9' : '#0f172a'
  };

  return (
    <Fade in={open}>
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <AuroraLayer isDark={isDark} />

          <Paper
            onClick={(e) => e.stopPropagation()}
            elevation={0}
            sx={{
              position: 'relative',
              zIndex: 1,
              overflow: 'visible',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '24px',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(59,130,246,0.16)'}`,
              background: isDark
                ? 'linear-gradient(165deg, rgba(30,58,138,0.55) 0%, rgba(15,23,42,0.9) 100%)'
                : 'linear-gradient(165deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 100%)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              boxShadow: isDark
                ? '0 40px 100px -20px rgba(2,6,23,0.9), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 40px 100px -24px rgba(30,58,138,0.35), inset 0 1px 0 rgba(255,255,255,0.95)'
            }}
          >
            {/* Barra de acento superior */}
            <Box
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 5,
                height: 5,
                borderRadius: '24px 24px 0 0',
                backgroundImage: GRADIENT_MAIN,
                boxShadow: glowShadow('59,130,246', 0.5, 8)
              }}
            />

            {/* Header con Título y Descripción */}
            <Box
              sx={{
                p: 3,
                pt: 2.5,
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    backgroundImage: GRADIENT_MAIN,
                    boxShadow: glowShadow(),
                    fontWeight: 800,
                    fontSize: 20
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 22 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      display: 'block',
                      ...gradientText
                    }}
                  >
                    {mode === 'create' ? 'Add new member' : 'Edit profile'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 }}>
                    Set up identity and system permissions
                  </Typography>
                </Box>
              </Box>
              <IconButton
                onClick={onClose}
                size="small"
                sx={{
                  height: 32,
                  width: 32,
                  borderRadius: '10px',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(59,130,246,0.2)'}`,
                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.05)',
                  color: 'text.secondary',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(251,113,133,0.15)' : 'rgba(251,113,133,0.1)',
                    color: '#fb7185',
                    transform: 'rotate(90deg)'
                  }
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              {errors.submit && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(127,29,29,0.35)' : '#fef2f2',
                    border: `1px solid ${isDark ? 'rgba(248,113,113,0.4)' : '#fecaca'}`,
                    boxShadow: glowShadow('239,68,68', 0.25, 10)
                  }}
                >
                  <Typography variant="caption" sx={{ color: isDark ? '#fca5a5' : '#ef4444', fontWeight: 700, whiteSpace: 'pre-line' }}>
                    {errors.submit}
                  </Typography>
                </Box>
              )}
              <Stack spacing={3}>
                {/* Sección 1: Identidad */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <BadgeIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                    <Typography variant="subtitle2" sx={sectionLabelSx}>
                      Identity Details
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    <TextField
                      label="Username"
                      placeholder="e.g. alex.dev"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, '') })}
                      fullWidth
                      error={!!errors.username}
                      helperText={errors.username || 'Letters and digits only'}
                      sx={glassInput(isDark)}
                      size="small"
                    />
                    <TextField
                      label="Email Address"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={(e) => mode === 'create' && setForm({ ...form, email: e.target.value })}
                      fullWidth
                      disabled={mode === 'edit'}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        ...glassInput(isDark),
                        '& .MuiOutlinedInput-root': {
                          ...glassInput(isDark)['& .MuiOutlinedInput-root'],
                          bgcolor: emailBg
                        }
                      }}
                      size="small"
                      InputProps={{ endAdornment: mode === 'edit' && <LockIcon sx={{ fontSize: 14, color: '#94a3b8' }} /> }}
                    />
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.1)' }} />

                {/* Sección 2: Permisos */}
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <ShieldIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                    <Typography variant="subtitle2" sx={sectionLabelSx}>
                      Access Control
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 2, display: 'block', fontWeight: 500 }}>
                    Select the level of authority this user will have.
                  </Typography>

                  <Stack spacing={1.5}>
                    {ROLES.map((r) => {
                      const isSelected = form.role === r.id;
                      return (
                        <Box
                          key={r.id}
                          onClick={() => mode === 'create' && setForm({ ...form, role: r.id })}
                          sx={{
                            p: 2,
                            borderRadius: '14px',
                            border: '1.5px solid',
                            borderColor: isSelected ? '#3b82f6' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)',
                            bgcolor: isSelected
                              ? isDark
                                ? 'rgba(59,130,246,0.14)'
                                : 'rgba(59,130,246,0.07)'
                              : isDark
                                ? 'rgba(15,23,42,0.4)'
                                : 'rgba(255,255,255,0.7)',
                            cursor: mode === 'create' ? 'pointer' : 'default',
                            transition: 'all 0.25s',
                            position: 'relative',
                            boxShadow: isSelected ? `inset 0 0 0 1px rgba(59,130,246,0.3), ${glowShadow('59,130,246', 0.5, 16)}` : 'none',
                            '&:hover':
                              mode === 'create'
                                ? {
                                    borderColor: isSelected ? '#3b82f6' : isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)',
                                    transform: 'translateY(-1px)'
                                  }
                                : {}
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              color: isSelected ? '#3b82f6' : isDark ? '#f1f5f9' : '#0f172a'
                            }}
                          >
                            {r.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: isDark ? '#94a3b8' : '#64748b', display: 'block', lineHeight: 1.35, fontWeight: 500 }}
                          >
                            {r.desc}
                          </Typography>
                          {isSelected && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 14,
                                right: 14,
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundImage: GRADIENT_MAIN,
                                boxShadow: glowShadow('59,130,246', 0.7, 8),
                                border: '1px solid rgba(255,255,255,0.5)'
                              }}
                            />
                          )}
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Tips Informativos */}
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: '12px',
                    display: 'flex',
                    gap: 1.5,
                    border: `1px solid ${isDark ? 'rgba(56,189,248,0.25)' : 'rgba(56,189,248,0.3)'}`,
                    bgcolor: isDark ? 'rgba(14,116,144,0.15)' : 'rgba(224,242,254,0.7)'
                  }}
                >
                  <InfoOutlinedIcon sx={{ color: isDark ? '#38bdf8' : '#0369a1', fontSize: 18, mt: 0.2 }} />
                  <Typography variant="caption" sx={{ color: isDark ? '#7dd3fc' : '#0369a1', lineHeight: 1.5, fontWeight: 600 }}>
                    {mode === 'create'
                      ? 'New users receive a temporary password sent to their email which they should change on first login.'
                      : "Modifying security roles might affect the user's current session permissions immediately."}
                  </Typography>
                </Box>

                <Stack spacing={1} sx={{ pt: 1 }}>
                  <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth disableElevation sx={gradientButton()}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : mode === 'create' ? 'Add to organization' : 'Save changes'}
                  </Button>
                  <Button
                    onClick={onClose}
                    fullWidth
                    sx={{
                      color: isDark ? '#94a3b8' : '#64748b',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      borderRadius: '10px',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.05)',
                        color: '#3b82f6'
                      }
                    }}
                  >
                    Discard and exit
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
};

export default UsersUpsertPaper;
