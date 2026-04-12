import React from 'react';
import { Box, Typography, Container, Paper, Stack, List, ListItemButton, ListItemText, Divider } from '@mui/material';

const radius = 5;

export const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'intro',
      title: '1. Introduction',
      content:
        'At Abbsium, we value your privacy. This policy explains what information we collect, why we collect it, and how you can update, manage, export, and delete your information.'
    },
    {
      id: 'collection',
      title: '2. Information We Collect',
      content:
        'We collect information to provide better services to all our users. This includes basic account information such as your name, email, and subscription details, as well as technical usage data via cookies.'
    },
    {
      id: 'usage',
      title: '3. How We Use Data',
      content:
        'We use the data we collect for three basic purposes: to operate our business and provide the services we offer, to send communications, and to display advertising.'
    },
    {
      id: 'sharing',
      title: '4. Sharing of Information',
      content:
        'We do not share your personal information with companies, organizations, or individuals outside of Abbsium except in cases of legal necessity or explicit consent.'
    },
    {
      id: 'security',
      title: '5. Security',
      content:
        'We work hard to protect Abbsium and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
        <Box sx={{ width: 260, position: 'sticky', top: 100, display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#64748b', mb: 2 }}>PRIVACY POLICY</Typography>
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
            Privacy Policy
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
