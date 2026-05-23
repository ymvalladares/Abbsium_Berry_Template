import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Grid,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Receipt
} from '@mui/icons-material';
import api from '../../services/AxiosService';

const Billings = () => {
  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);

  const [billingData, setBillingData] = useState({
    cardHolder: '',
    expiryDate: '',
    cardType: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    address: '',
    zipCode: ''
  });

  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    api
      .get('order/billing')
      .then(({ data }) => {
        if (data.card) {
          setBillingData({
            cardHolder: data.card.cardHolder || '',
            expiryDate: data.card.expiryDate || '',
            cardType: data.card.cardType || ''
          });
        }
        if (data.address) {
          setBillingAddress({
            name: data.address.name || '',
            email: data.address.email || '',
            country: data.address.country || '',
            city: data.address.city || '',
            address: data.address.address || '',
            zipCode: data.address.zipCode || ''
          });
        }
        if (data.payments) {
          setPaymentHistory(data.payments);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      await api.put('order/billing/address', billingAddress);
    } catch {}
    setSavingAddress(false);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      paid: {
        label: 'Paid',
        color: 'success',
        icon: <CheckCircleIcon sx={{ fontSize: 14 }} />
      },
      pending: {
        label: 'Pending',
        color: 'warning',
        icon: <PendingIcon sx={{ fontSize: 14 }} />
      },
      failed: {
        label: 'Failed',
        color: 'error',
        icon: <ErrorIcon sx={{ fontSize: 14 }} />
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} sx={{ fontWeight: 500, fontSize: '0.75rem' }} />;
  };

  return (
    <Box>
      {/* Payment Method Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: '#EEF2FF', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)' }}>
              <CreditCardIcon sx={{ color: '#6366F1', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Payment Method
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {billingData.cardHolder ? 'Managed securely via Stripe' : 'No payment method on file'}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box>
              {billingData.cardHolder ? (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#FAFAFA', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    {billingData.cardType} ···· {billingData.cardHolder}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                    Expires {billingData.expiryDate}
                  </Typography>
                </Paper>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#FAFAFA', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No card saved yet. Complete a purchase to add a payment method.
                  </Typography>
                </Paper>
              )}

              <Button
                variant="outlined"
                onClick={() => (window.location.href = '/platform/pricing')}
                sx={{
                  textTransform: 'none',
                  borderColor: '#E5E7EB',
                  color: 'text.secondary',
                  '&:hover': { borderColor: '#D1D5DB', bgcolor: '#FAFAFA' }
                }}
              >
                {billingData.cardHolder ? 'Update via Stripe' : 'Add payment method'}
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Billing Address Card */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: '#D1FAE5', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)' }}>
              <AccountBalanceIcon sx={{ color: '#10B981', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Billing Address
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Update your billing address information
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Full Name *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.name}
                placeholder="Enter your full name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.email}
                placeholder="email@example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Street Address *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.address}
                placeholder="Enter your street address"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                City *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.city}
                placeholder="Enter city"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Country *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.country}
                placeholder="Select country"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                ZIP Code *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.zipCode}
                placeholder="Enter ZIP code"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#FAFAFA',
                    '& fieldset': {
                      borderColor: '#E5E7EB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#D1D5DB'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              disabled={savingAddress}
              onClick={() =>
                setBillingAddress({
                  name: '',
                  email: '',
                  country: '',
                  city: '',
                  address: '',
                  zipCode: ''
                })
              }
              sx={{
                textTransform: 'none',
                borderColor: '#E5E7EB',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  bgcolor: '#FAFAFA'
                }
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              disabled={savingAddress}
              onClick={handleSaveAddress}
              sx={{
                textTransform: 'none',
                bgcolor: '#6366F1',
                '&:hover': {
                  bgcolor: '#4F46E5'
                },
                boxShadow: 'none'
              }}
            >
              {savingAddress ? <CircularProgress size={18} sx={{ color: '#FFF' }} /> : 'Update Information'}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Payment History Card */}
      <Card
        elevation={0}
        sx={{
          border: '1px solid #E5E7EB',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: '#FEF3C7', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)' }}>
              <Receipt sx={{ color: '#F59E0B', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Your recent transactions and invoices
              </Typography>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #E5E7EB',
              borderRadius: 1.5,
              overflow: 'hidden'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>Invoice</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.875rem' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((payment, index) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:hover': {
                        bgcolor: '#F9FAFB'
                      },
                      borderBottom: index === paymentHistory.length - 1 ? 'none' : '1px solid #E5E7EB'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                        {payment.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                        {payment.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(payment.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {payment.invoice}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#6B7280',
                          '&:hover': {
                            bgcolor: '#F3F4F6',
                            color: '#374151'
                          }
                        }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Box>
  );
};

export default Billings;
