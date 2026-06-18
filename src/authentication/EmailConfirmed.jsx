import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Fade, Stack, alpha } from '@mui/material';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/AxiosService';
import { useAuth } from '../contexts/AuthContext';

const radius = 10;

export default function EmailConfirmed() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuth();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = params.get('token');
        const userId = params.get('userId');

        if (!token || !userId) {
          setIsValid(false);
          setLoading(false);
          return;
        }

        await api.get(`/account/confirm-email?userId=${userId}&token=${token}`);

        // Actualiza localStorage y contexto
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.emailConfirmed = true;
          localStorage.setItem('user', JSON.stringify(parsed));
          setUser(parsed);
        }

        setIsValid(true);
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8f7ff 0%, #f0f4ff 50%, #ffffff 100%)'
        }}
      >
        <Typography sx={{ color: '#64748b', fontSize: '14px' }}>Verifying your email...</Typography>
      </Box>
    );

  return (
    <Fade in>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #f8f7ff 0%, #f0f4ff 50%, #ffffff 100%)',
          p: 2
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            bgcolor: '#fff',
            borderRadius: radius,
            border: '1px solid #e2e8f0',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Top accent line */}
          <Box sx={{ height: '4px', bgcolor: isValid ? '#10b981' : '#ef4444' }} />

          <Box sx={{ p: 4, pt: 5, textAlign: 'center' }}>
            <Stack spacing={3} alignItems="center">
              {/* Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(isValid ? '#10b981' : '#ef4444', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isValid ? (
                  <CheckCircle2 size={42} color="#10b981" strokeWidth={2.5} />
                ) : (
                  <XCircle size={42} color="#ef4444" strokeWidth={2.5} />
                )}
              </Box>

              {/* Text */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    mb: 1
                  }}
                >
                  {isValid ? 'Email confirmed!' : 'Link invalid or expired'}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, px: 1 }}>
                  {isValid
                    ? 'Your Abbsium account is now fully active and ready to use.'
                    : 'This link has expired or was already used. Request a new one from your dashboard.'}
                </Typography>
              </Box>

              {/* CTA */}
              <Stack spacing={1.5} sx={{ width: '100%', pt: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disableElevation
                  onClick={() => navigate(isValid ? '/platform' : '/authenticate')}
                  sx={{
                    bgcolor: '#0f172a',
                    color: '#fff',
                    borderRadius: radius,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '14px',
                    '&:hover': { bgcolor: '#1e293b' }
                  }}
                >
                  {isValid ? 'Go to my dashboard' : 'Sign in to your account'}
                </Button>

                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                  Secure verification by Abbsium Auth
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
}
