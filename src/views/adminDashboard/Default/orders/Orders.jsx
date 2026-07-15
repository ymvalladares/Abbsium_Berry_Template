import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box, Typography, Grid, Paper, Stack, alpha, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select,
  InputLabel, FormControl, TablePagination, CircularProgress, Tooltip,
  Divider, InputAdornment, Avatar, Stepper, Step, StepLabel, Checkbox,
  useMediaQuery, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SyncIcon from '@mui/icons-material/Sync';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TuneIcon from '@mui/icons-material/Tune';
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://localhost:44328').replace(/\/+$/, '');

const statusConfig = {
  'Completed': { bg: '#dcfce7', text: '#166534', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  'Pending': { bg: '#fef3c7', text: '#92400e', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
  'Payment Failed': { bg: '#fee2e2', text: '#991b1b', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
  'Cancelled': { bg: '#f1f5f9', text: '#475569', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
  'Past Due': { bg: '#fee2e2', text: '#991b1b', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
  'Refunded': { bg: '#e0f2fe', text: '#075985', icon: <AttachMoneyIcon sx={{ fontSize: 14 }} /> },
  'Suspended': { bg: '#fecaca', text: '#7f1d1d', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
  'Trialing': { bg: '#dbeafe', text: '#1e40af', icon: <PlayArrowIcon sx={{ fontSize: 14 }} /> },
  'Unpaid': { bg: '#fef3c7', text: '#92400e', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
};

const paymentStatusConfig = {
  'paid': { bg: '#dcfce7', text: '#166534', icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  'failed': { bg: '#fee2e2', text: '#991b1b', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
  'suspended': { bg: '#fecaca', text: '#7f1d1d', icon: <CancelIcon sx={{ fontSize: 14 }} /> },
  'pending': { bg: '#fef3c7', text: '#92400e', icon: <WarningAmberIcon sx={{ fontSize: 14 }} /> },
};

const PaymentStatusBadge = ({ status, isDark }) => {
  const cfg = paymentStatusConfig[status] || paymentStatusConfig['pending'];
  return (
    <Chip icon={cfg.icon} label={status.charAt(0).toUpperCase() + status.slice(1)} size="small" sx={{ bgcolor: isDark ? alpha(cfg.text, 0.15) : cfg.bg, color: cfg.text, fontWeight: 600, fontSize: '0.7rem', '& .MuiChip-icon': { color: cfg.text } }} />
  );
};

const StatusBadge = ({ status, isDark }) => {
  const cfg = statusConfig[status] || statusConfig['Pending'];
  return (
    <Chip icon={cfg.icon} label={status} size="small" sx={{ bgcolor: isDark ? alpha(cfg.text, 0.15) : cfg.bg, color: cfg.text, fontWeight: 600, fontSize: '0.7rem', '& .MuiChip-icon': { color: cfg.text } }} />
  );
};

const StatCard = ({ title, value, subtitle, icon, color, isDark }) => (
  <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', bgcolor: isDark ? '#1e293b' : '#fff', position: 'relative', overflow: 'hidden' }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', bgcolor: color, borderRadius: '3px 3px 0 0' }} />
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, color: isDark ? '#f1f5f9' : '#0f172a', mt: 0.5, lineHeight: 1.1 }}>{value}</Typography>
        {subtitle && <Typography sx={{ color: isDark ? '#64748b' : '#94a3b8', fontWeight: 500, fontSize: '0.75rem', mt: 0.5 }}>{subtitle}</Typography>}
      </Box>
      <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>{icon}</Box>
    </Stack>
  </Paper>
);

const InfoRow = ({ label, value, icon, copyable }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 0.75 }}>
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{label}</Typography>
    </Stack>
    <Stack direction="row" spacing={0.5} alignItems="center">
      {typeof value === 'string' ? (
        <Typography component="span" sx={{ fontWeight: 600, fontSize: '0.8rem', textAlign: 'right', maxWidth: 250, wordBreak: 'break-all' }}>{value || '-'}</Typography>
      ) : (
        value
      )}
      {copyable && value && (
        <Tooltip title="Copy"><IconButton size="small" sx={{ p: 0.2 }} onClick={() => navigator.clipboard.writeText(value)}><ContentCopyIcon sx={{ fontSize: 12 }} /></IconButton></Tooltip>
      )}
    </Stack>
  </Stack>
);

const Orders = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('orders');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);
  const [paymentHistoryPage, setPaymentHistoryPage] = useState(0);
  const [paymentHistoryPageSize] = useState(25);
  const [paymentHistoryTotal, setPaymentHistoryTotal] = useState(0);
  const [paymentHistoryFilters, setPaymentHistoryFilters] = useState({ status: '', userId: '' });
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalOrders, setTotalOrders] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [filters, setFilters] = useState({ status: '', planMode: '', search: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [subDetails, setSubDetails] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar(s => ({ ...s, open: false })), 3000);
  };

  const activeFilterCount = [filters.status, filters.planMode, filters.search].filter(Boolean).length;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: page + 1, pageSize, ...filters });
      const res = await axios.get(`${API_BASE}/Order?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data.orders || []);
      setTotalOrders(res.data.total || 0);
    } catch (err) {
      showSnackbar('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/Order/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch (err) { /* ignore */ }
  };

  const fetchPaymentHistory = useCallback(async () => {
    setPaymentHistoryLoading(true);
    setSelectedPayments([]);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ page: paymentHistoryPage + 1, pageSize: paymentHistoryPageSize, ...paymentHistoryFilters });
      const res = await axios.get(`${API_BASE}/Order/payment-history?${params}`, { headers: { Authorization: `Bearer ${token}` } });
      setPaymentHistory(res.data.payments || []);
      setPaymentHistoryTotal(res.data.total || 0);
    } catch (err) {
      showSnackbar('Failed to load payment history', 'error');
    } finally {
      setPaymentHistoryLoading(false);
    }
  }, [paymentHistoryPage, paymentHistoryPageSize, paymentHistoryFilters]);

  useEffect(() => {
    if (viewMode === 'orders') { fetchOrders(); fetchStats(); }
    else { fetchPaymentHistory(); }
  }, [viewMode, fetchOrders, fetchPaymentHistory]);

  const fetchSubDetails = async (order) => {
    if (!order.subscriptionId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/Order/subscription-details/${order.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSubDetails(res.data);
    } catch (err) { /* ignore */ }
  };

  const syncSubscription = async (order) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/sync-subscription/${order.id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      showSnackbar('Subscription synced');
      fetchOrders();
      fetchSubDetails(order);
    } catch (err) {
      showSnackbar('Failed to sync', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'User', 'Email', 'Dealer', 'Plan', 'Amount', 'Status', 'Type', 'Subscription ID', 'Next Billing', 'Created'];
    const rows = orders.map(o => [o.id, o.user_data?.userName || o.userId, o.user_data?.email || '', o.dealer?.name || '-', o.serviceType, o.amount?.toFixed(2), o.status, o.planMode, o.subscriptionId || '-', o.nextBillingDate ? new Date(o.nextBillingDate).toLocaleDateString() : '-', new Date(o.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    showSnackbar('CSV exported');
  };

  const handleCancelSubscription = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/cancel-subscription/${selectedOrder.id}`, { reason: cancelReason, invoiceNow: true, prorate: true }, { headers: { Authorization: `Bearer ${token}` } });
      setCancelOpen(false); setDetailOpen(false);
      fetchOrders(); fetchStats();
      showSnackbar('Subscription cancelled');
    } catch (err) { showSnackbar('Failed to cancel', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/reactivate-subscription/${selectedOrder.id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setDetailOpen(false); fetchOrders(); fetchStats();
      showSnackbar('Subscription reactivated');
    } catch (err) { showSnackbar('Failed to reactivate', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleAddNote = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/add-note/${selectedOrder.id}`, { note: noteText }, { headers: { Authorization: `Bearer ${token}` } });
      setNoteOpen(false); setNoteText(''); fetchOrders();
      showSnackbar('Note added');
    } catch (err) { showSnackbar('Failed to add note', 'error'); }
    finally { setActionLoading(false); }
  };

  const openDetail = async (order) => {
    setSelectedOrder(order);
    setSubDetails(null);
    setActiveStep(0);
    setDetailOpen(true);
    if (order.subscriptionId) fetchSubDetails(order);
  };

  const handleSelectAll = (checked) => {
    setSelectedOrders(checked ? orders.map(o => o.id) : []);
  };

  const handleSelectOrder = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAllPayments = (checked) => {
    setSelectedPayments(checked ? paymentHistory.map(p => p.id) : []);
  };

  const handleSelectPayment = (id) => {
    setSelectedPayments(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const fmt = {
    currency: (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v || 0),
    date: (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-',
    relative: (d) => {
      if (!d) return '-';
      const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
      if (diff === 0) return 'Today'; if (diff === 1) return 'Yesterday';
      if (diff < 7) return `${diff}d ago`; if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
      return new Date(d).toLocaleDateString();
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, md: 3 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>Orders & Subscriptions</Typography>
          <Typography sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>Manage payments, subscriptions and dealer billing</Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => { if (val) setViewMode(val); }} size="small" sx={{ '& .MuiToggleButton-root': { borderRadius: 1, textTransform: 'none', border: '1px solid', borderColor: isDark ? '#374151' : '#d1d5db', py: 0.6, px: 2, bgcolor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', '&.Mui-selected': { bgcolor: '#6366f1', borderColor: '#6366f1', color: '#fff', fontWeight: 600 }, ...(isDark && { '&:hover': { bgcolor: '#334155' } }) }, '& .MuiToggleButton-root:first-of-type': { borderRadius: '8px 0 0 8px' }, '& .MuiToggleButton-root:last-of-type': { borderRadius: '0 8px 8px 0' } }}>
            <ToggleButton value="orders">Orders</ToggleButton>
            <ToggleButton value="history">Payment History</ToggleButton>
          </ToggleButtonGroup>
          <Button variant="text" size="small" startIcon={<RefreshIcon sx={{ fontSize: 18 }} />} onClick={() => { if (viewMode === 'orders') { fetchOrders(); fetchStats(); } else { fetchPaymentHistory(); } }} sx={{ textTransform: 'none', color: 'text.secondary', px: 1 }}>Refresh</Button>
          {viewMode === 'orders' && <Button variant="text" size="small" startIcon={<DownloadIcon sx={{ fontSize: 18 }} />} onClick={exportToCSV} sx={{ textTransform: 'none', color: 'text.secondary', px: 1 }}>Export</Button>}
        </Stack>
      </Stack>

      {viewMode === 'orders' && (
        <>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Total Revenue" value={fmt.currency(stats.totalRevenue)} subtitle={`${stats.totalOrders || 0} total orders`} icon={<AttachMoneyIcon />} color="#10b981" isDark={isDark} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Active Subscriptions" value={stats.activeSubscriptions || 0} subtitle={`$${(stats.monthlyRevenue || 0).toFixed(2)} this month`} icon={<ShoppingBagIcon />} color="#6366f1" isDark={isDark} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Pending / Failed" value={`${stats.pendingOrders || 0} / ${stats.failedPayments || 0}`} subtitle="Needs attention" icon={<WarningAmberIcon />} color="#f59e0b" isDark={isDark} /></Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Cancelled" value={stats.cancelledSubscriptions || 0} subtitle="Lost subscriptions" icon={<CancelIcon />} color="#ef4444" isDark={isDark} /></Grid>
      </Grid>

      {/* Filters Card */}
      <Card sx={{ borderRadius: 3, mb: 3, boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                Filters
                {activeFilterCount > 0 && (
                  <Chip label={activeFilterCount} size="small" sx={{ bgcolor: '#6366f1', color: '#fff', fontWeight: 700, height: 20, minWidth: 20, '& .MuiChip-label': { px: 0.75 } }} />
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary">Refine your orders search</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={exportToCSV} sx={{ borderRadius: 2, textTransform: 'none', display: { xs: 'none', sm: 'flex' } }}>Export</Button>
            </Box>
          </Box>

          <TextField fullWidth placeholder="Search by user, dealer, plan..." value={filters.search} onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }} sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: isDark ? '#0f172a' : '#fafafa', transition: 'all 0.2s', '&:hover': { bgcolor: isDark ? '#1e293b' : '#fff', boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.08)' }, '&.Mui-focused': { bgcolor: isDark ? '#1e293b' : '#fff', boxShadow: isDark ? '0 0 0 3px rgba(99,102,241,0.15)' : '0 0 0 3px rgba(99,102,241,0.15)' } } }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }} />

          <Divider sx={{ mb: 3, borderColor: isDark ? '#374151' : undefined }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>ORDER STATUS</Typography>
              <ToggleButtonGroup value={filters.status || ''} exclusive onChange={(e, val) => { setFilters(f => ({ ...f, status: val })); setPage(0); }} fullWidth size="small" sx={{ '& .MuiToggleButton-root': { borderRadius: 1, textTransform: 'none', border: '1px solid', borderColor: isDark ? '#374151' : '#d1d5db', py: 1, bgcolor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', '&.Mui-selected': { bgcolor: '#6366f1', borderColor: '#6366f1', color: '#fff', fontWeight: 600 }, ...(isDark && { '&:hover': { bgcolor: '#334155' } }) }, '& .MuiToggleButton-root:first-of-type': { borderRadius: '8px 0 0 8px' }, '& .MuiToggleButton-root:last-of-type': { borderRadius: '0 8px 8px 0' } }}>
                <ToggleButton value=""><AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />All</ToggleButton>
                <ToggleButton value="Pending"><AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />Pending</ToggleButton>
                <ToggleButton value="Completed"><CheckCircleIcon sx={{ fontSize: 18, mr: 0.5 }} />Completed</ToggleButton>
                <ToggleButton value="Cancelled"><CancelIcon sx={{ fontSize: 18, mr: 0.5 }} />Cancelled</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>ORDER TYPE</Typography>
              <ToggleButtonGroup value={filters.planMode || ''} exclusive onChange={(e, val) => { setFilters(f => ({ ...f, planMode: val })); setPage(0); }} fullWidth size="small" sx={{ '& .MuiToggleButton-root': { borderRadius: 1, textTransform: 'none', border: '1px solid', borderColor: isDark ? '#374151' : '#d1d5db', py: 1, bgcolor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', '&.Mui-selected': { bgcolor: '#6366f1', borderColor: '#6366f1', color: '#fff', fontWeight: 600 }, ...(isDark && { '&:hover': { bgcolor: '#334155' } }) }, '& .MuiToggleButton-root:first-of-type': { borderRadius: '8px 0 0 8px' }, '& .MuiToggleButton-root:last-of-type': { borderRadius: '0 8px 8px 0' } }}>
                <ToggleButton value=""><TuneIcon sx={{ fontSize: 18, mr: 0.5 }} />All</ToggleButton>
                <ToggleButton value="subscription"><ShoppingBagIcon sx={{ fontSize: 18, mr: 0.5 }} />Subscription</ToggleButton>
                <ToggleButton value="payment"><AttachMoneyIcon sx={{ fontSize: 18, mr: 0.5 }} />One-time</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => { setFilters({ status: '', planMode: '', search: '' }); setPage(0); }} sx={{ textTransform: 'none', color: 'text.secondary', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' } }}>Clear all filters</Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          {loading ? (<Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={32} /></Box>) : orders.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}><ShoppingBagIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 2 }} /><Typography variant="h6" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>No orders found</Typography></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ borderBottom: isDark ? '2px solid #374151' : undefined }}>
                    <Checkbox checked={orders.length > 0 && selectedOrders.length === orders.length} indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length} onChange={(e) => handleSelectAll(e.target.checked)} />
                  </TableCell>
                  {!isMobile && <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Order</TableCell>}
                  <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Customer</TableCell>
                  {!isTablet && <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Dealer</TableCell>}
                  <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Plan</TableCell>
                  <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Amount</TableCell>
                  <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Status</TableCell>
                  {!isTablet && <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Next Billing</TableCell>}
                  <TableCell align="right" sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600, borderBottom: isDark ? '2px solid #374151' : undefined }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedOrders.includes(order.id)} onChange={() => handleSelectOrder(order.id)} />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>{order.id?.toString().slice(0, 8)}</Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: '#6366f1', flexShrink: 0 }}>{(order.user_data?.userName || 'U')[0].toUpperCase()}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{order.user_data?.userName || order.userId}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.user_data?.email || order.stripeCustomerEmail}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {!isTablet && (
                      <TableCell>
                        {order.dealer?.name ? (
                          <Stack direction="row" spacing={0.5} alignItems="center"><StoreIcon sx={{ fontSize: 14, flexShrink: 0 }} /><Typography sx={{ fontSize: '0.8rem' }}>{order.dealer.name}</Typography></Stack>
                        ) : (
                          <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#475569' : '#cbd5e1' }}>-</Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{order.serviceType}</Typography>
                        <Chip label={order.planMode === 'subscription' ? 'Monthly' : 'One-time'} size="small" sx={{ height: 18, fontSize: '0.6rem', mt: 0.5, bgcolor: order.planMode === 'subscription' ? alpha('#6366f1', 0.1) : alpha('#94a3b8', 0.1), color: order.planMode === 'subscription' ? '#6366f1' : '#64748b' }} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmt.currency(order.amount)}</Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} isDark={isDark} />
                    </TableCell>
                    {!isTablet && (
                      <TableCell>
                        {order.nextBillingDate ? (
                          <Box>
                            <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{fmt.date(order.nextBillingDate)}</Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: isDark ? '#64748b' : '#94a3b8' }}>{fmt.relative(order.nextBillingDate)}</Typography>
                          </Box>
                        ) : (
                          <Typography sx={{ fontSize: '0.75rem', color: isDark ? '#475569' : '#cbd5e1' }}>-</Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details"><IconButton size="small" onClick={() => openDetail(order)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                        {order.notes && <Tooltip title="Has Notes"><IconButton size="small" onClick={() => { setSelectedOrder(order); setNoteOpen(true); }}><NoteAddIcon fontSize="small" sx={{ color: '#f59e0b' }} /></IconButton></Tooltip>}
                        {order.planMode === 'subscription' && order.status !== 'Cancelled' && (<Tooltip title="Cancel"><IconButton size="small" onClick={() => { setSelectedOrder(order); setCancelOpen(true); }}><CancelIcon fontSize="small" sx={{ color: '#ef4444' }} /></IconButton></Tooltip>)}
                        {order.status === 'Cancelled' && order.subscriptionId && (<Tooltip title="Reactivate"><IconButton size="small" onClick={handleReactivate}><PlayArrowIcon fontSize="small" sx={{ color: '#10b981' }} /></IconButton></Tooltip>)}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {!loading && orders.length > 0 && (
          <TablePagination component="div" count={totalOrders} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 15, 25, 50]} sx={{ borderTop: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }} />
        )}
      </Card>
      </>
      )}

      {viewMode === 'history' && (
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2, borderBottom: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Monthly Payment History</Typography>
              <ToggleButtonGroup value={paymentHistoryFilters.status || ''} exclusive onChange={(e, val) => { setPaymentHistoryFilters(f => ({ ...f, status: val })); setPaymentHistoryPage(0); }} size="small" sx={{ '& .MuiToggleButton-root': { borderRadius: 1, textTransform: 'none', border: '1px solid', borderColor: isDark ? '#374151' : '#d1d5db', py: 0.5, px: 1.5, bgcolor: isDark ? '#1e293b' : '#fff', color: isDark ? '#94a3b8' : '#64748b', '&.Mui-selected': { bgcolor: '#6366f1', borderColor: '#6366f1', color: '#fff', fontWeight: 600 }, ...(isDark && { '&:hover': { bgcolor: '#334155' } }) }, '& .MuiToggleButton-root:first-of-type': { borderRadius: '8px 0 0 8px' }, '& .MuiToggleButton-root:last-of-type': { borderRadius: '0 8px 8px 0' } }}>
                <ToggleButton value="">All</ToggleButton>
                <ToggleButton value="paid">Paid</ToggleButton>
                <ToggleButton value="failed">Failed</ToggleButton>
                <ToggleButton value="suspended">Suspended</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            {paymentHistoryLoading ? (<Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={32} /></Box>) : paymentHistory.length === 0 ? (
              <Box sx={{ p: 8, textAlign: 'center' }}><ReceiptIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 2 }} /><Typography variant="h6" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>No payment history records yet</Typography><Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Records will appear after the first monthly subscription charge</Typography></Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ borderBottom: isDark ? '2px solid #374151' : undefined }}>
                      <Checkbox checked={paymentHistory.length > 0 && selectedPayments.length === paymentHistory.length} indeterminate={selectedPayments.length > 0 && selectedPayments.length < paymentHistory.length} onChange={(e) => handleSelectAllPayments(e.target.checked)} />
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Status</TableCell>
                    {!isTablet && <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Failed Attempts</TableCell>}
                    {!isTablet && <TableCell sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Invoice</TableCell>}
                    <TableCell align="right" sx={{ color: isDark ? '#ffffff' : undefined, fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={selectedPayments.includes(payment.id)} onChange={() => handleSelectPayment(payment.id)} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{fmt.date(payment.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8rem' }}>{payment.description}</Typography>
                        {payment.notes && <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>{payment.notes}</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmt.currency(payment.amount)}</Typography>
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.status} isDark={isDark} />
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          <Typography sx={{ fontSize: '0.8rem', color: payment.failedAttempts > 0 ? '#ef4444' : 'text.secondary', fontWeight: payment.failedAttempts > 0 ? 600 : 400 }}>
                            {payment.failedAttempts > 0 ? `${payment.failedAttempts}/3` : '0'}
                          </Typography>
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell>
                          {payment.stripeInvoiceUrl ? (
                            <a href={payment.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#6366f1', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
                              <OpenInNewIcon sx={{ fontSize: 14 }} /> View
                            </a>
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>-</Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          {payment.stripeInvoiceUrl && (
                            <Tooltip title="View Invoice"><IconButton size="small" component="a" href={payment.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer"><OpenInNewIcon fontSize="small" sx={{ color: '#6366f1' }} /></IconButton></Tooltip>
                          )}
                          <Tooltip title="View Order"><IconButton size="small" onClick={() => openDetail({ id: payment.orderId })}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {!paymentHistoryLoading && paymentHistory.length > 0 && (
            <TablePagination component="div" count={paymentHistoryTotal} page={paymentHistoryPage} onPageChange={(e, p) => setPaymentHistoryPage(p)} rowsPerPage={paymentHistoryPageSize} rowsPerPageOptions={[25, 50, 100]} sx={{ borderTop: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }} />
          )}
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => { setDetailOpen(false); setActiveStep(0); }} maxWidth="sm" fullScreen={isMobile} PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3, width: isMobile ? '100%' : '90%', maxWidth: 700, m: isMobile ? 0 : 'auto' } }}>
        <DialogTitle sx={{ fontWeight: 700, borderBottom: isDark ? '1px solid #374151' : '1px solid #e2e8f0', pb: 1, px: { xs: 2, sm: 3 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha(selectedOrder?.planMode === 'subscription' ? '#6366f1' : '#10b981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedOrder?.planMode === 'subscription' ? <ShoppingBagIcon sx={{ fontSize: 18, color: '#6366f1' }} /> : <AttachMoneyIcon sx={{ fontSize: 18, color: '#10b981' }} />}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {selectedOrder?.planMode === 'subscription' ? 'Subscription' : 'Order'} Details
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                  {selectedOrder?.id?.toString().slice(0, 8)}...
                </Typography>
              </Box>
            </Stack>
            {selectedOrder?.subscriptionId && (
              <Button size="small" startIcon={actionLoading ? <CircularProgress size={16} /> : <SyncIcon />} onClick={() => syncSubscription(selectedOrder)} disabled={actionLoading}>Sync</Button>
            )}
          </Stack>
        </DialogTitle>

        <Stepper activeStep={activeStep} sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 }, pb: 0 }}>
          {['Overview', selectedOrder?.planMode === 'subscription' ? 'Subscription' : 'Billing', 'Payment', 'History'].map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 600 } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, minHeight: 320 }}>
          {selectedOrder && (
            <>
              {/* Step 0: Overview */}
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, bgcolor: isDark ? '#0f172a' : '#f8fafc', border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexWrap="wrap" gap={2}>
                      <Stack spacing={0.5}>
                        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>{fmt.currency(selectedOrder.amount)}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {selectedOrder.planMode === 'subscription' ? `${selectedOrder.intervalCount || 1} ${selectedOrder.interval || 'month'}ly subscription` : 'One-time payment'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={{ xs: 1.5, sm: 2.5 }} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                        <StatusBadge status={selectedOrder.status} isDark={isDark} />
                        {selectedOrder.cancelAtPeriodEnd && <Chip label="Cancels at period end" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha('#f59e0b', 0.15), color: '#f59e0b' }} />}
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Plan</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{selectedOrder.serviceType}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Dealer</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{selectedOrder.dealer?.name || '-'}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Created</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmt.relative(selectedOrder.createdAt)}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Currency</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{(selectedOrder.currency || 'usd').toUpperCase()}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1 }}>Customer</Typography>
                      <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 40, height: 40, bgcolor: '#6366f1', fontWeight: 700 }}>{(selectedOrder.user_data?.userName || selectedOrder.stripeCustomerEmail || 'U')[0].toUpperCase()}</Avatar>
                          <Stack>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedOrder.user_data?.userName || selectedOrder.userId}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{selectedOrder.user_data?.email || selectedOrder.stripeCustomerEmail}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1 }}>Dealer</Typography>
                      <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        {selectedOrder.dealer ? (
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha('#6366f1', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StoreIcon sx={{ fontSize: 20, color: '#6366f1' }} />
                            </Box>
                            <Stack>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedOrder.dealer.name}</Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: selectedOrder.dealer.isActive ? '#10b981' : '#ef4444' }}>
                                {selectedOrder.dealer.isActive ? 'Active' : 'Inactive'}
                              </Typography>
                            </Stack>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: isDark ? '#1e293b' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StoreIcon sx={{ fontSize: 20, color: isDark ? '#475569' : '#cbd5e1' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>No dealer associated</Typography>
                          </Stack>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1 }}>References</Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Order ID</Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedOrder.id}</Typography>
                          <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedOrder.id)}><ContentCopyIcon sx={{ fontSize: 12 }} /></IconButton>
                        </Stack>
                      </Stack>
                      {selectedOrder.subscriptionId && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Subscription ID</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedOrder.subscriptionId}</Typography>
                            <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedOrder.subscriptionId)}><ContentCopyIcon sx={{ fontSize: 12 }} /></IconButton>
                          </Stack>
                        </Stack>
                      )}
                      {selectedOrder.stripeCustomerId && (
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Stripe Customer</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedOrder.stripeCustomerId}</Typography>
                            <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedOrder.stripeCustomerId)}><ContentCopyIcon sx={{ fontSize: 12 }} /></IconButton>
                          </Stack>
                        </Stack>
                      )}
                    </Stack>
                  </Paper>
                </Stack>
              )}

              {/* Step 1: Subscription / Billing */}
              {activeStep === 1 && (
                <Stack spacing={3}>
                  {selectedOrder.planMode === 'subscription' ? (
                    <>
                      <Paper sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2, bgcolor: isDark ? '#0f172a' : '#f8fafc', border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>Billing Cycle</Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Amount</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mt: 0.25 }}>{fmt.currency(selectedOrder.amount)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Interval</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mt: 0.25, textTransform: 'capitalize' }}>{selectedOrder.interval || 'month'}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Quantity</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mt: 0.25 }}>{selectedOrder.quantity || 1}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Next Billing</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mt: 0.25 }}>{selectedOrder.nextBillingDate ? fmt.date(selectedOrder.nextBillingDate) : '-'}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>Current Period</Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Period Start</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{selectedOrder.currentPeriodStart ? fmt.date(selectedOrder.currentPeriodStart) : '-'}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Period End</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{selectedOrder.currentPeriodEnd ? fmt.date(selectedOrder.currentPeriodEnd) : '-'}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Cancel at Period End</Typography>
                            <Chip label={selectedOrder.cancelAtPeriodEnd ? 'Yes' : 'No'} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: selectedOrder.cancelAtPeriodEnd ? alpha('#f59e0b', 0.15) : alpha('#10b981', 0.15), color: selectedOrder.cancelAtPeriodEnd ? '#f59e0b' : '#10b981' }} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Failed Attempts</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: selectedOrder.failedPaymentAttempts > 0 ? '#ef4444' : 'inherit' }}>{selectedOrder.failedPaymentAttempts || 0}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>

                      {(selectedOrder.trialEnd || selectedOrder.subscriptionEndDate || selectedOrder.cancelledAt) && (
                        <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>Lifecycle</Typography>
                          <Stack spacing={1.5}>
                            {selectedOrder.trialEnd && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Trial End</Typography>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.trialEnd)}</Typography>
                              </Stack>
                            )}
                            {selectedOrder.subscriptionEndDate && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Subscription Ended</Typography>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.subscriptionEndDate)}</Typography>
                              </Stack>
                            )}
                            {selectedOrder.cancelledAt && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Cancelled At</Typography>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.cancelledAt)}</Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Paper>
                      )}

                      {subDetails && (
                        <Paper sx={{ p: { xs: 2, sm: 2 }, borderRadius: 2, border: `1px solid ${alpha('#6366f1', 0.3)}`, bgcolor: alpha('#6366f1', 0.03) }}>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', fontSize: '0.65rem' }}>Live from Stripe</Typography>
                          </Stack>
                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Status</Typography>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'capitalize', mt: 0.25 }}>{subDetails.status}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Amount</Typography>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mt: 0.25 }}>{subDetails.amount ? fmt.currency(subDetails.amount) : '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Interval</Typography>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'capitalize', mt: 0.25 }}>{subDetails.interval}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Customer</Typography>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', mt: 0.25 }}>{subDetails.customerEmail || '-'}</Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </>
                  ) : (
                    <Paper sx={{ p: 3, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', textAlign: 'center' }}>
                      <AttachMoneyIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>One-time Payment</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>This was a single payment, not a recurring subscription.</Typography>
                      <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Amount</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#10b981', mt: 0.25 }}>{fmt.currency(selectedOrder.amount)}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 600 }}>Date</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mt: 0.25 }}>{fmt.date(selectedOrder.createdAt)}</Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  )}
                </Stack>
              )}

              {/* Step 2: Payment Method */}
              {activeStep === 2 && (
                <Stack spacing={3}>
                  {selectedOrder.stripeBrand ? (
                    <>
                      <Paper sx={{ p: 2.5, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: 56, height: 36, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : '#f8fafc', border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CreditCardIcon sx={{ fontSize: 20, color: '#6366f1' }} />
                          </Box>
                          <Stack>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'capitalize' }}>{selectedOrder.stripeBrand}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontFamily: 'monospace' }}>•••• •••• •••• {selectedOrder.stripeLast4}</Typography>
                          </Stack>
                          <Box sx={{ ml: 'auto' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Expires</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{selectedOrder.stripeExpMonth}/{selectedOrder.stripeExpYear}</Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {selectedOrder.stripeInvoiceUrl && (
                        <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <ReceiptIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Latest Invoice</Typography>
                            </Stack>
                            <Button size="small" href={selectedOrder.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}>
                              View Invoice
                            </Button>
                          </Stack>
                        </Paper>
                      )}

                      <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5 }}>Payment History</Typography>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Payment Intent</Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{selectedOrder.paymentIntentId || '-'}</Typography>
                              {selectedOrder.paymentIntentId && <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedOrder.paymentIntentId)}><ContentCopyIcon sx={{ fontSize: 12 }} /></IconButton>}
                            </Stack>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Last Stripe Event</Typography>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', fontFamily: 'monospace' }}>{selectedOrder.lastStripeEvent || '-'}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </>
                  ) : (
                    <Paper sx={{ p: 3, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', textAlign: 'center' }}>
                      <CreditCardIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>No Payment Method</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>No card details stored for this order.</Typography>
                    </Paper>
                  )}
                </Stack>
              )}

              {/* Step 3: History / Notes */}
              {activeStep === 3 && (
                <Stack spacing={3}>
                  {selectedOrder.cancellationReason ? (
                    <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha('#ef4444', 0.3)}`, bgcolor: alpha('#ef4444', 0.03) }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CancelIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', fontSize: '0.65rem' }}>Cancelled</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{selectedOrder.cancellationReason}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>Cancelled on {fmt.date(selectedOrder.cancelledAt)}</Typography>
                    </Paper>
                  ) : (
                    <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${alpha('#10b981', 0.3)}`, bgcolor: alpha('#10b981', 0.03) }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', textTransform: 'uppercase', fontSize: '0.65rem' }}>Active — No Cancellations</Typography>
                      </Stack>
                    </Paper>
                  )}

                  {selectedOrder.notes ? (
                    <Paper sx={{ p: 2, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem' }}>Notes</Typography>
                        <Button size="small" startIcon={<NoteAddIcon />} onClick={() => { setSelectedOrder(selectedOrder); setNoteOpen(true); setDetailOpen(false); }}>Add Note</Button>
                      </Stack>
                      <Box sx={{ bgcolor: isDark ? '#0f172a' : '#f8fafc', borderRadius: 2, p: 2 }}>
                        {selectedOrder.notes.split('\n').map((note, i) => (
                          <Typography key={i} sx={{ fontSize: '0.8rem', fontFamily: 'monospace', py: 0.5, borderBottom: i < selectedOrder.notes.split('\n').length - 1 ? `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` : 'none' }}>
                            {note}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  ) : (
                    <Paper sx={{ p: 3, borderRadius: 2, border: isDark ? '1px solid #374151' : '1px solid #e2e8f0', textAlign: 'center' }}>
                      <NoteAddIcon sx={{ fontSize: 40, color: isDark ? '#475569' : '#cbd5e1', mb: 1 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>No Notes</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, mb: 1.5 }}>Add internal notes about this order.</Typography>
                      <Button size="small" startIcon={<NoteAddIcon />} onClick={() => { setSelectedOrder(selectedOrder); setNoteOpen(true); setDetailOpen(false); }}>Add Note</Button>
                    </Paper>
                  )}
                </Stack>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, borderTop: isDark ? '1px solid #374151' : '1px solid #e2e8f0' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Button size="small" disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}>Previous</Button>
              <Button size="small" disabled={activeStep === 3} onClick={() => setActiveStep(s => s + 1)}>Next</Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-end' }, mt: { xs: 0.5, sm: 0 } }}>
              {selectedOrder?.planMode === 'subscription' && selectedOrder?.status !== 'Cancelled' && (
                <Button size="small" variant="contained" onClick={() => { setCancelOpen(true); setDetailOpen(false); }} startIcon={<CancelIcon />} sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600, px: 2 }}>Cancel Subscription</Button>
              )}
              {selectedOrder?.status === 'Cancelled' && selectedOrder?.subscriptionId && (
                <Button size="small" color="success" onClick={handleReactivate} startIcon={<PlayArrowIcon />}>Reactivate</Button>
              )}
              <Button size="small" onClick={() => { setDetailOpen(false); setActiveStep(0); }}>Close</Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: '0.85rem', color: 'text.secondary' }}>This will cancel the subscription for <strong>{selectedOrder?.dealer?.name || selectedOrder?.serviceType}</strong>. The dealer will be deactivated.</Typography>
          <TextField fullWidth multiline minRows={3} label="Cancellation reason (optional)" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Back</Button>
          <Button variant="contained" onClick={handleCancelSubscription} disabled={actionLoading} sx={{ bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' }, fontWeight: 600, px: 2 }}>{actionLoading ? <CircularProgress size={20} /> : 'Confirm Cancel'}</Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Note</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline minRows={4} label="Note" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add internal note about this order..." />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteOpen(false)}>Cancel</Button>
          <Button onClick={handleAddNote} disabled={actionLoading || !noteText.trim()}>{actionLoading ? <CircularProgress size={20} /> : 'Save Note'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Paper sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', px: 3, py: 1.5, borderRadius: 2, bgcolor: snackbar.severity === 'error' ? '#ef4444' : '#10b981', color: '#fff', zIndex: 9999, boxShadow: '0 8px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 1 }}>
          {snackbar.severity === 'error' ? <WarningAmberIcon sx={{ fontSize: 18 }} /> : <CheckCircleIcon sx={{ fontSize: 18 }} />}
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 500 }}>{snackbar.message}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Orders;
