import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Link, Divider } from '@mui/material';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

const policyData = [
  {
    id: 'intro',
    title: '1. Introduction',
    content:
      'At Abbsium, your privacy is our priority. This policy describes how we collect, use, and protect your personal data when you use our platform. By using our services, you consent to the data practices described herein.'
  },
  {
    id: 'collection',
    title: '2. Data We Collect',
    content:
      'We collect information to operate efficiently: (a) Personal identifiers: Name, email, and billing details. (b) Usage data: IP address, browser type, and interactions with our services via cookies and similar technologies. (c) Content you provide: Any data or files you upload to our platform.'
  },
  {
    id: 'use',
    title: '3. How We Use Information',
    content:
      'We use your data to: (a) Provide and maintain our services. (b) Improve user experience through analytics. (c) Communicate important updates, security alerts, and support messages. (d) Comply with legal obligations and enforce our terms of service.'
  },
  {
    id: 'sharing',
    title: '4. Data Sharing',
    content:
      'We do not sell your personal data. We only share information with third-party service providers who assist us in operating our platform (e.g., cloud hosting, payment processing) under strict confidentiality agreements, or when required by law.'
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    content:
      'We use cookies to enhance your experience. These technologies allow us to remember your preferences and analyze traffic. You can manage your cookie preferences through your browser settings.'
  },
  {
    id: 'rights',
    title: '6. Your Rights',
    content:
      'Depending on your location, you have the right to: (a) Access your personal data. (b) Correct inaccurate information. (c) Request deletion of your data. (d) Object to certain processing activities. Contact us at privacy@abbsium.com to exercise these rights.'
  },
  {
    id: 'security',
    title: '7. Data Security',
    content:
      'We implement industry-standard encryption and security measures to protect your data. However, no transmission method is 100% secure; therefore, we cannot guarantee absolute security.'
  }
];

export const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    policyData.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />
      <Box sx={{ pt: { xs: 10, sm: 12 } }}>
        <Container maxWidth="lg" sx={{ py: 10, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', gap: { xs: 0, md: 16 }, alignItems: 'flex-start' }}>
        {/* Navigation */}
        <Box sx={{ width: 240, position: 'sticky', top: 120, display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary', letterSpacing: 2, mb: 3 }}>
            TABLE OF CONTENTS
          </Typography>
          <Stack spacing={1.5}>
            {policyData.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                underline="none"
                sx={{
                  color: activeSection === s.id ? 'primary.main' : 'text.secondary',
                  fontWeight: activeSection === s.id ? 600 : 400,
                  fontSize: '0.9rem',
                  transition: 'color 0.3s ease',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {s.title}
              </Link>
            ))}
          </Stack>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, maxWidth: '720px' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.5 }}>
            Privacy Policy
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
            Last updated: June 7, 2026. This policy governs your use of Abbsium and its associated services.
          </Typography>

          <Divider sx={{ mb: 8 }} />

          <Stack spacing={6}>
            {policyData.map((s) => (
              <Box key={s.id} id={s.id} sx={{ scrollMarginTop: 100 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
                  {s.title}
                </Typography>
                <Typography sx={{ color: '#4a4a4a', lineHeight: 1.8, fontSize: '1.05rem' }}>{s.content}</Typography>
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 10, p: 4, bgcolor: '#f8fafc', borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Questions?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              If you have any questions regarding this policy, please reach out to our team at
              <Link href="mailto:privacy@abbsium.com" sx={{ ml: 0.5 }}>
                privacy@abbsium.com
              </Link>
              .
            </Typography>
          </Box>
        </Box>
      </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};
