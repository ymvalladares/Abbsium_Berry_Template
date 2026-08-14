import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Checkbox,
  Chip,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Menu,
  Skeleton
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useNotification } from 'contexts/NotificationContext';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from 'services/AxiosService';

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

const ACCENT_RGB = '59,130,246';

const dialogSx = (isDark) => ({
  ...glassCard(isDark),
  borderRadius: '24px',
  p: 1.5,
  boxShadow: isDark
    ? '0 32px 80px -20px rgba(2,6,23,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
    : '0 32px 80px -24px rgba(30,58,138,0.3), inset 0 1px 0 rgba(255,255,255,0.95)'
});

const StatsCard = ({ title, value, subtitle, trend, trendValue, color, isDark, icon: Icon }) => {
  const isPositive = trend === 'up';

  return (
    <Card elevation={0} sx={{ ...glassCard(isDark), height: '100%' }}>
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ ...gradientText, fontWeight: 800, fontSize: { xs: '1.45rem', md: '1.75rem' }, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              {value}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.3, fontWeight: 600 }}>{title}</Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.3 }}>{subtitle}</Typography>
            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 15, color: '#34d399' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 15, color: '#fb7185' }} />
                )}
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, color: isPositive ? '#34d399' : '#fb7185' }}>
                  {trendValue} this week
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={gradientIconBox(42, '12px', GRADIENT_MAIN, ACCENT_RGB)}>
            <Icon sx={{ color: '#fff', fontSize: 21 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TH = ({ children, align = 'left' }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <TableCell
      align={align}
      sx={{
        fontWeight: 800,
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: isDark ? '#e2e8f0' : '#334155',
        py: 1.5,
        bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
        borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}`,
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </TableCell>
  );
};

const StatusChip = ({ active }) => {
  return (
    <Chip
      label={active ? 'Active' : 'Inactive'}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: '0.72rem',
        borderRadius: '8px',
        bgcolor: active ? 'rgba(20,184,166,0.12)' : 'rgba(107,114,128,0.1)',
        color: active ? '#0D9488' : '#6B7280',
        border: `1px solid ${active ? 'rgba(13,148,136,0.4)' : 'rgba(107,114,128,0.3)'}`,
        boxShadow: active ? glowShadow('20,184,166', 0.4, 10) : 'none',
        px: 0.25,
        height: 26
      }}
    />
  );
};

const RowMenu = ({ dealerName, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    setAnchor(null);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete();
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: 'text.secondary', borderRadius: '10px', bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.05)', transition: 'all 0.2s', '&:hover': { color: '#3b82f6', bgcolor: isDark ? 'rgba(59,130,246,0.14)' : 'rgba(59,130,246,0.1)' } }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 0, sx: { ...glassCard(isDark), borderRadius: '16px', width: 168, mt: 0.5, py: 0.75 } }}
      >
        <MenuItem
          sx={{ fontSize: '0.85rem', gap: 1.25, fontWeight: 600, borderRadius: '10px', mx: 0.5, px: 1.25 }}
          onClick={() => {
            setAnchor(null);
            onEdit();
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 17, color: '#3b82f6' }} /> Edit
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '0.85rem', gap: 1.25, color: 'error.main', fontWeight: 600, borderRadius: '10px', mx: 0.5, px: 1.25 }}
          onClick={handleDeleteClick}
        >
          <DeleteOutlineIcon sx={{ fontSize: 17 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: dialogSx(isDark) }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={gradientIconBox(36, '10px', GRADIENT_DANGER, '239,68,68')}>
              <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            Delete Dealer?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{dealerName}</strong>? This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}
            sx={{ ...gradientButton(GRADIENT_DANGER, '239,68,68'), textTransform: 'none', fontWeight: 700 }}>Delete</Button>
        </Box>
      </Dialog>
    </>
  );
};

export default function DealersList() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();

  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editDealer, setEditDealer] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState(null);
  const fileInputRef = useRef(null);

  const [dealerForm, setDealerForm] = useState({
    name: '',
    domain: '',
    logo: '',
    primaryColor: '#5E35B1',
    ownerEmail: '',
    isActive: true
  });

  const fetchDealers = async () => {
    setLoading(true);
    try {
      const response = await api.get('Dealer/All-Dealers');
      setDealers(response.data);
    } catch (err) {
      console.error('Error fetching dealers:', err);
      notify.error('Could not load dealers. Please refresh the page.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
  }, []);

  const filtered = dealers.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.toLowerCase().includes(search.toLowerCase()) ||
      d.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || (statusFilter === 'Active' && d.isActive) || (statusFilter === 'Inactive' && !d.isActive);
    return matchSearch && matchStatus;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? [] : paginated.map((r) => r.id));
  const toggleRow = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleFormChange = (field) => (e) => {
    setDealerForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setDealerForm((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openEditDialog = (dealer) => {
    setEditDealer(dealer);
    setLogoPreview(dealer.logo || null);
    setDealerForm({
      name: dealer.name,
      domain: dealer.domain,
      logo: dealer.logo || '',
      primaryColor: dealer.primaryColor || '#5E35B1',
      ownerEmail: dealer.ownerEmail,
      isActive: dealer.isActive
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!editDealer) return;

    if (!dealerForm.name || !dealerForm.domain || !dealerForm.ownerEmail) {
      notify.error('Please fill in all required fields', 'Missing Information');
      return;
    }

    try {
      await api.post('/Dealer/Upsert', {
        id: editDealer.id,
        ...dealerForm
      });
      notify.success('Dealer has been updated successfully', 'Dealer Updated');
      setOpenDialog(false);
      fetchDealers();
    } catch (err) {
      console.error('Dealer save error:', err);
      notify.error(err.response?.data?.message || 'Could not save dealer', 'Save Failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/Dealer/Delete/${id}`);
      notify.success('Dealer has been removed from the system', 'Dealer Deleted');
      fetchDealers();
      setSelected((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error('Delete dealer error:', err);
      notify.error('Could not delete the dealer. Please try again.', 'Delete Failed');
    }
  };

  const handleDeleteSelected = () => {
    setPendingDeleteIds([...selected]);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteSelected = async () => {
    setDeleteConfirmOpen(false);
    for (const id of pendingDeleteIds) {
      try {
        await api.delete(`/Dealer/Delete/${id}`);
      } catch (err) {
        console.error(`Failed to delete dealer ${id}:`, err);
      }
    }
    notify.success(`${pendingDeleteIds.length} dealer(s) removed`, 'Dealers Deleted');
    setSelected([]);
    setPendingDeleteIds(null);
    fetchDealers();
  };

  const stats = [
    {
      title: 'Total Dealers',
      value: dealers.length.toString(),
      change: '+12%',
      subtitle: 'All registered',
      color: '#9b87f5',
      isPositive: true
    },
    {
      title: 'Active Dealers',
      value: dealers.filter((d) => d.isActive).length.toString(),
      change: '+8%',
      subtitle: 'Currently active',
      color: '#4ade80',
      isPositive: true
    },
    {
      title: 'Inactive Dealers',
      value: dealers.filter((d) => !d.isActive).length.toString(),
      change: '-3%',
      subtitle: 'Suspended or inactive',
      color: '#f87171',
      isPositive: false
    },
    { title: 'Total Users', value: '—', change: '', subtitle: 'Across all dealers', color: '#fbbf24', isPositive: true }
  ];

  const checkboxSx = { color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } };

  return (
    <Box sx={{ position: 'relative', py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%' }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          {loading ? (
            <>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 0.5, bgcolor: 'rgba(148,163,184,0.18)' }} />
              <Skeleton variant="text" width={120} height={20} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
            </>
          ) : (
            <>
              <Typography sx={{ ...gradientText, fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.5rem' }, letterSpacing: '-0.02em' }}>Manage Dealers</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.25 }}>{dealers.length} dealer(s) registered</Typography>
            </>
          )}
        </Box>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {loading ? (
          stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card elevation={0} sx={{ ...glassCard(isDark), height: '100%' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={100} height={32} sx={{ mb: 1, bgcolor: 'rgba(148,163,184,0.18)' }} />
                      <Skeleton variant="text" width={80} height={20} sx={{ mb: 0.5, bgcolor: 'rgba(148,163,184,0.18)' }} />
                      <Skeleton variant="text" width={120} height={16} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                    </Box>
                    <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: 2, bgcolor: 'rgba(148,163,184,0.18)' }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard {...stat} icon={StorefrontIcon} isDark={isDark} />
          </Grid>
          ))
        )}
      </Grid>

      {!loading && (
        <Card elevation={0} sx={{ ...glassCard(isDark), mb: 0, boxShadow: 'none' }}>
        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)', position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: { xs: 'flex', sm: 'flex' },
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: { sm: 1.5, md: 2 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { sm: 1, md: 1.5 }, flex: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search by name, domain or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px', bgcolor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.6)', '& fieldset': { border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.15)'}` }, '&:hover fieldset': { borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)' }, '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1.5px' } }
                }}
                sx={{ minWidth: { sm: 220, md: 260 } }}
              />

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  displayEmpty
                  IconComponent={() => null}
                  sx={{
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    bgcolor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.6)',
                    '& fieldset': { border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.15)'}` },
                    '&:hover fieldset': { borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1.5px' },
                    '& .MuiSelect-select': { pl: 2, pr: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }
                  }}
                  renderValue={(selectedValue) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: statusFilter === 'All' ? 'text.secondary' : statusFilter === 'Active' ? '#10b981' : '#ef4444',
                          boxShadow: statusFilter === 'All' ? 'none' : glowShadow(statusFilter === 'Active' ? '16,185,129' : '239,68,68', 0.6, 6)
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {selectedValue === 'All' ? 'All Status' : selectedValue}
                      </Typography>
                    </Box>
                  )}
                >
                  <MenuItem value="All">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                      All Status
                    </Box>
                  </MenuItem>
                  <MenuItem value="Active">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                      Active
                    </Box>
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444' }} />
                      Inactive
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {selected.length > 0 && (
              <Button
                size="small"
                onClick={handleDeleteSelected}
                sx={{
                  textTransform: 'none',
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  borderRadius: '10px',
                  px: 1.5,
                  border: '1px solid',
                  borderColor: 'rgba(239,68,68,0.5)',
                  bgcolor: 'rgba(239,68,68,0.06)',
                  '&:hover': { bgcolor: '#ef4444', color: '#fff', boxShadow: glowShadow('239,68,68', 0.5, 16) }
                }}
              >
                Delete Selected ({selected.length})
              </Button>
            )}
          </Box>
        </Box>

        <TableContainer sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { height: 6 } }}>
          {loading ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}`, pl: 2, minWidth: 120 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                      <Skeleton variant="text" width={30} height={16} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={60} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={80} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={120} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={80} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={60} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  <TableCell align="right" sx={{ bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)', borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}` }}><Skeleton variant="text" width={30} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="circular" width={20} height={20} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                        <Skeleton variant="text" width={60} height={16} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                      <Stack direction="row" spacing={1.75} alignItems="center">
                        <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2, bgcolor: 'rgba(148,163,184,0.18)' }} />
                        <Box>
                          <Skeleton variant="text" width={100} height={20} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                          <Skeleton variant="text" width={80} height={16} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}><Skeleton variant="text" width={80} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                    <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}><Skeleton variant="text" width={120} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                    <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}><Skeleton variant="text" width={80} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                    <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}><Skeleton variant="rounded" width={60} height={26} sx={{ borderRadius: '8px', bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                    <TableCell align="right" sx={{ pr: 1.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}><Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(148,163,184,0.18)' }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  padding="checkbox"
                  sx={{
                    bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
                    borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}`,
                    pl: 2,
                    minWidth: 120
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" sx={checkboxSx} checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={toggleAll} />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#e2e8f0' : '#334155', fontSize: '0.75rem', letterSpacing: '0.06em' }}>
                      ID
                    </Typography>
                  </Box>
                </TableCell>
                <TH>Dealer</TH>
                <TH>Domain</TH>
                <TH>Owner Email</TH>
                <TH>Created</TH>
                <TH>Status</TH>
                <TH align="right"> </TH>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginated.map((item) => (
                <TableRow
                  key={item.id}
                  selected={selected.includes(item.id)}
                  sx={{
                    '&:hover': { '& td': { bgcolor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.045)' } },
                    '&:last-child td': { borderBottom: 0 },
                    '&.Mui-selected': { '& td': { bgcolor: 'rgba(59,130,246,0.12)' } },
                    '& td': { transition: 'background-color 0.15s ease' }
                  }}
                >
                  <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox size="small" sx={checkboxSx} checked={selected.includes(item.id)} onChange={() => toggleRow(item.id)} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#3b82f6', fontSize: '0.78rem' }}
                      >
                        {item.id.toString().slice(0, 8)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <Stack direction="row" spacing={1.75} alignItems="center">
                      <Box sx={{ position: 'relative', borderRadius: '12px', p: '2px', backgroundImage: GRADIENT_MAIN, boxShadow: glowShadow(ACCENT_RGB, 0.4, 10), lineHeight: 0 }}>
                        <Avatar
                          variant="rounded"
                          src={item.logo}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '10px',
                            bgcolor: item.primaryColor || '#3b82f6',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1.1rem'
                          }}
                        >
                          {!item.logo && item.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: 'text.primary', lineHeight: 1.3 }}>
                          {item.name}
                        </Typography>
                        {item.primaryColor && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: 1,
                                bgcolor: item.primaryColor,
                                border: '1px solid',
                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.2)'
                              }}
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Brand color</Typography>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#3b82f6', fontWeight: 600 }}>{item.domain}</Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>{item.ownerEmail}</Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 600 }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <StatusChip active={item.isActive} />
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 1.5, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <RowMenu dealerName={item.name} onEdit={() => openEditDialog(item)} onDelete={() => handleDelete(item.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)' }}>
                    <StorefrontIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                      {search || statusFilter !== 'All' ? 'No dealers match your filters' : 'No dealers registered yet'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </TableContainer>

        {!loading && (
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(59,130,246,0.08)', '& .MuiTablePagination-toolbar': { px: 2 } }}
          />
        )}
      </Card>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: dialogSx(isDark) }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={gradientIconBox(36, '10px', GRADIENT_DANGER, '239,68,68')}>
              <WarningAmberRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            Delete {pendingDeleteIds?.length} Dealer(s)?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{pendingDeleteIds?.length}</strong> selected dealer(s)? This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteSelected}
            sx={{ ...gradientButton(GRADIENT_DANGER, '239,68,68'), textTransform: 'none', fontWeight: 700 }}>Delete All</Button>
        </Box>
      </Dialog>

      {/* Add/Edit Dealer Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: dialogSx(isDark) }}
      >
        <Box sx={{ position: 'sticky', top: 0, zIndex: 5, height: 5, borderRadius: '24px 24px 0 0', backgroundImage: GRADIENT_MAIN, boxShadow: glowShadow(ACCENT_RGB, 0.5, 8) }} />
        <DialogTitle sx={{ px: 3, pt: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 44, height: 44, backgroundImage: GRADIENT_MAIN, boxShadow: glowShadow(ACCENT_RGB, 0.5, 14), fontWeight: 800 }}>
              <AutoAwesomeIcon sx={{ fontSize: 22 }} />
            </Avatar>
            <Box>
              <Typography sx={{ ...gradientText, fontWeight: 800, fontSize: '1.25rem' }}>Edit Dealer</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>Update dealer information</Typography>
            </Box>
          </Box>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              color: 'text.secondary',
              borderRadius: '10px',
              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.05)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(59,130,246,0.2)'}`,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: isDark ? 'rgba(251,113,133,0.15)' : 'rgba(251,113,133,0.1)', color: '#fb7185', transform: 'rotate(90deg)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.1)' }} />
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Logo Upload */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '18px',
                  border: `2px dashed ${isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.6)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: glowShadow(ACCENT_RGB, 0.15, 14),
                  '&:hover': { borderColor: '#3b82f6', bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)' }
                }}
              >
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                {logoPreview ? (
                  <Box component="img" src={logoPreview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <CloudUploadIcon sx={{ fontSize: 28, color: isDark ? '#64748b' : '#94a3b8' }} />
                )}
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 1 }}>Upload logo (optional)</Typography>
            </Box>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Dealer Name *"
                  placeholder="e.g. AutoMax Motors"
                  value={dealerForm.name}
                  onChange={handleFormChange('name')}
                  sx={glassInput(isDark)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Domain (subdomain) *"
                  placeholder="e.g. automax"
                  value={dealerForm.domain}
                  onChange={handleFormChange('domain')}
                  sx={glassInput(isDark)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TextField
                    fullWidth
                    label="Primary Color"
                    value={dealerForm.primaryColor}
                    onChange={handleFormChange('primaryColor')}
                    sx={glassInput(isDark)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <input
                            type="color"
                            value={dealerForm.primaryColor}
                            onChange={handleFormChange('primaryColor')}
                            style={{ width: 32, height: 32, border: 'none', cursor: 'pointer', borderRadius: 6 }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Owner Email *"
                  placeholder="dealer@example.com"
                  type="email"
                  value={dealerForm.ownerEmail}
                  onChange={handleFormChange('ownerEmail')}
                  sx={glassInput(isDark)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth sx={glassInput(isDark)}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={dealerForm.isActive ? 'Active' : 'Inactive'}
                    label="Status"
                    onChange={(e) => setDealerForm((prev) => ({ ...prev, isActive: e.target.value === 'Active' }))}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(59,130,246,0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
              color: 'text.secondary',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(59,130,246,0.06)', color: '#3b82f6' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<CheckCircleIcon />}
            sx={{ ...gradientButton(), px: 3 }}
          >
            Update Dealer
          </Button>
        </Box>
      </Dialog>
      </Box>
    </Box>
  );
}
