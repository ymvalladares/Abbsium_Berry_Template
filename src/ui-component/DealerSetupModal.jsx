import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
  alpha,
  Stack
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SecurityIcon from '@mui/icons-material/Security';
import { useNotification } from 'contexts/NotificationContext';
import api from 'services/AxiosService';

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#fff',
    fontSize: '14px',
    transition: '0.2s',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1.5px' }
  },
  '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600, color: '#64748b' }
};

const darkInputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#0f172a',
    fontSize: '14px',
    transition: '0.2s',
    '& fieldset': { borderColor: '#374151' },
    '&:hover fieldset': { borderColor: '#4B5563' },
    '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1.5px' }
  },
  '& .MuiInputLabel-root': { fontSize: '13px', fontWeight: 600, color: '#94a3b8' }
};

export default function DealerSetupModal({ open, onClose, onSuccess }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    domain: '',
    primaryColor: '#6366f1',
    logo: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Dealer name is required';
    if (!form.domain.trim()) newErrors.domain = 'Domain is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      localStorage.setItem('pendingDealerData', JSON.stringify({
        name: form.name,
        domain: form.domain,
        primaryColor: form.primaryColor,
        logo: form.logo || null
      }));

      const { data } = await api.post('order/create-checkout-session', {
        amount: 79.99,
        serviceType: 'Dealer',
        mode: 'subscription'
      });
      window.location.href = data.sessionUrl;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to start checkout';
      notify.error(typeof msg === 'string' ? msg : 'Operation failed', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: '', domain: '', primaryColor: '#6366f1', logo: '' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          bgcolor: isDark ? '#1e293b' : '#fff',
          boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: alpha('#6366f1', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <StorefrontIcon sx={{ fontSize: 24, color: '#6366f1' }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'text.primary' }}>
              Setup Your Dealer
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', mt: 0.25 }}>
              Configure your dealership and activate your account
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            bgcolor: isDark ? '#374151' : '#f1f5f9',
            '&:hover': { bgcolor: isDark ? '#4B5563' : '#e2e8f0' }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ borderColor: isDark ? '#374151' : '#e2e8f0' }} />

      <DialogContent sx={{ p: 0, maxHeight: '85vh', overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <StorefrontIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                Dealer Name
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. Premium Auto Gallery"
                value={form.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                sx={isDark ? darkInputStyle : inputStyle}
                size="small"
              />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: 'text.primary', mb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <PaletteIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                Domain
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. premiumautos.com"
                value={form.domain}
                onChange={handleChange('domain')}
                error={!!errors.domain}
                helperText={errors.domain}
                sx={isDark ? darkInputStyle : inputStyle}
                size="small"
              />
            </Box>

            <Box sx={{ p: 1.5, bgcolor: isDark ? '#1e3a5f' : '#f0f9ff', borderRadius: '10px', display: 'flex', gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: isDark ? '#38bdf8' : '#0369a1', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: isDark ? '#38bdf8' : '#0369a1', lineHeight: 1.4 }}>
                Your logged-in account will be automatically associated as the dealer owner.
              </Typography>
            </Box>

            {/* Pricing Card */}
            <Box
              sx={{
                bgcolor: '#4F46E5',
                borderRadius: '20px',
                p: { xs: 3, md: 3.5 },
                width: '100%',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ borderColor: 'rgba(255,255,255,0.2)', display: { xs: 'none', sm: 'block' } }}
                  />
                }
                sx={{ mb: 3 }}
              >
                {/* Left: badge + price */}
                <Box sx={{ minWidth: 140 }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      border: '1.5px solid rgba(255,255,255,0.55)',
                      borderRadius: '20px',
                      px: 2,
                      py: 0.4,
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      DEALER
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 0.5 }}>
                    <Typography
                      sx={{
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '2.8rem',
                        lineHeight: 1,
                      }}
                    >
                      $79.99
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      /month
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                    }}
                  >
                    Billed monthly
                  </Typography>
                </Box>

                {/* Right: features */}
                <Stack spacing={1.25} sx={{ flex: 1 }}>
                  {[
                    'Unlimited vehicle listings',
                    'Custom branded dealer website',
                    'Advanced analytics dashboard',
                    'SSL certificate & hosting',
                    'Priority 24/7 support',
                    'Secure Stripe payments'
                  ].map((feature, i) => (
                    <Stack key={i} direction="row" spacing={1.25} alignItems="center">
                      <CheckCircleOutlineIcon
                        sx={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', flexShrink: 0 }}
                      />
                      <Typography
                        sx={{
                          color: '#fff',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                        }}
                      >
                        {feature}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              {/* CTA */}
              <Button
                fullWidth
                onClick={handleProceedToPayment}
                disabled={loading}
                sx={{
                  bgcolor: '#fff',
                  color: '#4F46E5',
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  borderRadius: '12px',
                  py: { xs: 1.2, sm: 1.4 },
                  minHeight: 44,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
                  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.5)', color: '#4F46E5' }
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: '#4F46E5' }} />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textAlign: 'center', justifyContent: 'center', width: '100%' }}>
                    <CreditCardIcon sx={{ fontSize: { xs: 16, sm: 18 }, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: { xs: '0.82rem', sm: '0.95rem' }, fontWeight: 700, lineHeight: 1.3 }}>
                      Pay $79.99/mo & Activate Dealer
                    </Typography>
                  </Box>
                )}
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
                <SecurityIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }} />
                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  Secure payment powered by Stripe · Cancel anytime
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
