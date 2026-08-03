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
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
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
import PeopleIcon from '@mui/icons-material/People';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import api from 'services/AxiosService';

const StatsCard = ({ title, value, subtitle, trend, trendValue, iconBgColor, icon: Icon }) => {
  const theme = useTheme();
  const isPositive = trend === 'up';

  return (
    <Card
      sx={{ height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, bgcolor: 'background.paper' }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.45rem', md: '1.75rem' }, color: 'text.heading', lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.3 }}>{title}</Typography>
            <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.3 }}>{subtitle}</Typography>
            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 15, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 15, color: 'error.main' }} />
                )}
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: isPositive ? 'success.main' : 'error.main' }}>
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

const TH = ({ children, align = 'left' }) => {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  return (
    <TableCell
      align={align}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'text.secondary',
        py: 1.5,
        bgcolor: isDark ? 'grey.900' : 'grey.100',
        borderBottom: '1px solid',
        borderColor: 'divider',
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
        fontWeight: 600,
        fontSize: '0.72rem',
        borderRadius: '8px',
        bgcolor: active ? 'rgba(20,184,166,0.12)' : 'rgba(107,114,128,0.1)',
        color: active ? '#0D9488' : '#6B7280',
        border: 'none',
        px: 0.25,
        height: 26
      }}
    />
  );
};

const RowMenu = ({ dealerName, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: 'text.secondary' }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 2, sx: { borderRadius: 2, minWidth: 148, border: '1px solid', borderColor: 'divider' } }}
      >
        <MenuItem
          sx={{ fontSize: '0.85rem', gap: 1.25 }}
          onClick={() => {
            setAnchor(null);
            onEdit();
          }}
        >
          <EditOutlinedIcon sx={{ fontSize: 17, color: 'text.secondary' }} /> Edit
        </MenuItem>
        <MenuItem
          sx={{ fontSize: '0.85rem', gap: 1.25, color: 'error.main' }}
          onClick={handleDeleteClick}
        >
          <DeleteOutlineIcon sx={{ fontSize: 17 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberRoundedIcon color="warning" />
            Delete Dealer?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{dealerName}</strong>? This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}
            sx={{ textTransform: 'none', fontWeight: 600 }}>Delete</Button>
        </Box>
      </Dialog>
    </>
  );
};

export default function DealersList() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
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

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      bgcolor: isDark ? '#1e293b' : '#f8fafc',
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0', borderWidth: '1.5px' },
      '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#cbd5e1' },
      '&.Mui-focused fieldset': {
        borderColor: '#5E35B1',
        borderWidth: '2px',
        boxShadow: isDark ? 'none' : '0 0 0 3px rgba(94,53,177,0.1)'
      },
      '& input, & textarea': {
        py: 1.5,
        fontSize: '0.9rem',
        color: isDark ? '#f1f5f9' : '#0f172a'
      }
    },
    '& .MuiInputLabel-root': {
      color: isDark ? '#94a3b8' : '#64748b',
      '&.Mui-focused': { color: '#5E35B1' }
    }
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

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          {loading ? (
            <>
              <Skeleton variant="text" width={180} height={32} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={120} height={20} />
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.15rem', sm: '1.5rem' }, color: 'text.primary' }}>Manage Dealers</Typography>
              <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.25 }}>{dealers.length} dealer(s) registered</Typography>
            </>
          )}
        </Box>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {loading ? (
          stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, bgcolor: 'background.paper' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={100} height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width={80} height={20} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width={120} height={16} />
                    </Box>
                    <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard {...stat} icon={StorefrontIcon} />
          </Grid>
          ))
        )}
      </Grid>

      {!loading && (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 0 }}>
        <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
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
                      <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: 'background.default', '& fieldset': { border: 'none' } }
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
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    bgcolor: 'background.default',
                    '& fieldset': { border: 'none' },
                    '& .MuiSelect-select': { pl: 2, pr: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: statusFilter === 'All' ? 'text.secondary' : statusFilter === 'Active' ? 'success.main' : 'error.main'
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {selected === 'All' ? 'All Status' : selected}
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
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                      Active
                    </Box>
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
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
                  color: 'error.main',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  borderRadius: 2,
                  px: 1.5,
                  border: '1px solid',
                  borderColor: 'error.main',
                  '&:hover': { bgcolor: 'error.main', color: '#fff' }
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
                  <TableCell padding="checkbox" sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider', pl: 2, minWidth: 120 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width={30} height={16} />
                    </Box>
                  </TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={120} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell align="right" sx={{ bgcolor: isDark ? 'grey.900' : 'grey.100', borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={30} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Skeleton variant="circular" width={20} height={20} />
                        <Skeleton variant="text" width={60} height={16} />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" spacing={1.75} alignItems="center">
                        <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2 }} />
                        <Box>
                          <Skeleton variant="text" width={100} height={20} />
                          <Skeleton variant="text" width={80} height={16} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={120} /></TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="text" width={80} /></TableCell>
                    <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="rounded" width={60} height={26} sx={{ borderRadius: '8px' }} /></TableCell>
                    <TableCell align="right" sx={{ pr: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}><Skeleton variant="circular" width={32} height={32} /></TableCell>
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
                    bgcolor: isDark ? 'grey.900' : 'grey.100',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    pl: 2,
                    minWidth: 120
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={toggleAll} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>
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
                    '&:hover': { '& td': { bgcolor: isDark ? '#1a202c' : '#f8fafc' } },
                    '&:last-child td': { borderBottom: 0 },
                    '&.Mui-selected': { '& td': { bgcolor: 'rgba(99,102,241,0.15)' } },
                    '& td': { bgcolor: 'background.paper', transition: 'background-color 0.15s ease' }
                  }}
                >
                  <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox size="small" checked={selected.includes(item.id)} onChange={() => toggleRow(item.id)} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'primary.main', fontSize: '0.78rem' }}
                      >
                        {item.id.toString().slice(0, 8)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={1.75} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={item.logo}
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: item.primaryColor || '#9b87f5',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}
                      >
                        {!item.logo && item.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: 'text.primary', lineHeight: 1.3 }}>
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
                                borderColor: 'divider'
                              }}
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Brand color</Typography>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'primary.main', fontWeight: 500 }}>{item.domain}</Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary' }}>{item.ownerEmail}</Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 500 }}>
                      {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
                    <StatusChip active={item.isActive} />
                  </TableCell>

                  <TableCell align="right" sx={{ pr: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <RowMenu dealerName={item.name} onEdit={() => openEditDialog(item)} onDelete={() => handleDelete(item.id)} />
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, borderBottom: '1px solid', borderColor: 'divider' }}>
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
            sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', '& .MuiTablePagination-toolbar': { px: 2 } }}
          />
        )}
      </Card>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberRoundedIcon color="warning" />
            Delete {pendingDeleteIds?.length} Dealer(s)?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete <strong>{pendingDeleteIds?.length}</strong> selected dealer(s)? This action cannot be undone and will remove all associated data.
          </Typography>
        </DialogContent>
        <Box sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDeleteSelected}
            sx={{ textTransform: 'none', fontWeight: 600 }}>Delete All</Button>
        </Box>
      </Dialog>

      {/* Add/Edit Dealer Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            bgcolor: isDark ? '#1e293b' : '#fff',
            boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(0,0,0,0.15)'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary' }}>Edit Dealer</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>Update dealer information</Typography>
          </Box>
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{
              color: 'text.secondary',
              bgcolor: isDark ? '#374151' : '#f1f5f9',
              '&:hover': { bgcolor: isDark ? '#4B5563' : '#e2e8f0' }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: isDark ? '#374151' : '#e2e8f0' }} />
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {/* Logo Upload */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  border: `2px dashed ${isDark ? '#4B5563' : '#cbd5e1'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: isDark ? '#0f172a' : '#f8fafc',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#5E35B1', bgcolor: isDark ? 'rgba(94,53,177,0.08)' : 'rgba(94,53,177,0.03)' }
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
                  sx={inputStyle}
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
                  sx={inputStyle}
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
                    sx={inputStyle}
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
                  sx={inputStyle}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth sx={inputStyle}>
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
            borderTop: '1px solid',
            borderColor: isDark ? '#374151' : '#e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5
          }}
        >
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              color: 'text.secondary',
              '&:hover': { bgcolor: isDark ? '#374151' : '#f1f5f9' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
              boxShadow: '0 4px 14px rgba(94,53,177,0.3)',
              '&:hover': { boxShadow: '0 6px 20px rgba(94,53,177,0.4)' }
            }}
          >
            Update Dealer
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
