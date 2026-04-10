import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Stack,
  alpha,
  Divider
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import ShieldIcon from '@mui/icons-material/Shield';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import api from '../../../../services/AxiosService';
import { showSnackbar } from '../../../../utils/snackbarNotif';

const ROLES = [
  { id: 'Admin', label: 'Administrator', desc: 'Full access to all system modules and settings.' },
  { id: 'User', label: 'Standard User', desc: 'Limited access to personal data and basic tools.' }
];

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    bgcolor: '#fff',
    fontSize: '14px',
    transition: '0.2s',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1.5px' }
  },
  '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600, color: '#64748b' }
};

const UsersUpsertPaper = ({ open, mode = 'create', initialData, onClose, onSuccess }) => {
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

  const validateForm = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required';
    if (mode === 'create') {
      if (!form.email.trim()) newErrors.email = 'Valid email is required';
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
        showSnackbar(mode === 'create' ? 'Member successfully added' : 'Profile updated', 'success');
        if (onSuccess) onSuccess(result);
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          bgcolor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 480,
            bgcolor: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}
        >
          {/* Header con Título y Descripción */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {mode === 'create' ? 'Add new member' : 'Edit profile'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                Set up identity and system permissions
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small" sx={{ height: 32, width: 32, border: '1px solid #f1f5f9' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
              {/* Sección 1: Identidad */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a', textTransform: 'uppercase' }}
                  >
                    Identity Details
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <TextField
                    label="Username"
                    placeholder="e.g. alex.dev"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username}
                    sx={inputStyle}
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
                    sx={mode === 'edit' ? { ...inputStyle, '& .MuiOutlinedInput-root': { bgcolor: '#f8fafc' } } : inputStyle}
                    size="small"
                    InputProps={{ endAdornment: mode === 'edit' && <LockIcon sx={{ fontSize: 14, color: '#94a3b8' }} /> }}
                  />
                </Stack>
              </Box>

              <Divider sx={{ borderColor: '#f1f5f9' }} />

              {/* Sección 2: Permisos */}
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <ShieldIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a', textTransform: 'uppercase' }}
                  >
                    Access Control
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
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
                          borderRadius: '12px',
                          border: '1.5px solid',
                          borderColor: isSelected ? '#6366f1' : '#f1f5f9',
                          bgcolor: isSelected ? alpha('#6366f1', 0.02) : '#fff',
                          cursor: mode === 'create' ? 'pointer' : 'default',
                          transition: '0.2s',
                          position: 'relative',
                          '&:hover': mode === 'create' ? { borderColor: isSelected ? '#6366f1' : '#cbd5e1' } : {}
                        }}
                      >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#6366f1' : '#0f172a' }}>
                          {r.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', lineHeight: 1.2 }}>
                          {r.desc}
                        </Typography>
                        {isSelected && (
                          <Box
                            sx={{ position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366f1' }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Stack>
              </Box>

              {/* Tips Informativos */}
              <Box sx={{ p: 1.5, bgcolor: '#f0f9ff', borderRadius: '10px', display: 'flex', gap: 1.5 }}>
                <InfoOutlinedIcon sx={{ color: '#0369a1', fontSize: 18, mt: 0.2 }} />
                <Typography variant="caption" sx={{ color: '#0369a1', lineHeight: 1.4 }}>
                  {mode === 'create'
                    ? "New users receive a temporary password 'Abbsium.2020' which they should change on first login."
                    : "Modifying security roles might affect the user's current session permissions immediately."}
                </Typography>
              </Box>

              <Stack spacing={1} sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  fullWidth
                  disableElevation
                  sx={{
                    bgcolor: '#0f172a',
                    color: '#fff',
                    borderRadius: '10px',
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1e293b' }
                  }}
                >
                  {loading ? <CircularProgress size={20} color="inherit" /> : mode === 'create' ? 'Add to organization' : 'Save changes'}
                </Button>
                <Button onClick={onClose} fullWidth sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                  Discard and exit
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default UsersUpsertPaper;
