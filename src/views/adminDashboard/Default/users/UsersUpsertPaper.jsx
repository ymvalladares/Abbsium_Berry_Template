import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import api from '../../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

import { glassInput, gradientButton, gradientText, glowShadow, GRADIENT_MAIN } from './aiUi';

const ROLES = [
  { id: 'Admin', label: 'Administrator', desc: 'Full access to all system modules and settings.', icon: AdminPanelSettingsRoundedIcon, color: '#ef4444' },
  { id: 'Dealer', label: 'Dealer', desc: 'Manage vehicle inventory and dealership operations.', icon: StoreRoundedIcon, color: '#3b82f6' },
  { id: 'User', label: 'Standard User', desc: 'Limited access to personal data and basic tools.', icon: PersonRoundedIcon, color: '#8b5cf6' }
];

const UsersUpsertPaper = ({ open, mode = 'create', initialData, onClose, onSuccess }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
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

  const selectedRole = ROLES.find((r) => r.id === form.role);

  const dialogPaperSx = {
    overflow: 'hidden',
    width: '100%',
    maxWidth: { xs: '100%', sm: 520, md: 560 },
    maxHeight: { xs: '100vh', sm: '85vh' },
    minHeight: { xs: '100vh', sm: 'auto' },
    borderRadius: { xs: 0, sm: '20px' },
    margin: { xs: 0, sm: 'auto' },
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)'}`,
    background: isDark
      ? 'linear-gradient(170deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.99) 100%)'
      : 'linear-gradient(170deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: isDark
      ? '0 32px 80px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset'
      : '0 32px 80px -20px rgba(30,58,138,0.18), 0 0 0 1px rgba(59,130,246,0.06) inset'
  };

  const sectionTitleSx = {
    fontWeight: 700,
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: isDark ? '#64748b' : '#94a3b8'
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} fullWidth maxWidth="sm" PaperProps={{ sx: dialogPaperSx }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: { xs: '100%', sm: 'auto' }, maxHeight: { xs: 'none', sm: '85vh' } }}>

        {/* === HEADER === */}
        <Box
          sx={{
            position: 'relative',
            px: { xs: 2.5, sm: 3.5 },
            pt: { xs: 2.5, sm: 3 },
            pb: { xs: 2, sm: 2.5 },
            background: isDark
              ? 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.06) 50%, rgba(59,130,246,0.03) 100%)'
              : 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(139,92,246,0.03) 50%, rgba(59,130,246,0.01) 100%)',
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)'}`
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundImage: GRADIENT_MAIN }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  borderRadius: '14px',
                  backgroundImage: mode === 'create'
                    ? 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: mode === 'create'
                    ? '0 8px 24px -6px rgba(59,130,246,0.4)'
                    : '0 8px 24px -6px rgba(99,102,241,0.4)'
                }}
              >
                {mode === 'create'
                  ? <PersonAddAltRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                  : <EditRoundedIcon sx={{ color: '#fff', fontSize: 22 }} />
                }
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  }}
                >
                  {mode === 'create' ? 'Add New Member' : 'Edit Profile'}
                </Typography>
                <Typography
                  sx={{
                    color: isDark ? '#64748b' : '#64748b',
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    mt: 0.25
                  }}
                >
                  Configure identity and access permissions
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={onClose}
              sx={{
                height: 36,
                width: 36,
                borderRadius: '10px',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.04)',
                color: isDark ? '#94a3b8' : '#64748b',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(251,113,133,0.12)' : 'rgba(251,113,133,0.08)',
                  color: '#fb7185',
                  transform: 'rotate(90deg)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* === BODY === */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2.5, sm: 3.5 }, py: { xs: 2, sm: 3 }, '&::-webkit-scrollbar': { width: '4px' }, '&::-webkit-scrollbar-thumb': { background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.15)', borderRadius: '2px' } }}>

          {errors.submit && (
            <Box sx={{ mb: 2.5, p: 1.5, borderRadius: '12px', bgcolor: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2', border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : '#fecaca'}` }}>
              <Typography variant="body2" sx={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'pre-line' }}>
                {errors.submit}
              </Typography>
            </Box>
          )}

          {/* === SECTION: Identity === */}
          <Typography sx={sectionTitleSx} >Identity</Typography>
          <Stack spacing={2} sx={{ mt: 1.5, mb: 3 }}>
            <TextField
              label="Username"
              placeholder="e.g. alex.dev"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value.replace(/\s/g, '') })}
              fullWidth
              error={!!errors.username}
              helperText={errors.username || 'Letters and digits only, no spaces'}
              FormHelperTextProps={{ sx: { fontSize: '0.72rem', fontWeight: 500, color: isDark ? '#64748b' : '#94a3b8', ml: 0.5 } }}
              sx={{
                ...glassInput(isDark),
                '& .MuiInputLabel-root': { fontSize: '0.85rem' },
                '& .MuiInputBase-input': { fontSize: '0.9rem', letterSpacing: '-0.01em' }
              }}
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
              helperText={errors.email || (mode === 'edit' ? 'Email cannot be changed' : 'We\'ll send a temporary password here')}
              FormHelperTextProps={{ sx: { fontSize: '0.72rem', fontWeight: 500, color: isDark ? '#64748b' : '#94a3b8', ml: 0.5 } }}
              sx={{
                ...glassInput(isDark),
                '& .MuiInputLabel-root': { fontSize: '0.85rem' },
                '& .MuiInputBase-input': { fontSize: '0.9rem', letterSpacing: '-0.01em' },
                '& .Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? 'rgba(255,255,255,0.06) !important' : 'rgba(59,130,246,0.08) !important' },
                '& .Mui-disabled .MuiInputBase-input': { WebkitTextFillColor: isDark ? '#475569' : '#94a3b8' }
              }}
              size="small"
              InputProps={{ endAdornment: mode === 'edit' && <LockIcon sx={{ fontSize: 15, color: isDark ? '#475569' : '#94a3b8' }} /> }}
            />
          </Stack>

          <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.06)', mb: 3 }} />

          {/* === SECTION: Role === */}
          <Typography sx={sectionTitleSx}>Access Control</Typography>
          <Typography sx={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.78rem', fontWeight: 500, mt: 0.5, mb: 2 }}>
            Select the permission level for this user
          </Typography>

          <Stack spacing={1.25}>
            {ROLES.map((r) => {
              const isSelected = form.role === r.id;
              const RoleIcon = r.icon;
              return (
                <Box
                  key={r.id}
                  onClick={() => mode === 'create' && setForm({ ...form, role: r.id })}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: '14px',
                    border: '1.5px solid',
                    borderColor: isSelected ? r.color : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)',
                    bgcolor: isSelected
                      ? isDark ? `${r.color}12` : `${r.color}08`
                      : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
                    cursor: mode === 'create' ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    opacity: mode === 'edit' && !isSelected ? 0.7 : 1,
                    '&:hover': mode === 'create' ? {
                      borderColor: isSelected ? r.color : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(59,130,246,0.2)',
                      bgcolor: isSelected ? (isDark ? `${r.color}16` : `${r.color}10`) : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.02)'),
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px -4px rgba(0,0,0,0.1)'
                    } : {}
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      bgcolor: isSelected ? `${r.color}18` : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <RoleIcon sx={{ fontSize: 20, color: isSelected ? r.color : isDark ? '#64748b' : '#94a3b8' }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: isDark ? '#e2e8f0' : '#0f172a', lineHeight: 1.3 }}>
                      {r.label}
                    </Typography>
                    <Typography sx={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.73rem', fontWeight: 500, lineHeight: 1.4, mt: 0.2 }}>
                      {r.desc}
                    </Typography>
                  </Box>

                  {isSelected && (
                    <CheckCircleRoundedIcon sx={{ fontSize: 22, color: r.color, flexShrink: 0 }} />
                  )}

                  {!isSelected && mode === 'create' && (
                    <Radio
                      checked={false}
                      size="small"
                      sx={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(59,130,246,0.15)', p: 0, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>

          {/* === Tip === */}
          <Box
            sx={{
              mt: 3,
              p: { xs: 1.5, sm: 2 },
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              bgcolor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.03)',
              border: `1px solid ${isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.08)'}`
            }}
          >
            <InfoOutlinedIcon sx={{ color: isDark ? '#3b82f6' : '#60a5fa', fontSize: 16, mt: 0.2, flexShrink: 0 }} />
            <Typography sx={{ color: isDark ? '#64748b' : '#64748b', lineHeight: 1.5, fontWeight: 500, fontSize: '0.75rem' }}>
              {mode === 'create'
                ? 'New users receive a temporary password via email. They should change it on first login.'
                : "Changing the role will take effect immediately on the user's next request."}
            </Typography>
          </Box>
        </Box>

        {/* === FOOTER === */}
        <Box
          sx={{
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2, sm: 2.5 },
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)'}`,
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            bgcolor: isDark ? 'rgba(0,0,0,0.15)' : 'rgba(59,130,246,0.015)'
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              flex: 1,
              color: isDark ? '#94a3b8' : '#64748b',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              borderRadius: '12px',
              py: 1.2,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.1)'}`,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.03)',
                borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(59,130,246,0.2)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            disableElevation
            sx={{
              flex: 2,
              ...gradientButton(),
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              py: 1.2,
              letterSpacing: '-0.01em'
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : mode === 'create' ? 'Add Member' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UsersUpsertPaper;
