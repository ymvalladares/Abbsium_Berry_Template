import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  Shield,
  Smartphone,
  Message,
  CheckCircle,
  Computer,
  TabletAndroid,
  PhoneIphone,
  MoreVert,
  ErrorOutline
} from '@mui/icons-material';
import api from '../../services/AxiosService'; // Adjust path as needed
import { showSnackbar } from '../../utils/snackbarNotif'; // Adjust path as needed
import { m } from 'framer-motion';

const Security = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // MFA states
  const [mfaApp, setMfaApp] = useState(false);
  const [mfaSms, setMfaSms] = useState(false);

  // Login history
  const [loginHistory, setLoginHistory] = useState([
    {
      device: 'Desktop',
      browser: 'Chrome on Windows',
      location: 'New York, US',
      date: 'Jan 24, 2026 - 10:30 AM',
      status: 'current',
      icon: <Computer />
    },
    {
      device: 'Mobile',
      browser: 'Safari on iPhone',
      location: 'Miami, US',
      date: 'Jan 23, 2026 - 3:15 PM',
      status: 'success',
      icon: <PhoneIphone />
    },
    {
      device: 'Tablet',
      browser: 'Chrome on iPad',
      location: 'Boston, US',
      date: 'Jan 22, 2026 - 8:45 AM',
      status: 'success',
      icon: <TabletAndroid />
    }
  ]);

  // Password validation
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('One number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('One special character');
    }
    return errors;
  };

  // Check if password meets requirements
  const isPasswordValid = (password) => {
    return validatePassword(password).length === 0;
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Reset errors
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    // Validate current password
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const passwordErrors = validatePassword(newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must have: ${passwordErrors.join(', ')}`;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Check if same as current password
    if (newPassword && currentPassword && newPassword === currentPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    // Submit to API
    setIsLoading(true);
    try {
      const response = await api.post('/user/Change-Password', {
        currentPassword,
        newPassword,
        confirmPassword
      });

      showSnackbar('Password updated successfully', 'success');

      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      //showSnackbar(errorMessage, 'error');

      // If current password is wrong
      if (error.response?.status === 400) {
        setErrors((prev) => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle MFA toggle
  const handleMfaToggle = async (type, value) => {
    try {
      if (type === 'app') {
        setMfaApp(!mfaApp);
      } else {
        setMfaSms(value);
      }
    } catch (error) {
      console.error('Error toggling MFA:', error);
      showSnackbar('Failed to update MFA settings', 'error');
    }
  };

  // Cancel password change
  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Get password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };

    const errors = validatePassword(password);
    const strength = 5 - errors.length;

    if (strength <= 2) return { strength, label: 'Weak', color: '#dc2626' };
    if (strength === 3) return { strength, label: 'Fair', color: '#f59e0b' };
    if (strength === 4) return { strength, label: 'Good', color: '#10b981' };
    return { strength, label: 'Strong', color: '#10b981' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 3, sm: 5 }, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: '#fef3c7',
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2.5,
              display: 'flex',
              mr: { xs: 1.5, sm: 2.5 },
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.15)'
            }}
          >
            <Lock sx={{ color: '#f59e0b', fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} sx={{ color: '#1a202c', mb: 0.5 }}>
              Security
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#64748b', fontSize: { xs: '0.8rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}
            >
              Manage your password and security settings
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Change Password Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Shield sx={{ color: '#3b82f6', mr: 1.5, fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#374151' }}>
              Change Password
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Update your password regularly to keep your account secure
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Current password *
            </Typography>
            <TextField
              fullWidth
              type={showOldPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setErrors((prev) => ({ ...prev, currentPassword: '' }));
              }}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" sx={{ mr: -0.5 }}>
                    {showOldPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: errors.currentPassword ? '#dc2626' : '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: errors.currentPassword ? '#dc2626' : '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.currentPassword ? '#dc2626' : '#3b82f6',
                    borderWidth: '2px'
                  },
                  '& input': {
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '16px', sm: '0.95rem' }
                  }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              New password *
            </Typography>
            <TextField
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setErrors((prev) => ({ ...prev, newPassword: '' }));
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ mr: -0.5 }}>
                    {showNewPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: errors.newPassword ? '#dc2626' : '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: errors.newPassword ? '#dc2626' : '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.newPassword ? '#dc2626' : '#3b82f6',
                    borderWidth: '2px'
                  },
                  '& input': {
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '16px', sm: '0.95rem' }
                  }
                }
              }}
            />
            {newPassword && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ flex: 1, height: 4, bgcolor: '#e5e7eb', borderRadius: 1, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${(passwordStrength.strength / 5) * 100}%`,
                      bgcolor: passwordStrength.color,
                      transition: 'all 0.3s'
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: passwordStrength.color, fontWeight: 600, fontSize: '0.7rem' }}>
                  {passwordStrength.label}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Confirm password *
            </Typography>
            <TextField
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ mr: -0.5 }}>
                    {showConfirmPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: errors.confirmPassword ? '#dc2626' : '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: errors.confirmPassword ? '#dc2626' : '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.confirmPassword ? '#dc2626' : '#3b82f6',
                    borderWidth: '2px'
                  },
                  '& input': {
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '16px', sm: '0.95rem' }
                  }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                  flexShrink: 0,
                  mt: 0.7
                }}
              />
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: '#1e40af', fontSize: { xs: '0.75rem', sm: '0.8rem' }, lineHeight: 1.6, display: 'block', mb: 0.5 }}
                >
                  Password requirements:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#64748b', fontSize: { xs: '0.7rem', sm: '0.75rem' }, lineHeight: 1.5, display: 'block' }}
                >
                  • At least 8 characters long • Contains uppercase and lowercase letters • Includes numbers and special characters
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="outlined"
            fullWidth={isMobile}
            onClick={handleCancel}
            disabled={isLoading}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              px: 4,
              py: 1.2,
              fontSize: '0.9rem',
              fontWeight: 600,
              borderColor: '#e5e7eb',
              color: '#64748b',
              borderWidth: '1.5px',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f9fafb',
                borderWidth: '1.5px'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            fullWidth={isMobile}
            onClick={handlePasswordChange}
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            sx={{
              borderRadius: 2.5,
              textTransform: 'none',
              px: 4,
              py: 1.2,
              fontSize: '0.9rem',
              fontWeight: 600,
              bgcolor: '#3b82f6',
              boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
              '&:hover': {
                bgcolor: '#2563eb',
                boxShadow: '0 4px 16px rgba(59,130,246,0.35)',
                transform: 'translateY(-1px)'
              },
              '&:disabled': {
                bgcolor: '#cbd5e1',
                color: '#94a3b8'
              },
              transition: 'all 0.2s'
            }}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Paper>

      {/* Multi-Factor Authentication Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Shield sx={{ color: '#10b981', mr: 1.5, fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#374151' }}>
              Multi-Factor Authentication
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Add an extra layer of security to your account
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Authenticator App */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: '1.5px solid',
                borderColor: mfaApp ? '#10b981' : '#e5e7eb',
                bgcolor: mfaApp ? '#f0fdf4' : '#fafbfc',
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      bgcolor: mfaApp ? '#dcfce7' : '#f3f4f6',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex'
                    }}
                  >
                    <Smartphone sx={{ color: mfaApp ? '#10b981' : '#64748b', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>
                        Authenticator App
                      </Typography>
                      {mfaApp && (
                        <Chip
                          label="Active"
                          size="small"
                          icon={<CheckCircle sx={{ fontSize: 14 }} />}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#10b981',
                            color: 'white',
                            '& .MuiChip-icon': {
                              color: 'white',
                              ml: 0.5
                            }
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                      Use an authentication app to generate secure codes
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={mfaApp}
                  onChange={(e) => handleMfaToggle('app', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10b981'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10b981'
                    }
                  }}
                />
              </Box>
              {mfaApp && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #d1fae5',
                    display: 'flex',
                    gap: 1.5,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: '#059669',
                        bgcolor: '#f0fdf4'
                      }
                    }}
                  >
                    Reconfigure
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      color: '#64748b',
                      fontSize: '0.8rem'
                    }}
                  >
                    View Backup Codes
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Text Message */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2.5,
                border: '1.5px solid',
                borderColor: mfaSms ? '#10b981' : '#e5e7eb',
                bgcolor: mfaSms ? '#f0fdf4' : '#fafbfc',
                transition: 'all 0.3s'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      bgcolor: mfaSms ? '#dcfce7' : '#f3f4f6',
                      p: 1,
                      borderRadius: 2,
                      display: 'flex'
                    }}
                  >
                    <Message sx={{ color: mfaSms ? '#10b981' : '#64748b', fontSize: 22 }} />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b' }}>
                        Text Message (SMS)
                      </Typography>
                      {mfaSms && (
                        <Chip
                          label="Active"
                          size="small"
                          icon={<CheckCircle sx={{ fontSize: 14 }} />}
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: '#10b981',
                            color: 'white',
                            '& .MuiChip-icon': {
                              color: 'white',
                              ml: 0.5
                            }
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>
                      Receive verification codes via SMS to your phone
                    </Typography>
                  </Box>
                </Box>
                <Switch
                  checked={mfaSms}
                  onChange={(e) => handleMfaToggle('sms', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#10b981'
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10b981'
                    }
                  }}
                />
              </Box>
              {mfaSms && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #d1fae5',
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center', // ✅ vertical align
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontSize: '0.8rem',
                      '&:hover': {
                        borderColor: '#059669',
                        bgcolor: '#f0fdf4'
                      }
                    }}
                  >
                    Change Number
                  </Button>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.75rem',
                      mb: { xs: 1.5, sm: 0 } // ✅ only margin when stacked
                    }}
                  >
                    Phone number: +1 (555) 123-4567
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Login History Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Computer sx={{ color: '#8b5cf6', mr: 1.5, fontSize: 24 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#374151' }}>
                Login History
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Recent activity on your account
              </Typography>
            </Box>
          </Box>
          <Button
            variant="text"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              color: '#3b82f6',
              fontSize: '0.85rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#eff6ff'
              }
            }}
          >
            View All
          </Button>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: { xs: 300, sm: 650 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', borderBottom: '2px solid #e5e7eb', py: 1.5 }}>
                  Device
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: '0.8rem',
                    borderBottom: '2px solid #e5e7eb',
                    py: 1.5,
                    display: { xs: 'none', sm: 'table-cell' }
                  }}
                >
                  Location
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.8rem', borderBottom: '2px solid #e5e7eb', py: 1.5 }}>
                  Date & Time
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: '0.8rem',
                    borderBottom: '2px solid #e5e7eb',
                    py: 1.5,
                    display: { xs: 'none', md: 'table-cell' }
                  }}
                >
                  Status
                </TableCell>
                <TableCell sx={{ borderBottom: '2px solid #e5e7eb', py: 1.5 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {loginHistory.map((item, index) => (
                <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                  <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          bgcolor: item.status === 'current' ? '#eff6ff' : '#f3f4f6',
                          p: 1,
                          borderRadius: 2,
                          display: 'flex'
                        }}
                      >
                        {React.cloneElement(item.icon, {
                          sx: { fontSize: 20, color: item.status === 'current' ? '#3b82f6' : '#64748b' }
                        })}
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b', fontSize: '0.85rem' }}>
                          {item.device}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {item.browser}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 2, display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                      {item.location}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 2 }}>
                    <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem' }}>
                      {item.date}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 2, display: { xs: 'none', md: 'table-cell' } }}>
                    <Chip
                      label={item.status === 'current' ? 'Current Session' : 'Success'}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        bgcolor: item.status === 'current' ? '#eff6ff' : '#f0fdf4',
                        color: item.status === 'current' ? '#3b82f6' : '#10b981',
                        border: '1px solid',
                        borderColor: item.status === 'current' ? '#dbeafe' : '#d1fae5'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #f3f4f6', py: 2 }}>
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      <MoreVert sx={{ fontSize: 20 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
export default Security;
