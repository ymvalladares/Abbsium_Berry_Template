import { useState, useEffect, useCallback } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useTheme, useMediaQuery } from '@mui/material';
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
  CircularProgress,
  Divider,
  Stack,
  Avatar,
  Tooltip,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Receipt,
  OpenInNew as OpenInNewIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Sync as SyncIcon,
  EventNote as EventNoteIcon,
  ReceiptLong as ReceiptLongIcon
} from '@mui/icons-material';
import api from '../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

const Billings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();
  const [tab, setTab] = useState(0);

  const [billingData, setBillingData] = useState({
    cardHolder: '',
    expiryDate: '',
    cardType: '',
    last4: ''
  });

  const [billingAddress, setBillingAddress] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    address: '',
    zipCode: ''
  });

  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [stripeInvoices, setStripeInvoices] = useState([]);
  const [stripeLoading, setStripeLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('order/user-payments');
      if (data.subscriptions) setSubscriptions(data.subscriptions);
      if (data.payments) setPayments(data.payments);
      if (data.totalSpent !== undefined) setTotalSpent(data.totalSpent);
    } catch (err) {
      console.error('Failed to fetch user payments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStripeInvoices = useCallback(async () => {
    setStripeLoading(true);
    try {
      const { data } = await api.get('order/stripe-invoices');
      if (data.invoices) setStripeInvoices(data.invoices);
      if (data.totalSpent !== undefined && data.totalSpent > totalSpent) setTotalSpent(data.totalSpent);
    } catch (err) {
      console.error('Failed to fetch Stripe invoices:', err);
    } finally {
      setStripeLoading(false);
    }
  }, [totalSpent]);

  useEffect(() => {
    fetchData();
    fetchStripeInvoices();
  }, [fetchData, fetchStripeInvoices]);

  useEffect(() => {
    if (payments.length > 0) return;
    api
      .get('order/billing')
      .then(({ data }) => {
        if (data.card) {
          setBillingData({
            cardHolder: data.card.cardHolder || '',
            expiryDate: data.card.expiryDate || '',
            cardType: data.card.cardType || '',
            last4: data.card.last4 || ''
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
      })
      .catch(() => {});
  }, [payments]);

  const handleSync = async () => {
    if (subscriptions.length === 0) {
      notify.warning('No active subscription to sync', 'Nothing to Sync');
      return;
    }
    setSyncing(true);
    try {
      const promises = subscriptions.map((sub) => api.post(`order/sync-payments/${sub.orderId}`));
      const results = await Promise.all(promises);
      const totalSynced = results.reduce((sum, r) => sum + (r.data.syncedCount || 0), 0);
      if (totalSynced > 0) {
        notify.success(`Synced ${totalSynced} missing payment(s)`, 'Sync Complete');
        fetchData();
      } else {
        notify.info('All payments are up to date', 'No Missing Payments');
      }
    } catch (err) {
      notify.error('Failed to sync payments', 'Sync Error');
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    try {
      await api.put('order/billing/address', billingAddress);
      notify.success('Billing address updated successfully', 'Address Saved');
    } catch {
      notify.error('Failed to update billing address', 'Update Failed');
    }
    setSavingAddress(false);
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      paid: { label: 'Paid', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon sx={{ fontSize: 14 }} /> },
      failed: { label: 'Failed', color: 'error', icon: <ErrorIcon sx={{ fontSize: 14 }} /> },
      suspended: { label: 'Suspended', color: 'error', icon: <ErrorIcon sx={{ fontSize: 14 }} /> }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const chipStyles = {
      paid: { bgcolor: isDark ? 'rgba(34, 197, 94, 0.2)' : undefined, color: isDark ? '#4ade80' : undefined, border: isDark ? '1px solid rgba(34, 197, 94, 0.3)' : undefined },
      pending: { bgcolor: isDark ? 'rgba(251, 191, 36, 0.2)' : undefined, color: isDark ? '#fbbf24' : undefined, border: isDark ? '1px solid rgba(251, 191, 36, 0.3)' : undefined },
      failed: { bgcolor: isDark ? 'rgba(239, 68, 68, 0.2)' : undefined, color: isDark ? '#f87171' : undefined, border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : undefined },
      suspended: { bgcolor: isDark ? 'rgba(239, 68, 68, 0.2)' : undefined, color: isDark ? '#f87171' : undefined, border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : undefined }
    };
    const style = chipStyles[status] || chipStyles.pending;
    return <Chip label={config.label} color={config.color} size="small" icon={config.icon} sx={{ fontWeight: 500, fontSize: '0.75rem', bgcolor: style.bgcolor, color: style.color, border: style.border, '& .MuiChip-icon': { color: 'inherit' } }} />;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return `${(currency || 'USD').toUpperCase()} ${Number(amount || 0).toFixed(2)}`;
  };

  const subscriptionPayments = payments.filter((p) => p.description?.toLowerCase().includes('subscription'));
  const oneTimePayments = payments.filter((p) => !p.description?.toLowerCase().includes('subscription'));

  return (
    <Box>
      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <Card elevation={0} sx={{ mb: 3, border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ bgcolor: isDark ? '#1e1b4b' : '#EEF2FF', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)' }}>
                <EventNoteIcon sx={{ color: '#6366F1', fontSize: 20 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                  Active Subscriptions
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Your current active plans
                </Typography>
              </Box>
              <Tooltip title="Sync missing payments from Stripe">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={syncing ? <CircularProgress size={16} /> : <SyncIcon sx={{ fontSize: 16 }} />}
                  onClick={handleSync}
                  disabled={syncing}
                  sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
                >
                  Sync Payments
                </Button>
              </Tooltip>
            </Box>

            <Grid container spacing={2}>
              {subscriptions.map((sub, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: isDark ? '#0f172a' : '#FAFAFA', borderRadius: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                          {sub.serviceType}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {sub.planMode || 'Standard'}
                        </Typography>
                      </Box>
                      <Chip label={sub.status} size="small" color={sub.status === 'Completed' ? 'success' : 'warning'} sx={{ fontWeight: 600, fontSize: '0.65rem' }} />
                    </Stack>
                    <Divider sx={{ mb: 1.5, borderColor: isDark ? '#374151' : '#e5e7eb' }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Amount</Typography>
                        <Typography variant="body2" fontWeight={700} color="text.primary">{formatCurrency(sub.amount, sub.currency)}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">Next billing</Typography>
                        <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.8rem' }}>
                          {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Card>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: isDark ? '#064e3b' : '#D1FAE5', p: 1.2, borderRadius: 2.5 }}>
                <MoneyIcon sx={{ color: '#10B981', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Total Spent</Typography>
                <Typography variant="h6" fontWeight={800} sx={{ color: '#10B981' }}>{formatCurrency(totalSpent)}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: isDark ? '#1e1b4b' : '#EEF2FF', p: 1.2, borderRadius: 2.5 }}>
                <ReceiptLongIcon sx={{ color: '#6366F1', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Total Payments</Typography>
                <Typography variant="h6" fontWeight={800} color="text.primary">{payments.length}</Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: isDark ? '#78350f' : '#FEF3C7', p: 1.2, borderRadius: 2.5 }}>
                <CreditCardIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 0.5 }}>Payment Method</Typography>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {billingData.cardHolder ? `${billingData.cardType} ···· ${billingData.last4}` : 'No card on file'}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Method Card */}
      <Card elevation={0} sx={{ mb: 3, border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: isDark ? '#1e1b4b' : '#EEF2FF', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)' }}>
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
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: isDark ? '#0f172a' : '#FAFAFA', borderRadius: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ textTransform: 'capitalize' }}>
                        {billingData.cardType} ···· {billingData.last4}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: '0.8rem' }}>
                        Expires {billingData.expiryDate}
                      </Typography>
                    </Box>
                    <Avatar sx={{ width: 48, height: 32, borderRadius: 1.5, bgcolor: isDark ? '#374151' : '#f1f5f9' }}>
                      <CreditCardIcon sx={{ fontSize: 18, color: '#6366F1' }} />
                    </Avatar>
                  </Stack>
                </Paper>
              ) : (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: isDark ? '#0f172a' : '#FAFAFA', borderRadius: 2 }}>
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
                  borderColor: isDark ? '#374151' : '#E5E7EB',
                  color: 'text.secondary',
                  '&:hover': { borderColor: isDark ? '#4B5563' : '#D1D5DB', bgcolor: isDark ? '#0f172a' : '#FAFAFA' }
                }}
              >
                {billingData.cardHolder ? 'Update via Stripe' : 'Add payment method'}
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Billing Address Card */}
      <Card elevation={0} sx={{ mb: 3, border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ bgcolor: isDark ? '#064e3b' : '#D1FAE5', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)' }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Full Name *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.name}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.email}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Street Address *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.address}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter your street address"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                City *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.city}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Enter city"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                Country *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.country}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                placeholder="Select country"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" sx={{ mb: 1 }}>
                ZIP Code *
              </Typography>
              <TextField
                fullWidth
                value={billingAddress.zipCode}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                placeholder="Enter ZIP code"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0f172a' : '#FAFAFA',
                    '& fieldset': { borderColor: isDark ? '#374151' : '#E5E7EB' },
                    '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#D1D5DB' }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
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
                borderColor: isDark ? '#374151' : '#E5E7EB',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: isDark ? '#4B5563' : '#D1D5DB',
                  bgcolor: isDark ? '#0f172a' : '#FAFAFA'
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
                '&:hover': { bgcolor: '#4F46E5' },
                boxShadow: 'none'
              }}
            >
              {savingAddress ? <CircularProgress size={18} sx={{ color: '#FFF' }} /> : 'Update Information'}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Stripe Invoices (Live from Stripe) */}
      <Card elevation={0} sx={{ mb: 3, border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ bgcolor: isDark ? '#581c87' : '#F3E8FF', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(147, 51, 234, 0.1)' }}>
              <OpenInNewIcon sx={{ color: '#9333EA', fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Stripe Invoices
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                Direct from Stripe (real-time)
              </Typography>
            </Box>
            <Button
              size="small"
              variant="outlined"
              startIcon={stripeLoading ? <CircularProgress size={16} /> : <SyncIcon sx={{ fontSize: 16 }} />}
              onClick={fetchStripeInvoices}
              disabled={stripeLoading}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
            >
              Refresh
            </Button>
          </Box>

          {stripeLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : stripeInvoices.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Receipt sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>No invoices found in Stripe</Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 1.5, overflow: 'hidden', display: { xs: 'none', sm: 'block' } }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? '#0f172a' : '#F9FAFB' }}>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Invoice</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Period</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stripeInvoices.map((inv, index) => (
                      <TableRow key={inv.id} sx={{ '&:hover': { bgcolor: isDark ? '#0f172a' : '#F9FAFB' }, borderBottom: index === stripeInvoices.length - 1 ? 'none' : `1px solid ${isDark ? '#374151' : '#E5E7EB'}` }}>
                        <TableCell><Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>#{inv.number}</Typography></TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                              {new Date(inv.created * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                            {inv.periodStart ? new Date(inv.periodStart * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'} — {inv.periodEnd ? new Date(inv.periodEnd * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>{inv.currency} {inv.amount.toFixed(2)}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{inv.status === 'paid' ? getStatusChip('paid') : inv.status === 'open' ? getStatusChip('pending') : getStatusChip('failed')}</TableCell>
                        <TableCell align="right">
                          {inv.hostedInvoiceUrl ? (
                            <IconButton size="small" component="a" href={inv.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" sx={{ color: '#6366F1', '&:hover': { bgcolor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)' } }}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" disabled sx={{ color: 'text.disabled' }}><DownloadIcon fontSize="small" /></IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                {stripeInvoices.map((inv) => (
                  <Card key={inv.id} variant="outlined" sx={{ mb: 2, borderRadius: 2, borderColor: isDark ? '#374151' : '#E5E7EB', overflow: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>Invoice #{inv.number}</Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <CalendarIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{new Date(inv.created * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</Typography>
                          </Stack>
                        </Box>
                        {inv.status === 'paid' ? getStatusChip('paid') : inv.status === 'open' ? getStatusChip('pending') : getStatusChip('failed')}
                      </Stack>
                      <Divider sx={{ mb: 1.5, borderColor: isDark ? '#374151' : '#f1f5f9' }} />
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'text.primary' }}>{inv.currency} {inv.amount.toFixed(2)}</Typography>
                        </Stack>
                        {inv.hostedInvoiceUrl ? (
                          <Button size="small" href={inv.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />} sx={{ textTransform: 'none', fontWeight: 600, color: '#6366F1', '&:hover': { bgcolor: 'rgba(99,102,241,0.08)' } }}>View</Button>
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>No invoice</Typography>
                        )}
                      </Stack>
                    </Box>
                  </Card>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Card>

      {/* Payment History */}
      <Card elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{ bgcolor: isDark ? '#78350f' : '#FEF3C7', p: 1.2, borderRadius: 2.5, display: 'flex', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)' }}>
              <Receipt sx={{ color: '#F59E0B', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                Payment History
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                All your transactions and invoices
              </Typography>
            </Box>
          </Box>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Tab label={`All (${payments.length})`} />
            <Tab label={`Subscriptions (${subscriptionPayments.length})`} />
            <Tab label={`One-Time (${oneTimePayments.length})`} />
          </Tabs>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={28} />
            </Box>
          ) : payments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>No payment history yet</Typography>
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: 1.5, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: isDark ? '#0f172a' : '#F9FAFB' }}>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151', fontSize: '0.875rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(tab === 0 ? payments : tab === 1 ? subscriptionPayments : oneTimePayments).map((payment, index) => (
                      <TableRow
                        key={payment.id}
                        sx={{
                          '&:hover': { bgcolor: isDark ? '#0f172a' : '#F9FAFB' },
                          borderBottom: index === payments.length - 1 ? 'none' : `1px solid ${isDark ? '#374151' : '#E5E7EB'}`
                        }}
                      >
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                              {new Date(payment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.serviceType || 'One-time'}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.7rem', textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.875rem' }}>
                            {payment.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ fontSize: '0.875rem' }}>
                              {formatCurrency(payment.amount, payment.currency)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{getStatusChip(payment.status)}</TableCell>
                        <TableCell align="right">
                          {payment.stripeInvoiceUrl && payment.stripeInvoiceUrl !== 'N/A' ? (
                            <IconButton
                              size="small"
                              component="a"
                              href={payment.stripeInvoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#6366F1',
                                '&:hover': { bgcolor: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.08)' }
                              }}
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          ) : (
                            <IconButton size="small" disabled sx={{ color: 'text.disabled' }}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Billings;
