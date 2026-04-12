import React from 'react';
import { Box, Typography, Container, Paper, Stack, List, ListItemButton, ListItemText, Divider } from '@mui/material';

const radius = 5;

export const TermsOfService = () => {
  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      content: 'By accessing or using Abbsium, you signify that you have read, understood, and agree to be bound by these Terms of Service.'
    },
    {
      id: 'eligibility',
      title: '2. Eligibility',
      content:
        'You must be at least 18 years old to use our service. By creating an account, you represent and warrant that you meet this requirement.'
    },
    {
      id: 'account',
      title: '3. User Accounts',
      content:
        'You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.'
    },
    {
      id: 'payment',
      title: '4. Payments & Billing',
      content: 'Subscriptions are billed in advance. You agree to provide current, complete, and accurate purchase and account information.'
    },
    {
      id: 'termination',
      title: '5. Termination',
      content:
        'We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        <Box sx={{ width: 260, position: 'sticky', top: 100, display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#64748b', mb: 2 }}>TERMS OF SERVICE</Typography>
          <List disablePadding>
            {sections.map((s) => (
              <ListItemButton key={s.id} href={`#${s.id}`} sx={{ borderRadius: radius, mb: 0.5 }}>
                <ListItemText primary={s.title} primaryTypographyProps={{ fontSize: '13px', fontWeight: 600 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Paper elevation={0} sx={{ flex: 1, p: 5, borderRadius: radius, border: '1px solid #e2e8f0' }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Terms of Service
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', mb: 4, display: 'block' }}>
            Last updated: April 11, 2026
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Stack spacing={4}>
            {sections.map((s) => (
              <Box key={s.id} id={s.id}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: '#475569', lineHeight: 1.8 }}>{s.content}</Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};
