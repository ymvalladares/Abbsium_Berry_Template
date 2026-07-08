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
  useTheme
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaletteIcon from '@mui/icons-material/Palette';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNotification } from 'contexts/NotificationContext';
import { dealerAPI } from 'services/AxiosService';

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
  const theme = useTheme();
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

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        domain: form.domain,
        primaryColor: form.primaryColor,
        logo: form.logo || null,
        isActive: true
      };

      const response = await dealerAPI.upsert(payload);
      if (response.data?.success) {
        notify.success('Your dealer has been created successfully!', 'Dealer Created');

        const dealerId = response.data.data?.dealerId;
        if (dealerId) {
          const dealerResponse = await dealerAPI.getById(dealerId);
          if (dealerResponse.data) {
            onSuccess(dealerResponse.data);
          }
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || 'Failed to create dealer';
      notify.error(typeof msg === 'string' ? msg : 'Operation failed', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
              Create your dealership to start managing inventory
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
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
            {/* Dealer Name */}
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

            {/* Domain */}
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

            {/* Info Box */}
            <Box sx={{ p: 1.5, bgcolor: isDark ? '#1e3a5f' : '#f0f9ff', borderRadius: '10px', display: 'flex', gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: isDark ? '#38bdf8' : '#0369a1', fontSize: 18, mt: 0.2, flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: isDark ? '#38bdf8' : '#0369a1', lineHeight: 1.4 }}>
                Your logged-in account will be automatically associated as the dealer owner.
              </Typography>
            </Box>

            {/* Submit Button */}
            <Box sx={{ pt: 1 }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth
                disableElevation
                sx={{
                  bgcolor: isDark ? '#6366f1' : '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { bgcolor: isDark ? '#4f46e5' : '#1e293b' }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Dealer & Continue'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
