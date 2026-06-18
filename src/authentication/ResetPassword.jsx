import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Fade, Stack, alpha, TextField, InputAdornment, Alert } from '@mui/material';
import { Lock, ArrowRight, KeyRound, Check } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/AxiosService';

const radius = 5;

export default function ResetPassword({ open = true }) {
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    if (!passwords.new || !passwords.confirm) {
      setError('Please fill in both fields.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (passwords.new.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // Lee el token directo de la URL sin que useSearchParams lo procese
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const email = urlParams.get('email');

      const result = await api.post('/account/reset-password', {
        email,
        token,
        newPassword: passwords.new
      });

      if (result.data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/authenticate'), 2500);
      } else {
        setError(result.data.message || 'Something went wrong.');
      }
    } catch {
      setError('Something went wrong. Please request a new reset link.');
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
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          p: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            bgcolor: '#fff',
            borderRadius: radius,
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ height: '4px', bgcolor: success ? '#10b981' : '#f59e0b' }} />

          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: alpha(success ? '#10b981' : '#f59e0b', 0.1),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: success ? '#10b981' : '#f59e0b'
                }}
              >
                <KeyRound size={36} strokeWidth={1.5} />
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                  {success ? 'Password updated!' : 'Set new password'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  {success ? 'Redirecting you to login...' : 'Please enter your new password and confirm it below.'}
                </Typography>
              </Box>

              {!success && (
                <Stack spacing={2} sx={{ width: '100%' }}>
                  <TextField
                    fullWidth
                    type="password"
                    placeholder="New password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: radius } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={18} color="#94a3b8" />
                        </InputAdornment>
                      )
                    }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: radius } }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Check size={18} color={passwords.confirm && passwords.new === passwords.confirm ? '#10b981' : '#94a3b8'} />
                        </InputAdornment>
                      )
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ borderRadius: radius, textAlign: 'left' }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    disableElevation
                    onClick={handleSubmit}
                    disabled={loading}
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      bgcolor: '#0f172a',
                      color: '#fff',
                      borderRadius: radius,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      mt: 1,
                      '&:hover': { bgcolor: '#1e293b' },
                      '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' }
                    }}
                  >
                    {loading ? 'Updating...' : 'Update password'}
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
