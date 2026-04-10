import React from 'react';
import { Box, Typography, Grid, Paper, Stack, alpha, Avatar } from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import OrdersFilters from './OrdersFilters';

const StatCard = ({ title, value, trend, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 3, // Cambiado a 3px
      border: '1px solid #e2e8f0',
      bgcolor: '#fff',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    {/* Línea de acento superior opcional para look pro */}
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', bgcolor: color }} />

    <Stack direction="row" justifyContent="space-between">
      <Box>
        <Typography sx={{ color: '#64748b', fontWeight: 800, fontSize: '11px', letterSpacing: '0.02em' }}>{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.5 }}>
          {value}
        </Typography>
        <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '11px', mt: 1 }}>{trend}</Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '3px', // También 3px
          bgcolor: alpha(color, 0.05),
          border: `1px solid ${alpha(color, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}
      >
        {icon}
      </Box>
    </Stack>
  </Paper>
);

const Orders = () => {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Orders" value="1,284" trend="+12% vs last month" icon={<ShoppingBagIcon />} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Pending Process" value="43" trend="Avg. 24m wait" icon={<AccessTimeIcon />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Revenue Today" value="$4,290.50" trend="+5% vs yesterday" icon={<TrendingUpIcon />} color="#10b981" />
        </Grid>
      </Grid>

      {/* Filters Section */}
      <OrdersFilters />

      {/* Table Section (Donde irán los datos) */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          minHeight: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography color="text.secondary">Order data will be rendered here...</Typography>
      </Paper>
    </Box>
  );
};

export default Orders;
