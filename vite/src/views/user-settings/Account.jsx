import { Box, Paper, Typography, Avatar, Button, TextField, Grid, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Person, Settings as SettingsIcon, PhotoCamera, VerifiedUser } from '@mui/icons-material';

export default function Account({ user }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 3, sm: 5 }, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              bgcolor: '#eff6ff',
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2.5,
              display: 'flex',
              mr: { xs: 1.5, sm: 2.5 },
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
            }}
          >
            <Person sx={{ color: '#3b82f6', fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} sx={{ color: '#1a202c', mb: 0.5 }}>
              Basic details
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: '#64748b', fontSize: { xs: '0.8rem', sm: '0.875rem' }, display: { xs: 'none', sm: 'block' } }}
            >
              Manage your personal information and account settings
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Avatar Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb',
          bgcolor: '#fafbfc'
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2.5, color: '#374151' }}>
          Profile Photo
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            gap: { xs: 2, sm: 3 }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200"
              sx={{
                width: { xs: 90, sm: 100 },
                height: { xs: 90, sm: 100 },
                border: '4px solid #fff',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
              }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                bgcolor: '#3b82f6',
                color: 'white',
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                '&:hover': {
                  bgcolor: '#2563eb',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
                border: '3px solid #fff'
              }}
            >
              <PhotoCamera sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#1e293b', mb: 0.5 }}>
              Upload a new photo
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
              JPG, PNG or GIF. Max size 5MB. Recommended 400x400px
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' }, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PhotoCamera />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  fontSize: '0.8rem',
                  px: 2,
                  '&:hover': {
                    borderColor: '#2563eb',
                    bgcolor: '#eff6ff'
                  }
                }}
              >
                Change
              </Button>
              <Button
                variant="text"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  px: 2,
                  '&:hover': {
                    bgcolor: '#fef2f2'
                  }
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb'
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
          Personal Information
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Full name *
            </Typography>
            <TextField
              fullWidth
              defaultValue={user.userName}
              variant="outlined"
              placeholder="Enter your full name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Username *
            </Typography>
            <TextField
              fullWidth
              defaultValue={'@' + user.userName}
              variant="outlined"
              placeholder="Enter your username"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  position: 'relative',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
                    borderWidth: '2px'
                  },
                  '& input': {
                    py: { xs: 1.2, sm: 1.5 },
                    pr: 5,
                    fontSize: { xs: '16px', sm: '0.95rem' }
                  }
                }
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Email address *
            </Typography>
            <TextField
              fullWidth
              defaultValue={user.email}
              variant="outlined"
              disabled
              InputProps={{
                endAdornment: (
                  <Box
                    sx={{
                      bgcolor: '#10b981',
                      borderRadius: '50%',
                      p: 0.4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: -1
                    }}
                  >
                    <VerifiedUser sx={{ fontSize: 16, color: 'white' }} />
                  </Box>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#f9fafb',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '& input': {
                    py: { xs: 1.2, sm: 1.5 },
                    fontSize: { xs: '16px', sm: '0.95rem' }
                  }
                }
              }}
            />
            <Box
              sx={{
                mt: 1.5,
                px: 2,
                py: 1.5,
                bgcolor: '#eff6ff',
                borderRadius: 2,
                border: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#3b82f6',
                  flexShrink: 0
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: '#1e40af',
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  lineHeight: 1.6
                }}
              >
                Your email is verified and cannot be changed directly.{' '}
                <Typography
                  component="span"
                  variant="caption"
                  sx={{
                    color: '#3b82f6',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: '#2563eb'
                    }
                  }}
                >
                  Contact support
                </Typography>{' '}
                if you need assistance.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Contact Information Section */}
      {/* <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: { xs: 3, sm: 4 },
          borderRadius: 3,
          border: '1px solid #e5e7eb'
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 3, color: '#374151' }}>
          Contact Information
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Country / Dial code
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="+1"
              defaultValue="+1"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
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

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1.5, color: '#374151', fontSize: '0.875rem' }}>
              Phone number
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="(555) 123-4567"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#fff',
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderColor: '#e5e7eb',
                    borderWidth: '1.5px'
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3b82f6',
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
        </Grid>
      </Paper> */}

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: { xs: 'stretch', sm: 'flex-end' },
          flexDirection: { xs: 'column', sm: 'row' },
          pt: 2,
          borderTop: '1px solid #e5e7eb',
          mt: 2
        }}
      >
        <Button
          variant="outlined"
          fullWidth={isMobile}
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
            transition: 'all 0.2s'
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
}
