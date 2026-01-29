import React, { useState } from 'react';
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
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Billings = () => {
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Datos de ejemplo de la tarjeta
  const [cardData] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardNumberMasked: '**** **** **** 4242',
    cardHolder: 'Sofia Rivers',
    expiryDate: '12/26',
    cvv: '123',
    cardType: 'Visa'
  });

  // Datos de billing address
  const [billingAddress] = useState({
    name: 'Sofia Rivers',
    email: 'sofia.rivers@email.com',
    country: 'Germany',
    city: 'Berlin',
    address: 'Hauptstraße 123',
    zipCode: '10115'
  });

  // Datos de ejemplo del historial de pagos
  const [paymentHistory] = useState([
    {
      id: 1,
      date: '2026-01-15',
      description: 'Monthly Subscription',
      amount: '$29.99',
      status: 'paid',
      invoice: 'INV-2026-001'
    },
    {
      id: 2,
      date: '2025-12-15',
      description: 'Monthly Subscription',
      amount: '$29.99',
      status: 'paid',
      invoice: 'INV-2025-012'
    },
    {
      id: 3,
      date: '2025-11-15',
      description: 'Monthly Subscription',
      amount: '$29.99',
      status: 'paid',
      invoice: 'INV-2025-011'
    },
    {
      id: 4,
      date: '2025-10-15',
      description: 'Monthly Subscription',
      amount: '$29.99',
      status: 'failed',
      invoice: 'INV-2025-010'
    },
    {
      id: 5,
      date: '2025-09-15',
      description: 'Monthly Subscription',
      amount: '$29.99',
      status: 'paid',
      invoice: 'INV-2025-009'
    }
  ]);

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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              bgcolor: '#FFCECE',
              p: { xs: 1, sm: 1.5 },
              borderRadius: 2.5,
              display: 'flex',
              mr: { xs: 1.5, sm: 2.5 },
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
            }}
          >
            <CreditCardIcon sx={{ color: '#F60003', fontSize: { xs: 24, sm: 28 } }} />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              Billing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your payment methods and billing information
            </Typography>
          </Box>
        </Box>
      </Box>

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
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCardIcon sx={{ color: '#6366F1', fontSize: 22 }} />
            </Box>
            <Box sx={{ ml: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Payment Method
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Update your payment card details
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Card Number *
              </Typography>
              <TextField
                fullWidth
                value={showCardNumber ? cardData.cardNumber : cardData.cardNumberMasked}
                placeholder="1234 1234 1234 1234"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowCardNumber(!showCardNumber)} edge="end" size="small">
                        {showCardNumber ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
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

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Cardholder Name *
              </Typography>
              <TextField
                fullWidth
                value={cardData.cardHolder}
                placeholder="John Doe"
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

            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Expiry Date *
              </Typography>
              <TextField
                fullWidth
                value={cardData.expiryDate}
                placeholder="MM/YY"
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

            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                CVV *
              </Typography>
              <TextField
                fullWidth
                value={cardData.cvv}
                placeholder="123"
                type="password"
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
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: '#F0FDF4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AccountBalanceIcon sx={{ color: '#10B981', fontSize: 22 }} />
            </Box>
            <Box sx={{ ml: 3 }}>
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
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                bgcolor: '#6366F1',
                '&:hover': {
                  bgcolor: '#4F46E5'
                },
                boxShadow: 'none'
              }}
            >
              Update Information
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
          <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 3 }}>
            Payment History
          </Typography>

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
