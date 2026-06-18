import React from 'react';
import { Box, Typography, Button, Paper, Fade, Stack, alpha } from '@mui/material';
import { Mail, ArrowRight } from 'lucide-react';

const radius = 5; // Abbsium signature

export default function EmailVerificationWall({ open = true, email = 'Email Logged In' }) {
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
          {/* Acento visual superior - Azul técnico */}
          <Box sx={{ height: '4px', bgcolor: '#6366f1' }} />

          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Stack spacing={3} alignItems="center">
              {/* Icono de Email */}
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: alpha('#6366f1', 0.1),
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1'
                }}
              >
                <Mail size={36} strokeWidth={1.5} />
              </Box>

              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                  Check your inbox
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                  We've sent a verification link to <strong>{email}</strong>. Please click the link to activate your account.
                </Typography>
              </Box>

              <Stack spacing={1.5} sx={{ width: '100%', pt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disableElevation
                  onClick={() => window.open('mailto:', '_blank')}
                  endIcon={<ArrowRight size={18} />}
                  sx={{
                    bgcolor: '#0f172a',
                    color: '#fff',
                    borderRadius: radius,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#1e293b' }
                  }}
                >
                  Open email provider
                </Button>

                <Button
                  variant="text"
                  size="small"
                  sx={{
                    color: '#94a3b8',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { color: '#6366f1', bgcolor: 'transparent' }
                  }}
                >
                  Didn't receive the email? Resend
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
