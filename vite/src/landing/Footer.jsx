import React from 'react';
import { Container, Box, Typography, Link, Grid, Stack } from '@mui/material';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = ({
  brandName = 'Abbsium',
  description = 'Modern platform designed for small businesses that want to grow fast and without complications.',
  abbsiumMode = false
}) => {
  const currentYear = new Date().getFullYear();

  const colors = abbsiumMode
    ? {
        bg: 'linear-gradient(180deg, #f8fafc, #eef2ff)',
        logoGradient: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderColor: 'rgba(102,126,234,.2)',
        textPrimary: '#334155',
        textSecondary: '#475569',
        textTertiary: '#64748b',
        hoverColor: '#667eea',
        boxShadow: 'rgba(102,126,234,.45)'
      }
    : {
        bg: 'linear-gradient(180deg, #f8fafc, #eef2ff)',
        logoGradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderColor: 'rgba(99,102,241,.1)',
        textPrimary: '#334155',
        textSecondary: '#475569',
        textTertiary: '#64748b',
        hoverColor: '#6366f1',
        boxShadow: 'rgba(99,102,241,.45)'
      };

  const footerLinks = [
    { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Roadmap'] },
    { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
    { title: 'Resources', links: ['Documentation', 'API', 'Community', 'Support'] },
    { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'License'] }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: colors.bg,
        color: colors.textPrimary,
        borderTop: `1px solid ${colors.borderColor}`,
        pt: { xs: 6, sm: 8, md: 10 },
        pb: { xs: 4, sm: 6, md: 8 },
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, sm: 8, md: 8 }} sx={{ mb: { xs: 8, md: 10 } }}>
          {/* LEFT COLUMN BIGGER */}
          <Grid size={{ xs: 12, sm: 12, md: 5 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: colors.logoGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 6px 16px ${colors.boxShadow}`,
                    flexShrink: 0
                  }}
                >
                  <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>{brandName.charAt(0)}</Typography>
                </Box>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    background: colors.logoGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  {brandName}
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: colors.textSecondary,
                  fontSize: '0.95rem',
                  lineHeight: 1.8
                }}
              >
                {description}
              </Typography>

              <Stack direction="row" spacing={1.5}>
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    sx={{
                      color: colors.textTertiary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        color: colors.hoverColor,
                        bgcolor: abbsiumMode ? 'rgba(102,126,234,.1)' : 'rgba(99,102,241,.1)'
                      }
                    }}
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* LINK COLUMNS */}
          {footerLinks.map((group, i) => (
            <Grid key={i} size={{ xs: 6, sm: 6, md: i === 3 ? 1 : 2 }}>
              <Stack spacing={3}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: '#1a202c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  {group.title}
                </Typography>

                <Stack spacing={2}>
                  {group.links.map((link) => (
                    <Link
                      key={link}
                      href="#"
                      sx={{
                        color: colors.textSecondary,
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        '&:hover': { color: colors.hoverColor, pl: 0.5 }
                      }}
                    >
                      {link}
                    </Link>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height: '1px', bgcolor: colors.borderColor, mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 3, sm: 2 }
          }}
        >
          <Typography sx={{ color: colors.textTertiary, fontSize: '0.85rem' }}>
            © {currentYear} {brandName}. All rights reserved.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 3 }}>
            <Link href="#" sx={{ color: colors.textTertiary, fontSize: '0.85rem', '&:hover': { color: colors.hoverColor } }}>
              Privacy
            </Link>
            <Link href="#" sx={{ color: colors.textTertiary, fontSize: '0.85rem', '&:hover': { color: colors.hoverColor } }}>
              Terms
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
