import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Link, Divider } from '@mui/material';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

const termsData = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content:
      'By accessing or using Abbsium, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, you must immediately discontinue use of our services.'
  },
  {
    id: 'eligibility',
    title: '2. Eligibility & Accounts',
    content:
      'You must be at least 18 years old to use Abbsium. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete registration information.'
  },
  {
    id: 'billing',
    title: '3. Payments & Subscriptions',
    content:
      'All subscription fees are billed in advance on a recurring basis. You agree to keep your payment information current. Failure to provide valid payment will result in account suspension. Subscriptions are non-refundable unless otherwise required by applicable law.'
  },
  {
    id: 'conduct',
    title: '4. Acceptable Use',
    content:
      'You agree not to use our platform for any unlawful activities, to transmit viruses, to scrape data without authorization, or to disrupt the integrity of our services. We reserve the right to monitor usage for compliance.'
  },
  {
    id: 'ip',
    title: '5. Intellectual Property',
    content:
      'All content, features, and functionality of Abbsium are the exclusive property of Abbsium and its licensors. You are granted a limited, non-exclusive, non-transferable license to use our platform strictly for personal or business use in accordance with these terms.'
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    content:
      'To the maximum extent permitted by law, Abbsium shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the service. Our total liability is limited to the amount paid by you for the service in the preceding 6 months.'
  },
  {
    id: 'termination',
    title: '7. Termination',
    content:
      'We reserve the right to suspend or terminate your access to the platform at any time, without prior notice, if we believe you have breached these Terms. Upon termination, your right to use the service will immediately cease.'
  },
  {
    id: 'governing',
    title: '8. Governing Law',
    content:
      'These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.'
  }
];

export const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    termsData.forEach(({ id }) => {
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
        {/* Navigation Sidebar */}
        <Box sx={{ width: 240, position: 'sticky', top: 120, display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: 'text.secondary', letterSpacing: 2, mb: 3 }}>
            TABLE OF CONTENTS
          </Typography>
          <Stack spacing={1.5}>
            {termsData.map((s) => (
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

        {/* Terms Content */}
        <Box sx={{ flex: 1, maxWidth: '720px' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.5 }}>
            Terms of Service
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6 }}>
            Last updated: June 7, 2026. Please read these terms carefully before accessing Abbsium.
          </Typography>

          <Divider sx={{ mb: 8 }} />

          <Stack spacing={6}>
            {termsData.map((s) => (
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
              Legal Inquiries
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              For any questions regarding our terms, please contact our legal department at
              <Link href="mailto:legal@abbsium.com" sx={{ ml: 0.5 }}>
                legal@abbsium.com
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
