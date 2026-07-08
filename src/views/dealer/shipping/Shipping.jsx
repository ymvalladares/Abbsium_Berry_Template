import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { IconTruck, IconPackage, IconClock } from '@tabler/icons-react';

const Shipping = () => {
  const shipments = [
    { id: 'SHIP-001', order: 'ORD-003', customer: 'Bob Johnson', carrier: 'FedEx', tracking: '1Z999AA10123456784', status: 'In Transit', estimated: '2026-07-05' },
    { id: 'SHIP-002', order: 'ORD-004', customer: 'Alice Williams', carrier: 'UPS', tracking: '1Z999AA10123456785', status: 'Delivered', estimated: '2026-07-01' },
    { id: 'SHIP-003', order: 'ORD-002', customer: 'Jane Smith', carrier: 'USPS', tracking: '1Z999AA10123456786', status: 'Pending', estimated: '2026-07-06' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'In Transit': return 'info';
      case 'Delivered': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%' }}>
      <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
        Shipping Management
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconClock size={40} />
                <Box>
                  <Typography color="textSecondary">Pending Shipments</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconTruck size={40} />
                <Box>
                  <Typography color="textSecondary">In Transit</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconPackage size={40} />
                <Box>
                  <Typography color="textSecondary">Delivered</Typography>
                  <Typography variant="h4">1</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { height: 6 } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Shipment ID</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Carrier</TableCell>
              <TableCell>Tracking Number</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Estimated Delivery</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.id}</TableCell>
                <TableCell>{shipment.order}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell>{shipment.carrier}</TableCell>
                <TableCell>{shipment.tracking}</TableCell>
                <TableCell>
                  <Chip label={shipment.status} color={getStatusColor(shipment.status)} size="small" />
                </TableCell>
                <TableCell>{shipment.estimated}</TableCell>
                <TableCell>
                  <Button size="small">Track</Button>
                  <Button size="small">Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Shipping;
