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
  InputAdornment,
  CircularProgress
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';

import api from '../../../../services/AxiosService';
import { showSnackbar } from '../../../../utils/snackbarNotif';

const ROLES = [
  { id: 'Admin', label: 'Admin', desc: 'Full access to system' },
  { id: 'User', label: 'Individual', desc: 'Manage data & settings' }
];

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#fafafa',
    transition: '0.2s',
    '&:hover': { bgcolor: '#fff' },
    '&.Mui-focused': {
      bgcolor: '#fff',
      boxShadow: '0 0 0 2px rgba(155,135,245,0.25)'
    }
  }
};

const lockedInputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    bgcolor: '#f5f5f5',
    cursor: 'not-allowed',
    '& fieldset': {
      borderColor: '#e0e0e0'
    },
    '&:hover fieldset': {
      borderColor: '#e0e0e0'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e0e0e0'
    }
  },
  '& .MuiInputBase-input': {
    cursor: 'not-allowed'
  }
};

const UsersUpsertPaper = ({ open, mode = 'create', initialData, onClose, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    role: null
  });

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
      setForm({
        id: '',
        username: '',
        email: '',
        role: null
      });
    }
    setErrors({});
  }, [mode, initialData, open]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (mode === 'create') {
      if (!form.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = 'Email is invalid';
      }

      if (!form.role) {
        newErrors.role = 'Role is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...(form.id && { id: form.id }), // Solo incluir ID si existe (modo edit)
        username: form.username,
        email: form.email,
        emailConfirmed: true,
        role: form.role
      };

      const result = await api.post('/User/Upsert', payload);
      if (result.status === 200) {
        showSnackbar(
          mode === 'create' ? 'User created successfully. Default password: Abbsium.2020' : 'User updated successfully',
          'success'
        );

        if (onSuccess) {
          onSuccess(result); // Callback para refrescar la lista
        }

        onClose();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? error.response.data.errors.join(', ')
        : error.response?.data || 'An error occurred';

      showSnackbar(errorMessage, 'error');
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
          bgcolor: 'rgba(15,15,25,0.55)',
          display: 'flex',
          alignItems: { xs: 'flex-end', sm: 'center' },
          justifyContent: 'center',
          zIndex: 1400
        }}
      >
        <Paper
          elevation={24}
          sx={{
            width: '100%',
            maxWidth: 760,
            height: { xs: '96vh', sm: 'auto' },
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* HEADER */}
          <Box sx={{ p: 4, pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  {mode === 'create' ? 'New user' : 'Edit user'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage account and permissions
                </Typography>
              </Box>

              <IconButton onClick={onClose} disabled={loading}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#9b87f5',
                  boxShadow: '0 0 0 6px rgba(155,135,245,0.15)'
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>

              <Box>
                <Typography fontWeight={700}>{form.username || 'User profile'}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Account preview
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* BODY */}
          <Box sx={{ px: 4, py: 2, flex: 1, overflowY: 'auto' }}>
            {/* ACCOUNT */}
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Account info
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  fullWidth
                  disabled={loading}
                  error={!!errors.username}
                  helperText={errors.username}
                  sx={inputStyle}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => mode === 'create' && setForm({ ...form, email: e.target.value })}
                  fullWidth
                  disabled={mode === 'edit' || loading}
                  error={!!errors.email}
                  helperText={errors.email}
                  sx={mode === 'edit' ? lockedInputStyle : inputStyle}
                  InputProps={{
                    endAdornment:
                      mode === 'edit' ? (
                        <InputAdornment position="end">
                          <Box
                            sx={{
                              bgcolor: '#10b981',
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <LockIcon sx={{ fontSize: 16, color: '#fff' }} />
                          </Box>
                        </InputAdornment>
                      ) : null
                  }}
                />
              </Grid>
            </Grid>

            {/* ROLE */}
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Access level {mode === 'create' && <span style={{ color: 'red' }}>*</span>}
            </Typography>

            {errors.role && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                {errors.role}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ mb: 4 }}>
              {ROLES.map((r) => {
                const isSelected = form.role === r.id;
                const isDisabled = mode === 'edit' || loading;

                return (
                  <Grid size={{ xs: 12, sm: 6 }} key={r.id}>
                    <Box
                      onClick={() => !isDisabled && setForm({ ...form, role: r.id })}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: isSelected ? '#9b87f5' : errors.role ? '#f87171' : 'divider',
                        bgcolor: isSelected ? 'rgba(155,135,245,0.18)' : '#fafafa',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled && !isSelected ? 0.5 : 1,
                        transition: '0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                    >
                      {isDisabled && isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: '#10b981',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <LockIcon sx={{ fontSize: 16, color: '#fff' }} />
                        </Box>
                      )}

                      <Typography fontWeight={600}>{r.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {r.desc}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              px: 4,
              py: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              flexDirection: { xs: 'column-reverse', sm: 'row' }
            }}
          >
            <Button onClick={onClose} variant="outlined" fullWidth={isMobile} disabled={loading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              fullWidth={isMobile}
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                bgcolor: '#9b87f5',
                '&:hover': { bgcolor: '#8b77e5' },
                boxShadow: '0 10px 24px rgba(155,135,245,0.45)'
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : mode === 'create' ? 'Create user' : 'Save changes'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default UsersUpsertPaper;
