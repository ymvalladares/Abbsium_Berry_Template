import { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Divider, useMediaQuery, useTheme } from '@mui/material';
import { VerifiedUser, Person, Mail, AlternateEmail } from '@mui/icons-material';

export default function Account({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const primaryColor = '#0399DF';
  const primaryHover = '#0288cc';
  const primaryLight = '#E3F2FD';
  const primaryUltraLight = '#F0F9FF';

  const [formData, setFormData] = useState({
    fullName: user?.userName || '',
    username: user?.userName ? '@' + user.userName : '',
    email: user?.email || ''
  });

  const fieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: '#fff',
      transition: 'all 0.2s ease',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '1.5px'
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e1'
      },
      '&.Mui-focused fieldset': {
        borderColor: primaryColor,
        borderWidth: '2px',
        boxShadow: `0 0 0 3px ${primaryLight}`
      },
      '& input': {
        py: 1.5,
        fontSize: '0.95rem',
        fontWeight: 500,
        color: '#1e293b'
      }
    }
  };

  const handleSave = () => {
    console.log('Saving:', formData);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.userName || '',
      username: user?.userName ? '@' + user.userName : '',
      email: user?.email || ''
    });
  };

  return (
    <Box sx={{ maxWidth: '100%' }}>
      {/* Personal Information */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
          overflow: 'hidden',
          background: '#fff'
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            px: { xs: 3, sm: 4, md: 5 },
            pt: { xs: 3, sm: 4 },
            pb: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              bgcolor: primaryLight,
              p: 1.2,
              borderRadius: 2.5,
              display: 'flex',
              boxShadow: `0 2px 8px ${primaryColor}1A`
            }}
          >
            <Person sx={{ color: primaryColor, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: '#0f172a',
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }}
            >
              Personal information
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              Your basic account details
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mx: { xs: 3, sm: 4, md: 5 } }} />

        {/* Form Fields */}
        <Box sx={{ px: { xs: 3, sm: 4, md: 5 }, py: { xs: 3, sm: 4 } }}>
          {/* Full Name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              alignItems: { sm: 'center' },
              mb: 4
            }}
          >
            <Box sx={{ width: { sm: '32%' }, flexShrink: 0, mb: { xs: 0, sm: 0 } }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: '#334155',
                  fontSize: '0.875rem'
                }}
              >
                Full name
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                As it appears on your ID
              </Typography>
            </Box>
            <Box sx={{ flex: 1, width: { sm: '68%' } }}>
              <TextField
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                sx={fieldStyle}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

          {/* Username */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              alignItems: { sm: 'center' },
              mb: 4
            }}
          >
            <Box sx={{ width: { sm: '32%' }, flexShrink: 0, mb: { xs: 0, sm: 0 } }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: '#334155',
                  fontSize: '0.875rem'
                }}
              >
                Username
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                Your unique handle
              </Typography>
            </Box>
            <Box sx={{ flex: 1, width: { sm: '68%' } }}>
              <TextField
                fullWidth
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                InputProps={{
                  startAdornment: <AlternateEmail sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
                }}
                sx={{
                  ...fieldStyle,
                  '& .MuiOutlinedInput-root': {
                    ...fieldStyle['& .MuiOutlinedInput-root'],
                    display: 'flex',
                    alignItems: 'center'
                  }
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

          {/* Email */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 },
              alignItems: { sm: 'flex-start' }
            }}
          >
            <Box sx={{ width: { sm: '32%' }, flexShrink: 0, mb: { xs: 0, sm: 1.5 } }}>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  color: '#334155',
                  fontSize: '0.875rem'
                }}
              >
                Email address
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>
                Primary contact
              </Typography>
            </Box>
            <Box sx={{ flex: 1, width: { sm: '68%' } }}>
              <TextField
                fullWidth
                value={formData.email}
                disabled
                InputProps={{
                  startAdornment: <Mail sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />,
                  endAdornment: (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                      <Box
                        sx={{
                          bgcolor: '#10b981',
                          borderRadius: '50%',
                          p: 0.4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <VerifiedUser sx={{ fontSize: 14, color: 'white' }} />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#10b981',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      >
                        Verified
                      </Typography>
                    </Box>
                  )
                }}
                sx={{
                  ...fieldStyle,
                  '& .MuiOutlinedInput-root': {
                    ...fieldStyle['& .MuiOutlinedInput-root'],
                    bgcolor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    '& input': {
                      ...fieldStyle['& .MuiOutlinedInput-root']['& input'],
                      color: '#64748b'
                    }
                  }
                }}
              />

              {/* Email Notice */}
              <Box
                sx={{
                  mt: 2.5,
                  px: { xs: 2.5, sm: 3 },
                  py: { xs: 2, sm: 2.5 },
                  background: `linear-gradient(135deg, ${primaryUltraLight} 0%, #ffffff 100%)`,
                  borderRadius: 3,
                  border: `1.5px solid ${primaryColor}20`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: primaryColor,
                    flexShrink: 0,
                    mt: 1
                  }}
                />
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#0369a1',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: { xs: '0.8rem', sm: '0.85rem' }
                    }}
                  >
                    Email cannot be changed directly
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#0288cc',
                      lineHeight: 1.6,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }}
                  >
                    If you need to update your email, please{' '}
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: primaryColor,
                        '&:hover': { color: primaryHover }
                      }}
                    >
                      contact support
                    </Typography>{' '}
                    for assistance.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 3 },
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          pt: 3,
          pb: 4,
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Button
          variant="outlined"
          onClick={handleCancel}
          fullWidth={isMobile}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 4,
            py: 1.3,
            fontSize: '0.9rem',
            fontWeight: 600,
            borderColor: '#e2e8f0',
            color: '#64748b',
            borderWidth: '1.5px',
            bgcolor: '#fff',
            '&:hover': {
              borderColor: '#cbd5e1',
              bgcolor: '#f8fafc',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          fullWidth={isMobile}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            px: 5,
            py: 1.3,
            fontSize: '0.9rem',
            fontWeight: 600,
            bgcolor: primaryColor,
            boxShadow: `0 4px 12px rgba(3, 153, 223, 0.3)`,
            '&:hover': {
              bgcolor: primaryHover,
              boxShadow: `0 6px 20px rgba(3, 153, 223, 0.4)`,
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
}
