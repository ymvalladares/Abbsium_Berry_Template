import { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Avatar,
  AvatarGroup,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BusinessIcon from '@mui/icons-material/Business';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const uiConfigs = {
  colors: {
    primary: '#6366f1',
    dark: '#0f172a',
    text: '#64748b',
    success: '#22c55e'
  },
  gradients: {
    spotlight: 'radial-gradient(600px circle at center, rgba(99, 102, 241, 0.06), transparent 40%)'
  }
};

const sharedInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    backgroundColor: '#fff',
    '& fieldset': { borderColor: 'rgba(15,23,42,0.08)' },
    '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.3)' },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      borderWidth: '2px'
    }
  }
};

const contactMethods = [
  { icon: AlternateEmailIcon, label: 'Email', value: 'yordan.j.martinez@gmail.com', href: 'mailto:yordan.j.martinez@gmail.com' },
  { icon: BusinessIcon, label: 'Head Office', value: 'Jacksonville, Florida' },
  { icon: ScheduleIcon, label: 'Response Time', value: '< 24 hours (Mon–Fri)' }
];

const recentClients = [
  { name: 'Alex R.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sonia M.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Karim B.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' }
];

const ContactSection = () => {
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [attachment, setAttachment] = useState(null);

  const formik = useFormik({
    initialValues: { fullName: '', email: '', company: '', message: '' },
    validationSchema: Yup.object({
      fullName: Yup.string().min(3).required(),
      email: Yup.string().email().required(),
      message: Yup.string().min(20).required()
    }),
    onSubmit: async (values) => {
      setSubmissionStatus('loading');
      const formData = new FormData();
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      if (attachment) formData.append('attachment', attachment);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setSubmissionStatus('success');
        formik.resetForm();
        setAttachment(null);
      } catch {
        setSubmissionStatus('error');
      } finally {
        setTimeout(() => setSubmissionStatus('idle'), 4000);
      }
    }
  });

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'transparent' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="stretch">
          {/* LEFT */}
          <Grid size={{ xs: 12, sm: 12, md: 5 }}>
            <Stack spacing={4} sx={{ height: '100%', justifyContent: 'center' }}>
              <Box sx={{ maxWidth: 480 }}>
                <Typography sx={{ color: uiConfigs.colors.primary, fontWeight: 700, mb: 1 }}>LET'S TALK</Typography>

                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
                  Have an idea? <br />
                  <Box component="span" sx={{ color: uiConfigs.colors.primary }}>
                    We make it real.
                  </Box>
                </Typography>

                <Typography sx={{ color: uiConfigs.colors.text }}>We design and build solutions that help your business grow.</Typography>
              </Box>

              <Stack spacing={2}>
                {contactMethods.map((m, i) => (
                  <Paper
                    key={i}
                    sx={{
                      p: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(99,102,241,0.1)',
                        borderRadius: '10px'
                      }}
                    >
                      <m.icon sx={{ color: uiConfigs.colors.primary }} />
                    </Box>

                    <Box>
                      <Typography sx={{ fontSize: 12, color: uiConfigs.colors.text }}>{m.label}</Typography>
                      <Typography sx={{ fontWeight: 600 }}>{m.value}</Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              <Paper sx={{ p: 3, borderRadius: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <AvatarGroup>
                      {recentClients.map((c, i) => (
                        <Avatar key={i} src={c.avatar} />
                      ))}
                    </AvatarGroup>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                    <Typography sx={{ fontWeight: 600 }}>Trusted by growing companies</Typography>
                    <Typography sx={{ fontSize: 13, color: uiConfigs.colors.text }}>Delivered on time and within budget.</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT */}
          <Grid size={{ xs: 12, sm: 12, md: 7 }}>
            <Paper
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={3}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Tell us about your project
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        sx={sharedInputStyles}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        sx={sharedInputStyles}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Company"
                    name="company"
                    value={formik.values.company}
                    onChange={formik.handleChange}
                    sx={sharedInputStyles}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Project Details"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    sx={sharedInputStyles}
                  />

                  {/* ATTACH FIX */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<AttachFileIcon />}
                      sx={{ borderRadius: '12px', textTransform: 'none' }}
                    >
                      Attach file
                      <input hidden type="file" onChange={(e) => setAttachment(e.target.files[0])} />
                    </Button>

                    {attachment && (
                      <Chip
                        label={attachment.name}
                        onDelete={() => setAttachment(null)}
                        sx={{
                          maxWidth: 200,
                          borderRadius: '10px'
                        }}
                      />
                    )}
                  </Box>

                  {/* BUTTON FIX */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                      mt: 1,
                      py: 1.8,
                      borderRadius: '14px',
                      fontWeight: 700,
                      bgcolor: uiConfigs.colors.dark,
                      '&:hover': {
                        bgcolor: uiConfigs.colors.primary
                      }
                    }}
                  >
                    {submissionStatus === 'loading' ? 'Sending...' : 'Submit Request'}
                  </Button>

                  <Typography align="center" sx={{ fontSize: 12, color: uiConfigs.colors.text }}>
                    We respect your privacy. Your data will never be shared.
                  </Typography>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactSection;
