import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, CircularProgress, Stack } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import JoinRightIcon from '@mui/icons-material/JoinRight';
import { useNavigate } from 'react-router-dom';
import api from '../services/AxiosService';
import { useAuth } from '../contexts/AuthContext';

const PriceCardsComp = () => {
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [annual, setAnnual] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const pricingPlans = [
    {
      id: 1,
      name: 'Starter',
      price: annual ? 150 : Number((150 / 0.9).toFixed(2)),
      mode: 'payment',
      description: 'Perfect for entrepreneurs launching their first professional website.',
      buttonLabel: 'Get started',
      buttonVariant: 'outlined',
      features: ['1 custom website (5 pages)', 'Mobile responsive design', 'Basic SEO setup', '30-day support'],
      isHighlighted: false
    },
    {
      id: 2,
      name: 'Professional',
      price: annual ? 24.99 : Number((24.99 / 0.9).toFixed(2)),
      mode: 'subscription',
      badge: 'Most Popular',
      description: 'Ideal for growing businesses that need a powerful online presence.',
      buttonLabel: 'Start free trial',
      buttonVariant: 'contained',
      features: [
        'Up to 5 page custom website',
        'Advanced UI/UX design',
        'Full SEO optimization',
        'Monthly reports',
        '24/7 priority support'
      ],
      isHighlighted: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: annual ? 39.99 : Number((39.99 / 0.9).toFixed(2)),
      mode: 'subscription',
      description: 'Full-scale solution for companies that demand custom development.',
      buttonLabel: 'Contact sales',
      buttonVariant: 'dark',
      features: ['Everything in Professional', 'Unlimited pages', 'Custom web app dev', 'E-commerce integration', 'Dedicated manager'],
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
      console.error('Error:', err);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <Box sx={{ py: 10 }}>
      <Container maxWidth="lg">
        {/* --- HEADER --- */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          {/* 1. EYEBROW: Contexto rápido */}
          <Typography
            sx={{
              color: '#6366f1',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontSize: '12px',
              mb: 2
            }}
          >
            Transparent Pricing
          </Typography>

          {/* 2. MAIN TITLE */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.8rem' },
              color: '#0f172a',
              mb: 2,
              letterSpacing: '-2.5px',
              lineHeight: 1
            }}
          >
            Ready to{' '}
            <Box component="span" sx={{ color: '#6366f1' }}>
              scale?
            </Box>
          </Typography>

          {/* 3. SUBTITLE: Valor añadido */}
          <Typography
            sx={{
              fontSize: '1.1rem',
              color: '#64748b',
              //maxWidth: '600px',
              mx: 'auto',
              mb: 5,
              lineHeight: 1.6
            }}
          >
            Choose the perfect plan for your team. From early-stage startups to global enterprises, we provide the infrastructure to power
            your growth.
          </Typography>

          {/* 4. BILLING SWITCH - Estilo Consola Pro */}
          <Stack alignItems="center" spacing={2}>
            <Box
              sx={{
                display: 'inline-flex',
                p: '5px',
                bgcolor: '#0f172a',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)'
              }}
            >
              <Button
                onClick={() => setAnnual(false)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: !annual ? '#fff' : '#94a3b8',
                  bgcolor: !annual ? '#6366f1' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { bgcolor: !annual ? '#6366f1' : 'rgba(255,255,255,0.08)' }
                }}
              >
                Monthly
              </Button>
              <Button
                onClick={() => setAnnual(true)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: annual ? '#fff' : '#94a3b8',
                  bgcolor: annual ? '#6366f1' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { bgcolor: annual ? '#6366f1' : 'rgba(255,255,255,0.08)' }
                }}
              >
                Annually
                <Box
                  component="span"
                  sx={{
                    ml: 1.5,
                    fontSize: '10px',
                    fontWeight: 900,
                    bgcolor: '#22c55e',
                    color: '#fff',
                    px: 1,
                    py: 0.3,
                    borderRadius: '6px',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  SAVE 20%
                </Box>
              </Button>
            </Box>

            {/* 5. TRUST FOOTER: Para reducir la fricción de compra */}
            <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>
              No hidden fees. Change or cancel your plan at any time.
            </Typography>
          </Stack>
        </Box>
        {/* --- CARDS --- */}
        <Grid container spacing={4} alignItems="center">
          {pricingPlans.map((plan) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
              <Card
                sx={{
                  borderRadius: '24px',
                  border: plan.isHighlighted ? '2px solid #6366f1' : '1px solid rgba(15, 23, 42, 0.1)',
                  bgcolor: plan.isHighlighted ? '#0f172a' : '#fff',
                  color: plan.isHighlighted ? '#fff' : '#0f172a',
                  boxShadow: plan.isHighlighted ? '0 30px 60px -12px rgba(99,102,241,0.3)' : '0 10px 30px rgba(0,0,0,0.04)',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  overflow: 'visible',
                  '&:hover': { transform: 'translateY(-12px)' }
                }}
              >
                {plan.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -15,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: '#6366f1',
                      color: '#fff',
                      px: 2,
                      py: 0.5,
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      zIndex: 10
                    }}
                  >
                    {plan.badge}
                  </Box>
                )}

                <CardContent sx={{ p: 4 }}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: plan.isHighlighted ? '#818cf8' : '#6366f1',
                      mb: 2,
                      textTransform: 'uppercase'
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                    <Typography sx={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>${plan.price}</Typography>
                    <Typography sx={{ ml: 1, opacity: 0.6, fontSize: '1rem' }}>{plan.mode === 'subscription' ? '/mo' : '/once'}</Typography>
                  </Box>

                  <Typography sx={{ fontSize: '15px', mb: 4, opacity: 0.8, minHeight: '45px' }}>{plan.description}</Typography>

                  <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {plan.features.map((feat, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: plan.isHighlighted ? 'rgba(99,102,241,0.2)' : 'rgba(34,197,94,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CheckIcon sx={{ fontSize: 14, color: plan.isHighlighted ? '#818cf8' : '#22c55e' }} />
                        </Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{feat}</Typography>
                      </Stack>
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    onClick={() => handlePlanClick(plan)}
                    disabled={loadingPlanId === plan.id}
                    variant="contained"
                    endIcon={
                      loadingPlanId === plan.id ? (
                        <CircularProgress size={18} />
                      ) : isAuthenticated ? (
                        <JoinRightIcon />
                      ) : (
                        <LockOutlinedIcon />
                      )
                    }
                    sx={{
                      py: 2,
                      borderRadius: '14px',
                      textTransform: 'none',
                      fontWeight: 800,
                      fontSize: '1rem',
                      transition: '0.3s',
                      bgcolor: plan.isHighlighted ? '#fff' : '#0f172a',
                      color: plan.isHighlighted ? '#0f172a' : '#fff',
                      '&:hover': {
                        bgcolor: plan.isHighlighted ? '#e2e8f0' : '#1e293b',
                        transform: 'scale(1.02)'
                      }
                    }}
                  >
                    {!isAuthenticated ? 'Sign in to buy' : plan.buttonLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        '{/* --- TYPOGRAPHY AÑADIDA ABAJO DE LAS CARDS --- */}
        <Typography
          align="center"
          sx={{
            mt: 8,
            fontSize: '14px',
            color: '#64748b',
            fontWeight: 500,
            letterSpacing: '0.2px',
            fontStyle: 'italic'
          }}
        >
          All plans include SSL certificate, hosting setup assistance, and a 7-day money-back guarantee.
        </Typography>
      </Container>
    </Box>
  );
};

export default PriceCardsComp;
