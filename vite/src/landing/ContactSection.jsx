import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  Avatar,
  AvatarGroup,
  TextField,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const KEYFRAMES = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.4); opacity: 0; }
  }
`;

const avatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg'
];

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    '& fieldset': { borderColor: 'rgba(0,0,0,0.06)', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.3)' },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      boxShadow: '0 4px 20px rgba(99,102,241,0.1)',
      '& fieldset': { borderColor: '#6366f1', borderWidth: '2px' }
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#64748b',
    '&.Mui-focused': { color: '#6366f1' }
  }
};

const ContactSection = () => {
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [activeField, setActiveField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formik = useFormik({
    initialValues: { name: '', email: '', budget: '', message: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Too short').required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      message: Yup.string().min(10, 'Minimum 10 characters').required('Required')
    }),
    onSubmit: async (values) => {
      setSubmissionStatus('loading');
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Form submitted:', values);
        setSubmissionStatus('success');
        formik.resetForm();
      } catch {
        setSubmissionStatus('error');
      } finally {
        setTimeout(() => setSubmissionStatus('idle'), 3000);
      }
    }
  });

  const isSubmitting = submissionStatus === 'loading';
  const isSuccess = submissionStatus === 'success';

  return (
    <>
      <style>{KEYFRAMES}</style>
      <Box
        id="contact"
        sx={{
          py: { xs: 8, md: 16 },
          position: 'relative',
          background: 'transparent',
          overflow: 'hidden'
        }}
      >
        {/* Background dots pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(99,102,241,0.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            opacity: 0.5
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box
            sx={{
              textAlign: 'center',
              mb: { xs: 5, md: 10 },
              px: { xs: 2, sm: 0 },
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease'
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                fontSize: '0.75rem',
                color: '#6366f1',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                mb: 1.5
              }}
            >
              GET IN TOUCH
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                lineHeight: { xs: 1.15, md: 1.1 },
                letterSpacing: '-0.03em',
                mb: 1.5,
                fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                color: '#0f172a'
              }}
            >
              Let's Build Something{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Amazing
              </Box>
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Nunito', sans-serif",
                color: '#64748b',
                maxWidth: '480px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.7,
                px: { xs: 1, sm: 0 }
              }}
            >
              Tell us about your project and we'll get back to you within 24 hours.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* LEFT - VISUAL CARD */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '24px',
                  p: { xs: 4, md: 5 },
                  bgcolor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'all 0.6s ease 0.2s'
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', mb: 3 }}>
                    Contact Details
                  </Typography>

                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: 'rgba(99,102,241,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative'
                        }}
                      >
                        <Box sx={{ position: 'absolute', inset: 0, borderRadius: '12px', bgcolor: 'rgba(99,102,241,0.2)', animation: 'pulse-ring 2s infinite' }} />
                        <EmailIcon sx={{ color: '#6366f1', fontSize: '1.2rem', position: 'relative', zIndex: 1 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                          Email
                        </Typography>
                        <Typography
                          component="a"
                          href="mailto:yordan.j.martinez@gmail.com"
                          sx={{ fontWeight: 700, color: '#0f172a', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { color: '#6366f1' } }}
                        >
                          yordan.j.martinez@gmail.com
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: 'rgba(99,102,241,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <LocationOnIcon sx={{ color: '#6366f1', fontSize: '1.2rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                          Location
                        </Typography>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                          Jacksonville, Florida
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          bgcolor: 'rgba(99,102,241,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <CalendarTodayIcon sx={{ color: '#6366f1', fontSize: '1.2rem' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 0.5 }}>
                          Schedule
                        </Typography>
                        <Typography
                          component="a"
                          href="#"
                          sx={{ fontWeight: 700, color: '#6366f1', textDecoration: 'none', fontSize: '0.95rem', '&:hover': { textDecoration: 'underline' } }}
                        >
                          Book a free call →
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>

                {/* Avatars */}
                <Box sx={{ mt: 5, pt: 4, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AvatarGroup
                      sx={{
                        justifyContent: 'flex-start',
                        '& .MuiAvatar-root': {
                          width: 38,
                          height: 38,
                          border: '2px solid #fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          ml: '-8px',
                          '&:first-of-type': { ml: 0 }
                        }
                      }}
                    >
                      {avatars.map((src, i) => (
                        <Avatar key={i} src={src} />
                      ))}
                    </AvatarGroup>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      Trusted by 50+ companies
                    </Typography>
                  </Box>
                </Box>

                {/* Stats row */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: 'rgba(99,102,241,0.06)',
                    border: '1px solid rgba(99,102,241,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Avg. Response
                    </Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {'<'} 4h
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Satisfaction
                    </Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: '1.5rem', color: '#6366f1', letterSpacing: '-0.02em' }}>
                      98%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* RIGHT - FORM */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: '24px',
                  p: { xs: 4, sm: 5, md: 6 },
                  bgcolor: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.6s ease 0.3s'
                }}
              >
                {isSuccess ? (
                  <Box
                    sx={{
                      minHeight: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}
                    >
                      <CheckCircleIcon sx={{ color: '#22c55e', fontSize: '2.5rem' }} />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#0f172a', mb: 1 }}>
                      Message Sent!
                    </Typography>
                    <Typography sx={{ color: '#64748b', maxWidth: '280px' }}>
                      We'll get back to you within 24 hours. Check your email for a confirmation.
                    </Typography>
                  </Box>
                ) : (
                  <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={3}>
                      {/* Name + Email */}
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Your Name"
                            name="name"
                            placeholder="John Doe"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            sx={inputStyles}
                            onFocus={() => setActiveField('name')}
                            onBlur={() => setActiveField(null)}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            sx={inputStyles}
                            onFocus={() => setActiveField('email')}
                            onBlur={() => setActiveField(null)}
                          />
                        </Grid>
                      </Grid>

                      {/* Budget */}
                      <TextField
                        fullWidth
                        label="Budget Range"
                        name="budget"
                        placeholder="$5k - $10k (optional)"
                        value={formik.values.budget}
                        onChange={formik.handleChange}
                        sx={inputStyles}
                        onFocus={() => setActiveField('budget')}
                        onBlur={() => setActiveField(null)}
                      />

                      {/* Message */}
                      <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="Project Details"
                        name="message"
                        placeholder="Tell us about your project, goals, and timeline..."
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.message && Boolean(formik.errors.message)}
                        helperText={formik.touched.message && formik.errors.message}
                        sx={inputStyles}
                        onFocus={() => setActiveField('message')}
                        onBlur={() => setActiveField(null)}
                      />

                      {/* Character count */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography sx={{ fontSize: '0.75rem', color: activeField === 'message' ? '#6366f1' : '#94a3b8', fontWeight: 600 }}>
                          {formik.values.message.length} / 500
                        </Typography>
                      </Box>

                      {/* Submit */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        endIcon={<SendIcon />}
                        sx={{
                          mt: 1,
                          py: 2,
                          borderRadius: '14px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          bgcolor: '#6366f1',
                          color: '#fff',
                          '&:hover': {
                            bgcolor: '#4f46e5',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(99,102,241,0.3)'
                          },
                          '&:disabled': {
                            bgcolor: 'rgba(99,102,241,0.3)',
                            color: 'rgba(255,255,255,0.3)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Stack>
                  </form>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default ContactSection;
