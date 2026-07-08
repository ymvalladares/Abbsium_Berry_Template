import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Stack, useTheme, alpha } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useDealerSetup } from 'contexts/DealerSetupContext';
import DealerSetupModal from 'ui-component/DealerSetupModal';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';

const StatsCard = ({ title, value, subtitle, trendValue, iconBgColor, icon: Icon }) => {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        borderRadius: 3,
        bgcolor: 'background.paper'
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.45rem', md: '1.75rem' },
                color: 'text.heading',
                lineHeight: 1.1
              }}
            >
              {value}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.3 }}>{title}</Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.3 }}>{subtitle}</Typography>
            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                <TrendingUpIcon sx={{ fontSize: 15, color: 'success.main' }} />
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'success.main' }}>
                  {trendValue} this week
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: '#fff', fontSize: 21 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function DealerDashboard() {
  const navigate = useNavigate();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { dealer, hasDealer, dealerLoading, handleDealerCreated: onDealerCreated } = useDealerSetup();
  const theme = useTheme();
  const [showSetupModal, setShowSetupModal] = useState(!hasDealer);

  useEffect(() => {
    if (hasDealer) {
      setShowSetupModal(false);
    } else if (!dealerLoading) {
      setShowSetupModal(true);
    }
  }, [hasDealer, dealerLoading]);

  if (dealerLoading) return null;

  const handleCloseSetup = () => setShowSetupModal(false);
  const handleSuccess = (newDealer) => {
    onDealerCreated(newDealer);
    setShowSetupModal(false);
  };

  const handleNavigate = (path) => {
    if (!hasDealer) {
      setShowSetupModal(true);
      return;
    }
    navigate(path);
  };

  const statsCards = [
    {
      id: 1,
      value: '0',
      title: 'Total Vehicles',
      subtitle: 'In inventory',
      trendValue: '12%',
      iconBgColor: theme.vars.palette.primary.main,
      icon: DirectionsCarIcon
    },
    {
      id: 2,
      value: '0',
      title: 'Available',
      subtitle: 'Ready to sell',
      trendValue: '8%',
      iconBgColor: theme.vars.palette.success.main,
      icon: TrendingUpIcon
    },
    {
      id: 3,
      value: '$0',
      title: 'Inventory Value',
      subtitle: 'Total stock value',
      trendValue: '15%',
      iconBgColor: theme.vars.palette.secondary.main,
      icon: AttachMoneyIcon
    },
    {
      id: 4,
      value: '0',
      title: 'Total Views',
      subtitle: 'This month',
      trendValue: '24%',
      iconBgColor: theme.vars.palette.warning.main,
      icon: VisibilityIcon
    }
  ];

  return (
    <>
      <DealerSetupModal open={showSetupModal} onClose={handleCloseSetup} onSuccess={handleSuccess} />

      <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%' }}>
      {/* Dealer Header */}
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          mb: 3,
          background: `linear-gradient(135deg, ${alpha('#6366f1', 0.08)}, ${alpha('#8b5cf6', 0.05)})`,
          bgcolor: 'background.paper'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' }, color: 'text.primary' }}>
                Welcome to {dealer?.name || 'Your Dealership'}
              </Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.25 }}>
                Domain: {dealer?.domain} · Status: {dealer?.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleNavigate('/platform/dealer/inventory/manage')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none' },
                fontSize: '0.85rem',
                px: 2
              }}
            >
              Add Vehicle
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'text.primary', mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DirectionsCarIcon />}
                onClick={() => handleNavigate('/platform/dealer/inventory/manage')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  justifyContent: 'flex-start',
                  borderColor: isDark ? '#374151' : '#e2e8f0',
                  '&:hover': { borderColor: '#6366f1', bgcolor: alpha('#6366f1', 0.05) }
                }}
              >
                Manage Inventory
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleNavigate('/platform/dealer/inventory/manage')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  justifyContent: 'flex-start',
                  borderColor: isDark ? '#374151' : '#e2e8f0',
                  '&:hover': { borderColor: '#6366f1', bgcolor: alpha('#6366f1', 0.05) }
                }}
              >
                Add New Vehicle
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={() => handleNavigate('/platform/dealer/inventory/manage')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  py: 1.5,
                  justifyContent: 'flex-start',
                  borderColor: isDark ? '#374151' : '#e2e8f0',
                  '&:hover': { borderColor: '#6366f1', bgcolor: alpha('#6366f1', 0.05) }
                }}
              >
                View All Vehicles
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
    </>
  );
}
