import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Paper, Stack, alpha, Card, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, TablePagination,
  CircularProgress, Tooltip, Divider, InputAdornment, Avatar, Stepper, Step,
  StepLabel, Checkbox, useMediaQuery, ToggleButton, ToggleButtonGroup, Skeleton, CardContent,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SyncIcon from '@mui/icons-material/Sync';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TuneIcon from '@mui/icons-material/Tune';
import axios from 'axios';

import {
  glassCard,
  glassInput,
  gradientText,
  gradientButton,
  gradientIconBox,
  glowShadow,
  GRADIENT_MAIN,
  GRADIENT_DANGER
} from './aiUi';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://localhost:44328').replace(/\/+$/, '');

const ACCENT_HEX = '#3b82f6';
const ACCENT_RGB = '59,130,246';
const GRADIENT_GREEN = 'linear-gradient(135deg, #34d399 0%, #10b981 100%)';

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

const glassToggleSx = (isDark) => ({
  '& .MuiToggleButton-root': {
    borderRadius: '12px',
    textTransform: 'none',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.15)'}`,
    bgcolor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.6)',
    py: 1,
    m: 0,
    color: 'text.secondary',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
      borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)'
    },
    '&.Mui-selected': {
      bgcolor: isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.1)',
      color: isDark ? '#93c5fd' : '#1d4ed8',
      fontWeight: 800,
      borderColor: 'transparent',
      boxShadow: `inset 0 0 0 1.5px rgba(${ACCENT_RGB},0.85), 0 6px 18px -6px rgba(${ACCENT_RGB},0.55)`,
      '&:hover': {
        bgcolor: isDark ? 'rgba(59,130,246,0.24)' : 'rgba(59,130,246,0.14)'
      }
    }
  },
  '&:not(:first-of-type)': { ml: 1 }
});

const headerCellSx = (isDark) => ({
  color: isDark ? '#e2e8f0' : '#334155',
  fontWeight: 800,
  fontSize: '0.76rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
  borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}`
});

const rowCellSx = (isDark) => ({
  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)'}`
});

const dialogSx = (isDark) => ({
  ...glassCard(isDark),
  borderRadius: '24px',
  p: 1.5,
  boxShadow: isDark
    ? '0 32px 80px -20px rgba(2,6,23,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 32px 80px -24px rgba(30,58,138,0.3), inset 0 1px 0 rgba(255,255,255,0.95)'
});

const subPaperSx = (isDark) => ({
  ...glassCard(isDark),
  borderRadius: '16px',
  p: { xs: 2, sm: 2.5 }
});

const actionBtnSx = (color, hoverColor, bgRgb) => ({
  width: 32,
  height: 32,
  bgcolor: `rgba(${bgRgb},0.1)`,
  color,
  transition: 'all 0.2s',
  '&:hover': {
    bgcolor: `rgba(${bgRgb},0.22)`,
    color: hoverColor,
    transform: 'translateY(-1px)',
    boxShadow: glowShadow(bgRgb, 0.4, 10)
  }
});

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

const StatCard = ({ title, value, subtitle, icon, badgeIcon, badgeColorLight, badgeColorDark, badgeRgb, isDark }) => (
  <Card elevation={0} sx={glassCard(isDark)}>
    <CardContent sx={{ p: '22px 20px !important' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
            <Typography variant="h4" sx={{ ...gradientText, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</Typography>
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, px: 0.75, py: 0.35, borderRadius: 1.5, fontSize: '0.7rem', fontWeight: 800, color: isDark ? badgeColorDark : badgeColorLight, bgcolor: `rgba(${badgeRgb},0.14)`, boxShadow: glowShadow(badgeRgb, 0.4, 10) }}>
              {badgeIcon}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{subtitle}</Typography>
        </Box>
        <Box sx={gradientIconBox()}>{icon}</Box>
      </Box>
    </CardContent>
  </Card>
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
  const [paymentOverview, setPaymentOverview] = useState(null);
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
    } catch {
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
    } catch { /* ignore */ }
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

      const overviewRes = await axios.get(`${API_BASE}/Order/payment-overview?${new URLSearchParams({ status: paymentHistoryFilters.status })}`, { headers: { Authorization: `Bearer ${token}` } });
      setPaymentOverview(overviewRes.data);
    } catch {
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
    } catch { /* ignore */ }
  };

  const syncSubscription = async (order) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/sync-subscription/${order.id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      showSnackbar('Subscription synced');
      fetchOrders();
      fetchSubDetails(order);
    } catch {
      showSnackbar('Failed to sync', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const syncPayments = async (order) => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE}/Order/sync-payments/${order.id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      showSnackbar(res.data.message || 'Payments synced');
      fetchPaymentHistory();
    } catch {
      showSnackbar('Failed to sync payments', 'error');
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
    } catch { showSnackbar('Failed to cancel', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/reactivate-subscription/${selectedOrder.id}`, null, { headers: { Authorization: `Bearer ${token}` } });
      setDetailOpen(false); fetchOrders(); fetchStats();
      showSnackbar('Subscription reactivated');
    } catch { showSnackbar('Failed to reactivate', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleAddNote = async () => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/Order/add-note/${selectedOrder.id}`, { note: noteText }, { headers: { Authorization: `Bearer ${token}` } });
      setNoteOpen(false); setNoteText(''); fetchOrders();
      showSnackbar('Note added');
    } catch { showSnackbar('Failed to add note', 'error'); }
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

  const checkboxSx = { color: ACCENT_HEX, '&.Mui-checked': { color: ACCENT_HEX } };

  return (
    <Box sx={{ position: 'relative', p: { xs: 2, md: 3 } }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography variant="h4" sx={{ ...gradientText, fontWeight: 800, letterSpacing: '-0.03em' }}>Orders & Subscriptions</Typography>
          <Typography sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.85rem' }}>Manage payments, subscriptions and dealer billing</Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => { if (val) setViewMode(val); }} size="small" sx={glassToggleSx(isDark)}>
            <ToggleButton value="orders"><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Orders</Box><Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Ord</Box></ToggleButton>
            <ToggleButton value="history"><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Payment History</Box><Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Hist</Box></ToggleButton>
          </ToggleButtonGroup>
          <Button variant="text" size="small" startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} onClick={() => { if (viewMode === 'orders') { fetchOrders(); fetchStats(); } else { fetchPaymentHistory(); } }} sx={{ textTransform: 'none', color: 'text.secondary', px: { xs: 0.5, sm: 1 }, minWidth: 'auto', fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 700, borderRadius: '10px', '&:hover': { color: ACCENT_HEX, bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)' } }}><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Refresh</Box></Button>
          {viewMode === 'orders' && <Button variant="text" size="small" startIcon={<DownloadIcon sx={{ fontSize: 16 }} />} onClick={exportToCSV} sx={{ textTransform: 'none', color: 'text.secondary', px: { xs: 0.5, sm: 1 }, minWidth: 'auto', fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 700, borderRadius: '10px', '&:hover': { color: ACCENT_HEX, bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)' } }}><Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Export</Box></Button>}
        </Stack>
      </Stack>

      {viewMode === 'orders' && (
        <>
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={glassCard(isDark)}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={80} height={20} sx={{ mb: 1, bgcolor: 'rgba(148,163,184,0.18)' }} />
                      <Skeleton variant="text" width={120} height={40} sx={{ mb: 0.5, bgcolor: 'rgba(148,163,184,0.18)' }} />
                      <Skeleton variant="text" width={100} height={16} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                    </Box>
                    <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2, bgcolor: 'rgba(148,163,184,0.18)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Total Revenue" value={fmt.currency(stats.totalRevenue)} subtitle={`${stats.totalOrders || 0} total orders`} icon={<AttachMoneyIcon sx={{ fontSize: 22, color: '#fff' }} />} badgeIcon={<TrendingUpIcon sx={{ fontSize: 12 }} />} badgeColorLight="#059669" badgeColorDark="#34d399" badgeRgb="52,211,153" isDark={isDark} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Active Subscriptions" value={stats.activeSubscriptions || 0} subtitle={`$${(stats.monthlyRevenue || 0).toFixed(2)} this month`} icon={<ShoppingBagIcon sx={{ fontSize: 22, color: '#fff' }} />} badgeIcon={<TrendingUpIcon sx={{ fontSize: 12 }} />} badgeColorLight="#1d4ed8" badgeColorDark="#60a5fa" badgeRgb="59,130,246" isDark={isDark} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Pending / Failed" value={`${stats.pendingOrders || 0} / ${stats.failedPayments || 0}`} subtitle="Needs attention" icon={<WarningAmberIcon sx={{ fontSize: 22, color: '#fff' }} />} badgeIcon={<WarningAmberIcon sx={{ fontSize: 12 }} />} badgeColorLight="#d97706" badgeColorDark="#fbbf24" badgeRgb="245,158,11" isDark={isDark} /></Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}><StatCard title="Cancelled" value={stats.cancelledSubscriptions || 0} subtitle="Lost subscriptions" icon={<CancelIcon sx={{ fontSize: 22, color: '#fff' }} />} badgeIcon={<TrendingDownIcon sx={{ fontSize: 12 }} />} badgeColorLight="#dc2626" badgeColorDark="#fb7185" badgeRgb="239,68,68" isDark={isDark} /></Grid>
          </>
        )}
      </Grid>

      {/* Filters Card */}
      <Card elevation={0} sx={{ ...glassCard(isDark), mb: 3 }}>
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box component="span" sx={gradientText}>Filters</Box>
                {activeFilterCount > 0 && (
                  <Chip label={activeFilterCount} size="small" sx={{ backgroundImage: GRADIENT_MAIN, color: '#fff', fontWeight: 800, height: 20, minWidth: 20, boxShadow: glowShadow(ACCENT_RGB, 0.6, 12), '& .MuiChip-label': { px: 0.75 } }} />
                )}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Refine your orders search</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={exportToCSV} sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, display: { xs: 'none', sm: 'flex' }, color: isDark ? '#93c5fd' : '#1d4ed8', borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)', bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', '&:hover': { borderColor: ACCENT_HEX, bgcolor: isDark ? 'rgba(59,130,246,0.16)' : 'rgba(59,130,246,0.1)', boxShadow: glowShadow(ACCENT_RGB, 0.5, 16) } }}>Export</Button>
            </Box>
          </Box>

          <TextField fullWidth placeholder="Search by user, dealer, plan..." value={filters.search} onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(0); }} sx={{ mb: 3, ...glassInput(isDark) }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: ACCENT_HEX }} /></InputAdornment> }} />

          <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)' }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: '0.08em' }}>ORDER STATUS</Typography>
              <ToggleButtonGroup value={filters.status || ''} exclusive onChange={(e, val) => { setFilters(f => ({ ...f, status: val })); setPage(0); }} fullWidth size="small" sx={glassToggleSx(isDark)}>
                <ToggleButton value=""><AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />All</ToggleButton>
                <ToggleButton value="Pending"><AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />Pending</ToggleButton>
                <ToggleButton value="Completed"><CheckCircleIcon sx={{ fontSize: 18, mr: 0.5 }} />Completed</ToggleButton>
                <ToggleButton value="Cancelled"><CancelIcon sx={{ fontSize: 18, mr: 0.5 }} />Cancelled</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: '0.08em' }}>ORDER TYPE</Typography>
              <ToggleButtonGroup value={filters.planMode || ''} exclusive onChange={(e, val) => { setFilters(f => ({ ...f, planMode: val })); setPage(0); }} fullWidth size="small" sx={glassToggleSx(isDark)}>
                <ToggleButton value=""><TuneIcon sx={{ fontSize: 18, mr: 0.5 }} />All</ToggleButton>
                <ToggleButton value="subscription"><ShoppingBagIcon sx={{ fontSize: 18, mr: 0.5 }} />Subscription</ToggleButton>
                <ToggleButton value="payment"><AttachMoneyIcon sx={{ fontSize: 18, mr: 0.5 }} />One-time</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          {activeFilterCount > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => { setFilters({ status: '', planMode: '', search: '' }); setPage(0); }} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 700, borderRadius: '10px', '&:hover': { color: ACCENT_HEX, bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)' } }}>Clear all filters</Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Table */}
      <Card elevation={0} sx={{ ...glassCard(isDark), boxShadow: 'none' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
          {loading ? (<Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={32} sx={{ color: ACCENT_HEX }} /></Box>) : orders.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center' }}><ShoppingBagIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 2 }} /><Typography variant="h6" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>No orders found</Typography></Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={headerCellSx(isDark)}>
                    <Checkbox sx={checkboxSx} checked={orders.length > 0 && selectedOrders.length === orders.length} indeterminate={selectedOrders.length > 0 && selectedOrders.length < orders.length} onChange={(e) => handleSelectAll(e.target.checked)} />
                  </TableCell>
                  {!isMobile && <TableCell sx={headerCellSx(isDark)}>Order</TableCell>}
                  <TableCell sx={headerCellSx(isDark)}>Customer</TableCell>
                  {!isTablet && <TableCell sx={headerCellSx(isDark)}>Dealer</TableCell>}
                  <TableCell sx={headerCellSx(isDark)}>Plan</TableCell>
                  <TableCell sx={headerCellSx(isDark)}>Amount</TableCell>
                  <TableCell sx={headerCellSx(isDark)}>Status</TableCell>
                  {!isTablet && <TableCell sx={headerCellSx(isDark)}>Next Billing</TableCell>}
                  <TableCell align="right" sx={headerCellSx(isDark)}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      '& td': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)' },
                      '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.045)' }
                    }}
                  >
                    <TableCell padding="checkbox" sx={rowCellSx(isDark)}>
                      <Checkbox sx={checkboxSx} checked={selectedOrders.includes(order.id)} onChange={() => handleSelectOrder(order.id)} />
                    </TableCell>
                    {!isMobile && (
                      <TableCell sx={rowCellSx(isDark)}>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#64748b' }}>{order.id?.toString().slice(0, 8)}</Typography>
                      </TableCell>
                    )}
                    <TableCell sx={rowCellSx(isDark)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                        <Box sx={{ position: 'relative', borderRadius: '50%', p: '2px', backgroundImage: GRADIENT_MAIN, boxShadow: glowShadow(ACCENT_RGB, 0.5, 12), lineHeight: 0 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: isDark ? '#0f172a' : '#fff', color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: 800, flexShrink: 0 }}>{(order.user_data?.userName || 'U')[0].toUpperCase()}</Avatar>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>{order.user_data?.userName || order.userId}</Typography>
                          <Typography variant="caption" color="text.secondary">{order.user_data?.email || order.stripeCustomerEmail}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    {!isTablet && (
                      <TableCell sx={rowCellSx(isDark)}>
                        {order.dealer?.name ? (
                          <Stack direction="row" spacing={0.5} alignItems="center"><StoreIcon sx={{ fontSize: 14, flexShrink: 0, color: ACCENT_HEX }} /><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{order.dealer.name}</Typography></Stack>
                        ) : (
                          <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#475569' : '#cbd5e1' }}>-</Typography>
                        )}
                      </TableCell>
                    )}
                    <TableCell sx={rowCellSx(isDark)}>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{order.serviceType}</Typography>
                        <Chip label={order.planMode === 'subscription' ? 'Monthly' : 'One-time'} size="small" sx={{ height: 18, fontSize: '0.6rem', mt: 0.5, bgcolor: order.planMode === 'subscription' ? alpha(ACCENT_HEX, 0.12) : alpha('#94a3b8', 0.1), color: order.planMode === 'subscription' ? ACCENT_HEX : '#64748b', fontWeight: 700, boxShadow: order.planMode === 'subscription' ? glowShadow(ACCENT_RGB, 0.4, 8) : 'none' }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={rowCellSx(isDark)}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmt.currency(order.amount)}</Typography>
                    </TableCell>
                    <TableCell sx={rowCellSx(isDark)}>
                      <StatusBadge status={order.status} isDark={isDark} />
                    </TableCell>
                    {!isTablet && (
                      <TableCell sx={rowCellSx(isDark)}>
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
                    <TableCell align="right" sx={rowCellSx(isDark)}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                        <Tooltip title="View Details"><IconButton size="small" onClick={() => openDetail(order)} sx={actionBtnSx('#93c5fd', ACCENT_HEX, ACCENT_RGB)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                        {order.notes && <Tooltip title="Has Notes"><IconButton size="small" onClick={() => { setSelectedOrder(order); setNoteOpen(true); }} sx={actionBtnSx(isDark ? '#fbbf24' : '#d97706', isDark ? '#fcd34d' : '#b45309', '251,146,60')}><NoteAddIcon fontSize="small" /></IconButton></Tooltip>}
                        {order.planMode === 'subscription' && order.status !== 'Cancelled' && (<Tooltip title="Cancel"><IconButton size="small" onClick={() => { setSelectedOrder(order); setCancelOpen(true); }} sx={actionBtnSx(isDark ? '#fb7185' : '#ef4444', isDark ? '#fda4af' : '#b91c1c', '239,68,68')}><CancelIcon fontSize="small" /></IconButton></Tooltip>)}
                        {order.status === 'Cancelled' && order.subscriptionId && (<Tooltip title="Reactivate"><IconButton size="small" onClick={handleReactivate} sx={actionBtnSx(isDark ? '#34d399' : '#059669', isDark ? '#6ee7b7' : '#047857', '16,185,129')}><PlayArrowIcon fontSize="small" /></IconButton></Tooltip>)}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {!loading && orders.length > 0 && (
          <TablePagination component="div" count={totalOrders} page={page} onPageChange={(e, p) => setPage(p)} rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(parseInt(e.target.value, 10)); setPage(0); }} rowsPerPageOptions={[10, 15, 25, 50]} sx={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }} />
        )}
      </Card>
      </>
      )}

      {viewMode === 'history' && (
        <>
          {paymentOverview && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={0} sx={glassCard(isDark)}>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Revenue</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#10b981', mt: 0.5 }}>${paymentOverview.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{paymentOverview.totalPayments} payment{paymentOverview.totalPayments !== 1 ? 's' : ''}</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={0} sx={glassCard(isDark)}>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Failed Payments</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#ef4444', mt: 0.5 }}>{paymentOverview.totalFailed}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>${paymentOverview.totalFailedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lost</Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={0} sx={glassCard(isDark)}>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>By Service Type</Typography>
                    {paymentOverview.byServiceType?.slice(0, 2).map((s, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>{s.serviceType}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>${s.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card elevation={0} sx={glassCard(isDark)}>
                  <Box sx={{ p: 2.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Months</Typography>
                    {paymentOverview.byMonth?.slice(-3).map((m, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{m.month}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>${m.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          )}

        <Card elevation={0} sx={glassCard(isDark)}>
          <Box sx={{ p: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)', position: 'relative', zIndex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>Payment History</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <ToggleButtonGroup value={paymentHistoryFilters.status || ''} exclusive onChange={(e, val) => { setPaymentHistoryFilters(f => ({ ...f, status: val })); setPaymentHistoryPage(0); }} size="small" sx={glassToggleSx(isDark)}>
                <ToggleButton value="">All</ToggleButton>
                <ToggleButton value="paid">Paid</ToggleButton>
                <ToggleButton value="failed">Failed</ToggleButton>
                <ToggleButton value="suspended">Suspended</ToggleButton>
              </ToggleButtonGroup>
              </Stack>
            </Stack>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
            {paymentHistoryLoading ? (<Box sx={{ p: 6, textAlign: 'center' }}><CircularProgress size={32} sx={{ color: ACCENT_HEX }} /></Box>) : paymentHistory.length === 0 ? (
              <Box sx={{ p: 8, textAlign: 'center' }}><ReceiptIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 2 }} /><Typography variant="h6" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>No payment history records yet</Typography><Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>Records will appear after the first monthly subscription charge</Typography></Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={headerCellSx(isDark)}>
                      <Checkbox sx={checkboxSx} checked={paymentHistory.length > 0 && selectedPayments.length === paymentHistory.length} indeterminate={selectedPayments.length > 0 && selectedPayments.length < paymentHistory.length} onChange={(e) => handleSelectAllPayments(e.target.checked)} />
                    </TableCell>
                    <TableCell sx={headerCellSx(isDark)}>Date</TableCell>
                    <TableCell sx={headerCellSx(isDark)}>Description</TableCell>
                    <TableCell sx={headerCellSx(isDark)}>Amount</TableCell>
                    <TableCell sx={headerCellSx(isDark)}>Status</TableCell>
                    {!isTablet && <TableCell sx={headerCellSx(isDark)}>Failed Attempts</TableCell>}
                    {!isTablet && <TableCell sx={headerCellSx(isDark)}>Invoice</TableCell>}
                    <TableCell align="right" sx={headerCellSx(isDark)}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow
                      key={payment.id}
                      hover
                      sx={{
                        '& td': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)' },
                        '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.045)' }
                      }}
                    >
                      <TableCell padding="checkbox" sx={rowCellSx(isDark)}>
                        <Checkbox sx={checkboxSx} checked={selectedPayments.includes(payment.id)} onChange={() => handleSelectPayment(payment.id)} />
                      </TableCell>
                      <TableCell sx={rowCellSx(isDark)}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{fmt.date(payment.createdAt)}</Typography>
                      </TableCell>
                      <TableCell sx={rowCellSx(isDark)}>
                        <Typography sx={{ fontSize: '0.8rem' }}>{payment.description}</Typography>
                        {payment.notes && <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>{payment.notes}</Typography>}
                      </TableCell>
                      <TableCell sx={rowCellSx(isDark)}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{fmt.currency(payment.amount)}</Typography>
                      </TableCell>
                      <TableCell sx={rowCellSx(isDark)}>
                        <PaymentStatusBadge status={payment.status} isDark={isDark} />
                      </TableCell>
                      {!isTablet && (
                        <TableCell sx={rowCellSx(isDark)}>
                          <Typography sx={{ fontSize: '0.8rem', color: payment.failedAttempts > 0 ? '#ef4444' : 'text.secondary', fontWeight: payment.failedAttempts > 0 ? 600 : 400 }}>
                            {payment.failedAttempts > 0 ? `${payment.failedAttempts}/3` : '0'}
                          </Typography>
                        </TableCell>
                      )}
                      {!isTablet && (
                        <TableCell sx={rowCellSx(isDark)}>
                          {payment.stripeInvoiceUrl ? (
                            <a href={payment.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: ACCENT_HEX, textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700 }}>
                              <OpenInNewIcon sx={{ fontSize: 14 }} /> View
                            </a>
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>-</Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell align="right" sx={rowCellSx(isDark)}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                          {payment.stripeInvoiceUrl && (
                            <Tooltip title="View Invoice"><IconButton size="small" component="a" href={payment.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer" sx={actionBtnSx(ACCENT_HEX, '#1d4ed8', ACCENT_RGB)}><OpenInNewIcon fontSize="small" /></IconButton></Tooltip>
                          )}
                          <Tooltip title="View Order"><IconButton size="small" onClick={() => openDetail({ id: payment.orderId })} sx={actionBtnSx('#93c5fd', ACCENT_HEX, ACCENT_RGB)}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {!paymentHistoryLoading && paymentHistory.length > 0 && (
            <TablePagination component="div" count={paymentHistoryTotal} page={paymentHistoryPage} onPageChange={(e, p) => setPaymentHistoryPage(p)} rowsPerPage={paymentHistoryPageSize} rowsPerPageOptions={[25, 50, 100]} sx={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }} />
          )}
        </Card>
        </>
      )}

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => { setDetailOpen(false); setActiveStep(0); }} maxWidth="sm" fullScreen={isMobile} PaperProps={{ sx: { ...dialogSx(isDark), width: isMobile ? '100%' : '90%', maxWidth: 700, m: isMobile ? 0 : 'auto', borderRadius: isMobile ? 0 : '24px' } }}>
        <DialogTitle sx={{ fontWeight: 800, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)', pb: 1, px: { xs: 2, sm: 3 }, letterSpacing: '-0.01em' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={gradientIconBox(36, '12px', selectedOrder?.planMode === 'subscription' ? GRADIENT_MAIN : GRADIENT_GREEN, selectedOrder?.planMode === 'subscription' ? ACCENT_RGB : '16,185,129')}>
                {selectedOrder?.planMode === 'subscription' ? <ShoppingBagIcon sx={{ fontSize: 18, color: '#fff' }} /> : <AttachMoneyIcon sx={{ fontSize: 18, color: '#fff' }} />}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                  {selectedOrder?.planMode === 'subscription' ? 'Subscription' : 'Order'} Details
                </Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                  {selectedOrder?.id?.toString().slice(0, 8)}...
                </Typography>
              </Box>
            </Stack>
            {selectedOrder?.subscriptionId && (
              <Button size="small" startIcon={actionLoading ? <CircularProgress size={16} /> : <SyncIcon />} onClick={() => syncSubscription(selectedOrder)} disabled={actionLoading} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: ACCENT_HEX, '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)' } }}>Sync</Button>
            )}
          </Stack>
        </DialogTitle>

        <Stepper activeStep={activeStep} sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 }, pb: 0, '& .MuiStepIcon-root': { color: isDark ? '#334155' : '#cbd5e1' }, '& .MuiStepIcon-root.Mui-active': { color: ACCENT_HEX }, '& .MuiStepIcon-root.Mui-completed': { color: ACCENT_HEX }, '& .MuiStepConnector-line': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.2)' } }}>
          {['Overview', selectedOrder?.planMode === 'subscription' ? 'Subscription' : 'Billing', 'Payment', 'History'].map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 700 } }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <DialogContent sx={{ p: { xs: 2, sm: 3 }, minHeight: 320 }}>
          {selectedOrder && (
            <>
              {/* Step 0: Overview */}
              {activeStep === 0 && (
                <Stack spacing={3}>
                  <Paper elevation={0} sx={subPaperSx(isDark)}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} flexWrap="wrap" gap={2}>
                      <Stack spacing={0.5}>
                        <Typography variant="h3" sx={{ ...gradientText, fontWeight: 800, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>{fmt.currency(selectedOrder.amount)}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {selectedOrder.planMode === 'subscription' ? `${selectedOrder.intervalCount || 1} ${selectedOrder.interval || 'month'}ly subscription` : 'One-time payment'}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={{ xs: 1.5, sm: 2.5 }} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                        <StatusBadge status={selectedOrder.status} isDark={isDark} />
                        {selectedOrder.cancelAtPeriodEnd && <Chip label="Cancels at period end" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: alpha('#f59e0b', 0.15), color: '#f59e0b', fontWeight: 700 }} />}
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Plan</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.85rem' }}>{selectedOrder.serviceType}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Dealer</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{selectedOrder.dealer?.name || '-'}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Created</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{fmt.relative(selectedOrder.createdAt)}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Currency</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{(selectedOrder.currency || 'usd').toUpperCase()}</Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1, letterSpacing: '0.06em' }}>Customer</Typography>
                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ position: 'relative', borderRadius: '50%', p: '2px', backgroundImage: GRADIENT_MAIN, boxShadow: glowShadow(ACCENT_RGB, 0.5, 12), lineHeight: 0 }}>
                            <Avatar sx={{ width: 40, height: 40, bgcolor: isDark ? '#0f172a' : '#fff', color: isDark ? '#93c5fd' : '#1d4ed8', fontWeight: 800 }}>{(selectedOrder.user_data?.userName || selectedOrder.stripeCustomerEmail || 'U')[0].toUpperCase()}</Avatar>
                          </Box>
                          <Stack>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{selectedOrder.user_data?.userName || selectedOrder.userId}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{selectedOrder.user_data?.email || selectedOrder.stripeCustomerEmail}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1, letterSpacing: '0.06em' }}>Dealer</Typography>
                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        {selectedOrder.dealer ? (
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={gradientIconBox(40, '12px', GRADIENT_MAIN, ACCENT_RGB)}>
                              <StoreIcon sx={{ fontSize: 20, color: '#fff' }} />
                            </Box>
                            <Stack>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{selectedOrder.dealer.name}</Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: selectedOrder.dealer.isActive ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                                {selectedOrder.dealer.isActive ? 'Active' : 'Inactive'}
                              </Typography>
                            </Stack>
                          </Stack>
                        ) : (
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <StoreIcon sx={{ fontSize: 20, color: isDark ? '#475569' : '#cbd5e1' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>No dealer associated</Typography>
                          </Stack>
                        )}
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={0} sx={subPaperSx(isDark)}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1, letterSpacing: '0.06em' }}>References</Typography>
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
                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5, letterSpacing: '0.06em' }}>Billing Cycle</Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Amount</Typography>
                            <Typography sx={{ ...gradientText, fontWeight: 800, fontSize: '1.1rem', mt: 0.25 }}>{fmt.currency(selectedOrder.amount)}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Interval</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mt: 0.25, textTransform: 'capitalize' }}>{selectedOrder.interval || 'month'}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Quantity</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mt: 0.25 }}>{selectedOrder.quantity || 1}</Typography>
                          </Grid>
                          <Grid size={{ xs: 6, md: 3 }}>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Next Billing</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', mt: 0.25 }}>{selectedOrder.nextBillingDate ? fmt.date(selectedOrder.nextBillingDate) : '-'}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5, letterSpacing: '0.06em' }}>Current Period</Typography>
                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Period Start</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{selectedOrder.currentPeriodStart ? fmt.date(selectedOrder.currentPeriodStart) : '-'}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Period End</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{selectedOrder.currentPeriodEnd ? fmt.date(selectedOrder.currentPeriodEnd) : '-'}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Cancel at Period End</Typography>
                            <Chip label={selectedOrder.cancelAtPeriodEnd ? 'Yes' : 'No'} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: selectedOrder.cancelAtPeriodEnd ? alpha('#f59e0b', 0.15) : alpha('#10b981', 0.15), color: selectedOrder.cancelAtPeriodEnd ? '#f59e0b' : '#10b981', fontWeight: 700 }} />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Failed Attempts</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: selectedOrder.failedPaymentAttempts > 0 ? '#ef4444' : 'inherit' }}>{selectedOrder.failedPaymentAttempts || 0}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>

                      {(selectedOrder.trialEnd || selectedOrder.subscriptionEndDate || selectedOrder.cancelledAt) && (
                        <Paper elevation={0} sx={subPaperSx(isDark)}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5, letterSpacing: '0.06em' }}>Lifecycle</Typography>
                          <Stack spacing={1.5}>
                            {selectedOrder.trialEnd && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Trial End</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.trialEnd)}</Typography>
                              </Stack>
                            )}
                            {selectedOrder.subscriptionEndDate && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Subscription Ended</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.subscriptionEndDate)}</Typography>
                              </Stack>
                            )}
                            {selectedOrder.cancelledAt && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Cancelled At</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{fmt.date(selectedOrder.cancelledAt)}</Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Paper>
                      )}

                      {subDetails && (
                        <Paper elevation={0} sx={{ ...subPaperSx(isDark), border: `1px solid ${alpha(ACCENT_HEX, 0.25)}`, boxShadow: glowShadow(ACCENT_RGB, 0.15, 16) }}>
                          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: glowShadow('16,185,129', 0.6, 6) }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: ACCENT_HEX, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>Live from Stripe</Typography>
                          </Stack>
                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Status</Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'capitalize', mt: 0.25 }}>{subDetails.status}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Amount</Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', mt: 0.25 }}>{subDetails.amount ? fmt.currency(subDetails.amount) : '-'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Interval</Typography>
                              <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'capitalize', mt: 0.25 }}>{subDetails.interval}</Typography>
                            </Grid>
                            <Grid size={{ xs: 6, md: 3 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>Customer</Typography>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', mt: 0.25 }}>{subDetails.customerEmail || '-'}</Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </>
                  ) : (
                    <Paper elevation={0} sx={{ ...subPaperSx(isDark), textAlign: 'center' }}>
                      <Box sx={{ display: 'inline-flex', mb: 1 }}>
                        <Box sx={gradientIconBox(56, '16px', GRADIENT_GREEN, '16,185,129')}>
                          <AttachMoneyIcon sx={{ fontSize: 26, color: '#fff' }} />
                        </Box>
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>One-time Payment</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>This was a single payment, not a recurring subscription.</Typography>
                      <Stack direction="row" justifyContent="center" spacing={3} sx={{ mt: 2 }}>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Amount</Typography>
                          <Typography sx={{ ...gradientText, fontWeight: 800, fontSize: '1.3rem', mt: 0.25 }}>{fmt.currency(selectedOrder.amount)}</Typography>
                        </Stack>
                        <Stack alignItems="center">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700 }}>Date</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mt: 0.25 }}>{fmt.date(selectedOrder.createdAt)}</Typography>
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
                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={gradientIconBox(56, '14px', GRADIENT_MAIN, ACCENT_RGB)}>
                            <CreditCardIcon sx={{ fontSize: 24, color: '#fff' }} />
                          </Box>
                          <Stack>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', textTransform: 'capitalize' }}>{selectedOrder.stripeBrand}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontFamily: 'monospace' }}>•••• •••• •••• {selectedOrder.stripeLast4}</Typography>
                          </Stack>
                          <Box sx={{ ml: 'auto' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Expires</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{selectedOrder.stripeExpMonth}/{selectedOrder.stripeExpYear}</Typography>
                          </Box>
                        </Stack>
                      </Paper>

                      {selectedOrder.stripeInvoiceUrl && (
                        <Paper elevation={0} sx={subPaperSx(isDark)}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box sx={gradientIconBox(32, '10px', GRADIENT_MAIN, ACCENT_RGB)}>
                                <ReceiptIcon sx={{ fontSize: 15, color: '#fff' }} />
                              </Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Latest Invoice</Typography>
                            </Stack>
                            <Button size="small" href={selectedOrder.stripeInvoiceUrl} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: ACCENT_HEX, '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)' } }}>
                              View Invoice
                            </Button>
                          </Stack>
                        </Paper>
                      )}

                      <Paper elevation={0} sx={subPaperSx(isDark)}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 1.5, letterSpacing: '0.06em' }}>Payment History</Typography>
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
                            <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', fontFamily: 'monospace' }}>{selectedOrder.lastStripeEvent || '-'}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </>
                  ) : (
                    <Paper elevation={0} sx={{ ...subPaperSx(isDark), textAlign: 'center' }}>
                      <CreditCardIcon sx={{ fontSize: 48, color: isDark ? '#475569' : '#cbd5e1', mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>No Payment Method</Typography>
                      <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>No card details stored for this order.</Typography>
                    </Paper>
                  )}
                </Stack>
              )}

              {/* Step 3: History / Notes */}
              {activeStep === 3 && (
                <Stack spacing={3}>
                  {selectedOrder.cancellationReason ? (
                    <Paper elevation={0} sx={{ ...subPaperSx(isDark), border: `1px solid ${alpha('#ef4444', 0.3)}` }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Box sx={gradientIconBox(28, '8px', GRADIENT_DANGER, '239,68,68')}>
                          <CancelIcon sx={{ fontSize: 15, color: '#fff' }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>Cancelled</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedOrder.cancellationReason}</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>Cancelled on {fmt.date(selectedOrder.cancelledAt)}</Typography>
                    </Paper>
                  ) : (
                    <Paper elevation={0} sx={{ ...subPaperSx(isDark), border: `1px solid ${alpha('#10b981', 0.3)}` }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={gradientIconBox(28, '8px', GRADIENT_GREEN, '16,185,129')}>
                          <CheckCircleIcon sx={{ fontSize: 15, color: '#fff' }} />
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#10b981', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>Active — No Cancellations</Typography>
                      </Stack>
                    </Paper>
                  )}

                  {selectedOrder.notes ? (
                    <Paper elevation={0} sx={subPaperSx(isDark)}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.06em' }}>Notes</Typography>
                        <Button size="small" startIcon={<NoteAddIcon />} onClick={() => { setSelectedOrder(selectedOrder); setNoteOpen(true); setDetailOpen(false); }} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: ACCENT_HEX, '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)' } }}>Add Note</Button>
                      </Stack>
                      <Box sx={{ borderRadius: '12px', p: 2, bgcolor: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.5)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.1)'}` }}>
                        {selectedOrder.notes.split('\n').map((note, i) => (
                          <Typography key={i} sx={{ fontSize: '0.8rem', fontFamily: 'monospace', py: 0.5, borderBottom: i < selectedOrder.notes.split('\n').length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)'}` : 'none' }}>
                            {note}
                          </Typography>
                        ))}
                      </Box>
                    </Paper>
                  ) : (
                    <Paper elevation={0} sx={{ ...subPaperSx(isDark), textAlign: 'center' }}>
                      <NoteAddIcon sx={{ fontSize: 40, color: isDark ? '#475569' : '#cbd5e1', mb: 1 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>No Notes</Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, mb: 1.5 }}>Add internal notes about this order.</Typography>
                      <Button size="small" startIcon={<NoteAddIcon />} onClick={() => { setSelectedOrder(selectedOrder); setNoteOpen(true); setDetailOpen(false); }} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: ACCENT_HEX, '&:hover': { bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)' } }}>Add Note</Button>
                    </Paper>
                  )}
                </Stack>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 1.5, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Button size="small" disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Previous</Button>
              <Button size="small" disabled={activeStep === 3} onClick={() => setActiveStep(s => s + 1)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, color: ACCENT_HEX }}>Next</Button>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'center', sm: 'flex-end' }, mt: { xs: 0.5, sm: 0 } }}>
              {selectedOrder?.planMode === 'subscription' && selectedOrder?.status !== 'Cancelled' && (
                <Button size="small" variant="contained" onClick={() => { setCancelOpen(true); setDetailOpen(false); }} startIcon={<CancelIcon />} sx={{ ...gradientButton(GRADIENT_DANGER, '239,68,68'), px: 2 }}>Cancel Subscription</Button>
              )}
              {selectedOrder?.status === 'Cancelled' && selectedOrder?.subscriptionId && (
                <Button size="small" color="success" onClick={handleReactivate} startIcon={<PlayArrowIcon />} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Reactivate</Button>
              )}
              <Button size="small" onClick={() => { setDetailOpen(false); setActiveStep(0); }} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Close</Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} PaperProps={{ sx: dialogSx(isDark) }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={gradientIconBox(36, '10px', GRADIENT_DANGER, '239,68,68')}>
            <CancelIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          Cancel Subscription
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2, fontSize: '0.85rem', color: 'text.secondary' }}>This will cancel the subscription for <strong>{selectedOrder?.dealer?.name || selectedOrder?.serviceType}</strong>. The dealer will be deactivated.</Typography>
          <TextField fullWidth multiline minRows={3} label="Cancellation reason (optional)" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} sx={glassInput(isDark)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Back</Button>
          <Button variant="contained" onClick={handleCancelSubscription} disabled={actionLoading} sx={{ ...gradientButton(GRADIENT_DANGER, '239,68,68'), px: 2 }}>{actionLoading ? <CircularProgress size={20} /> : 'Confirm Cancel'}</Button>
        </DialogActions>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} PaperProps={{ sx: dialogSx(isDark) }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={gradientIconBox(36, '10px', GRADIENT_MAIN, ACCENT_RGB)}>
            <NoteAddIcon sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          Add Note
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline minRows={4} label="Note" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add internal note about this order..." sx={glassInput(isDark)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteOpen(false)} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
          <Button onClick={handleAddNote} disabled={actionLoading || !noteText.trim()} variant="contained" sx={gradientButton()}>{actionLoading ? <CircularProgress size={20} /> : 'Save Note'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snackbar.open && (
        <Paper sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', px: 3, py: 1.5, borderRadius: '14px', bgcolor: snackbar.severity === 'error' ? '#ef4444' : '#10b981', color: '#fff', zIndex: 9999, boxShadow: glowShadow(snackbar.severity === 'error' ? '239,68,68' : '16,185,129', 0.5, 24), display: 'flex', alignItems: 'center', gap: 1, backdropFilter: 'blur(8px)' }}>
          {snackbar.severity === 'error' ? <WarningAmberIcon sx={{ fontSize: 18 }} /> : <CheckCircleIcon sx={{ fontSize: 18 }} />}
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{snackbar.message}</Typography>
        </Paper>
      )}
      </Box>
    </Box>
  );
};

export default Orders;
