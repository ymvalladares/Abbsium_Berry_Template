import React, { useState, useContext } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import api from '../services/AxiosService';
import { useAuth } from '../contexts/AuthContext'; // ajusta el path

const PriceCardsComp = () => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [annual, setAnnual] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pricingPlans = [
    {
      id: 1,
      name: 'Starter',
      price: 150,
      mode: 'payment',
      badge: null,
      description: 'Perfect for entrepreneurs and small businesses launching their first professional website.',
      buttonLabel: 'Get started',
      buttonColor: 'outlined',
      features: [
        '1 custom website (up to 5 pages)',
        'Mobile responsive design',
        'Basic SEO setup',
        'Contact form integration',
        '1 round of revisions',
        '30-day post-launch support'
      ],
      isHighlighted: false
    },
    {
      id: 2,
      name: 'Professional',
      price: 24.99,
      mode: 'subscription',
      badge: 'Most Popular',
      description: 'Ideal for growing businesses that need a powerful online presence with ongoing support.',
      buttonLabel: 'Start free 14-day trial',
      buttonColor: 'primary',
      features: [
        'Up to 15-page custom website',
        'Advanced UI/UX design',
        'Full SEO optimization',
        'CMS integration (blog, portfolio)',
        'Google Analytics setup',
        'Monthly performance reports',
        '24/7 priority support'
      ],
      isHighlighted: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 49.99,
      mode: 'subscription',
      badge: null,
      description: 'Full-scale solution for companies that demand custom development and dedicated expertise.',
      buttonLabel: 'Contact sales',
      buttonColor: 'dark',
      features: [
        'Everything in Professional',
        'Unlimited pages & revisions',
        'Custom web app development',
        'E-commerce integration',
        'API & third-party integrations',
        'Dedicated project manager',
        'Automatic backups & uptime monitoring'
      ],
      isHighlighted: false
    }
  ];

  const handlePlanClick = async (plan) => {
    if (!isAuthenticated) {
      navigate('/authenticate');
      return;
    }

    setLoadingPlanId(plan.id);
    try {
      const { data } = await api.post('order/create-checkout-session', {
        amount: plan.price,
        serviceType: plan.name,
        mode: plan.mode
      });
      window.location.href = data.sessionUrl;
    } catch (err) {
      console.error('Error creating checkout session:', err);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              px: '14px',
              py: '6px',
              borderRadius: '100px',
              bgcolor: '#eef2ff',
              border: '1px solid #c7d2fe',
              mb: 3
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#6366f1' }} />
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#6366f1', letterSpacing: '.08em', textTransform: 'uppercase' }}>
              Transparent pricing
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.2rem' },
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-1.5px',
              lineHeight: 1.1,
              mb: 2
            }}
          >
            Websites that grow{' '}
            <Box
              component="span"
              sx={{
                position: 'relative',
                display: 'inline-block',
                color: '#6366f1',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  width: '100%',
                  height: '3px',
                  bgcolor: '#c7d2fe',
                  borderRadius: '2px'
                }
              }}
            >
              your business
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', sm: '1.1rem' },
              color: '#64748b',
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.7,
              mb: 5
            }}
          >
            From launch-ready landing pages to fully custom web applications — pick the plan that fits where you are today.
          </Typography>

          {/* Billing toggle */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              p: '6px',
              borderRadius: '12px',
              bgcolor: '#f1f5f9',
              border: '1px solid #e2e8f0'
            }}
          >
            <Box
              onClick={() => setAnnual(false)}
              sx={{
                px: '16px',
                py: '7px',
                borderRadius: '8px',
                cursor: 'pointer',
                bgcolor: !annual ? '#fff' : 'transparent',
                boxShadow: !annual ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all .2s'
              }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: !annual ? '#0f172a' : '#94a3b8' }}>Monthly</Typography>
            </Box>
            <Box
              onClick={() => setAnnual(true)}
              sx={{
                px: '16px',
                py: '7px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                bgcolor: annual ? '#fff' : 'transparent',
                boxShadow: annual ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all .2s'
              }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: annual ? '#0f172a' : '#94a3b8' }}>Annually</Typography>
              <Box sx={{ px: '7px', py: '2px', borderRadius: '6px', bgcolor: '#dcfce7', border: '1px solid #bbf7d0' }}>
                <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>25% OFF</Typography>
              </Box>
            </Box>
          </Box>

          {/* Auth notice — only shown when not authenticated */}
          {!isAuthenticated && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                mt: 3,
                px: '14px',
                py: '8px',
                borderRadius: '10px',
                bgcolor: '#fffbeb',
                border: '1px solid #fde68a',
                ml: 1
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: '14px', color: '#d97706' }} />
              <Typography sx={{ fontSize: '12.5px', color: '#92400e', fontWeight: 500 }}>
                You need to{' '}
                <Box
                  component="span"
                  onClick={() => navigate('/authenticate')}
                  sx={{
                    fontWeight: 700,
                    color: '#d97706',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '2px'
                  }}
                >
                  sign in
                </Box>{' '}
                to purchase a plan.
              </Typography>
            </Box>
          )}
        </Box>

        {/* ── Cards ──────────────────────────────────────────────────── */}
        <Grid container spacing={{ xs: 3, md: 3 }} alignItems="stretch">
          {pricingPlans.map((plan) => {
            const isLoading = loadingPlanId === plan.id;
            const isLocked = !isAuthenticated;

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: plan.isHighlighted ? '2px solid #6366f1' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    boxShadow: plan.isHighlighted ? '0 12px 40px rgba(99,102,241,0.18)' : '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    bgcolor: '#fff',
                    position: 'relative',
                    overflow: 'visible',
                    opacity: isLocked ? 0.82 : 1,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: plan.isHighlighted ? '0 24px 48px rgba(99,102,241,0.22)' : '0 10px 24px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {plan.badge && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '-13px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        px: '14px',
                        py: '4px',
                        bgcolor: '#6366f1',
                        borderRadius: '100px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <Typography
                        sx={{ fontSize: '11px', fontWeight: 700, color: '#fff', letterSpacing: '.06em', textTransform: 'uppercase' }}
                      >
                        {plan.badge}
                      </Typography>
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      p: '28px',
                      '&:last-child': { pb: '28px' }
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#6366f1',
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        mb: '10px'
                      }}
                    >
                      {plan.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '4px', mb: '6px' }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#64748b', mb: '6px' }}>$</Typography>
                      <Typography sx={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-2px' }}>
                        {plan.price % 1 === 0 ? plan.price : plan.price.toFixed(2)}
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#94a3b8', mb: '6px', fontWeight: 400 }}>
                        {plan.mode === 'payment' ? 'one-time' : '/ mo'}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.6, mb: '20px', minHeight: '52px' }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ height: '1px', bgcolor: '#f1f5f9', mb: '20px' }} />

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', mb: '24px' }}>
                      {plan.features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              flexShrink: 0,
                              mt: '1px',
                              bgcolor: plan.isHighlighted ? '#eef2ff' : '#f0fdf4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <CheckIcon sx={{ fontSize: '11px', color: plan.isHighlighted ? '#6366f1' : '#16a34a' }} />
                          </Box>
                          <Typography sx={{ fontSize: '13.5px', color: '#374151', fontWeight: 400, lineHeight: 1.5 }}>{feature}</Typography>
                        </Box>
                      ))}
                    </Box>

                    <Button
                      fullWidth
                      disabled={isLoading}
                      onClick={() => handlePlanClick(plan)}
                      sx={{
                        py: '13px',
                        fontSize: '13.5px',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '10px',
                        gap: '6px',
                        border: plan.buttonColor === 'outlined' ? '1.5px solid #cbd5e0' : 'none',
                        color: plan.buttonColor === 'outlined' ? '#6366f1' : '#fff',
                        bgcolor: plan.buttonColor === 'outlined' ? 'transparent' : plan.buttonColor === 'primary' ? '#6366f1' : '#0f172a',
                        '&:hover': {
                          bgcolor: plan.buttonColor === 'outlined' ? '#f5f3ff' : plan.buttonColor === 'primary' ? '#4f46e5' : '#1e293b',
                          borderColor: plan.buttonColor === 'outlined' ? '#6366f1' : 'transparent'
                        },
                        '&:disabled': { opacity: 0.65 },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isLoading ? (
                        <CircularProgress size={20} sx={{ color: plan.buttonColor === 'outlined' ? '#6366f1' : '#fff' }} />
                      ) : (
                        <>
                          {isLocked && <LockOutlinedIcon sx={{ fontSize: '15px' }} />}
                          {isLocked ? 'Sign in to purchase' : plan.buttonLabel}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Typography sx={{ fontSize: '13px', color: '#94a3b8' }}>
            All plans include SSL certificate, hosting setup assistance, and a 7-day money-back guarantee.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PriceCardsComp;
