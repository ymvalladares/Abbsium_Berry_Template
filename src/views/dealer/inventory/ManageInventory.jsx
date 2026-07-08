import { useState, useRef, useEffect } from "react";
import axios from 'axios';
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
  MenuItem,
  Select,
  FormControl,
  Stack,
  Menu,
  Card,
  CardContent,
  Grid,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  InputLabel,
  Divider,
  CircularProgress,
  Badge,
  Skeleton,
} from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { useNotification } from "contexts/NotificationContext";
import { carAPI } from "services/AxiosService";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import SpeedIcon from "@mui/icons-material/Speed";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

const StatusChip = ({ status }) => {
  const isPublished = status === "Published";
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.72rem",
        borderRadius: "8px",
        bgcolor: isPublished ? "rgba(20,184,166,0.12)" : "rgba(107,114,128,0.1)",
        color: isPublished ? "#0D9488" : "#6B7280",
        border: "none",
        px: 0.25,
        height: 26,
      }}
    />
  );
};

const TitleTypeChip = ({ titleType }) => {
  const isClean = titleType === "Clean";
  return (
    <Chip
      label={isClean ? "Clean Title" : "Rebuild Title"}
      size="small"
      sx={{
        fontWeight: 600,
        fontSize: "0.72rem",
        borderRadius: "8px",
        bgcolor: isClean ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
        color: isClean ? "#16A34A" : "#D97706",
        border: "none",
        px: 0.25,
        height: 26,
      }}
    />
  );
};

const RowMenu = ({ carId, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    setAnchor(null);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete(carId);
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ color: "text.secondary" }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 2, sx: { borderRadius: 2, minWidth: 148, border: "1px solid", borderColor: "divider" } }}
      >
        <MenuItem sx={{ fontSize: "0.85rem", gap: 1.25 }} onClick={() => setAnchor(null)}>
          <RemoveRedEyeOutlinedIcon sx={{ fontSize: 17, color: "text.secondary" }} /> View
        </MenuItem>
        <MenuItem sx={{ fontSize: "0.85rem", gap: 1.25 }} onClick={() => { setAnchor(null); onEdit(); }}>
          <EditOutlinedIcon sx={{ fontSize: 17, color: "text.secondary" }} /> Edit
        </MenuItem>
        <MenuItem sx={{ fontSize: "0.85rem", gap: 1.25, color: "error.main" }} onClick={handleDeleteClick}>
          <DeleteOutlineIcon sx={{ fontSize: 17 }} /> Delete
        </MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Delete Vehicle</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to delete this vehicle? All associated photos will be permanently removed.
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

const StatsCard = ({ title, value, subtitle, trend, trendValue, iconBgColor, icon: Icon }) => {
  const theme = useTheme();
  const isPositive = trend === 'up';

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
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 15, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 15, color: 'error.main' }} />
                )}
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: isPositive ? 'success.main' : 'error.main'
                  }}
                >
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

const TH = ({ children, align = "left" }) => {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  return (
    <TableCell align={align} sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "text.secondary", py: 1.5, bgcolor: isDark ? "grey.900" : "grey.100", borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" }}>
      {children}
    </TableCell>
  );
};

export default function ManageInventory() {
  const theme = useTheme();
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  const notify = useNotification();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAll();
        const mapped = response.data.map((car) => {
        const coverPhoto = car.photos?.find(p => p.isCover) || car.photos?.[0];
        return {
          id: `VH-${car.id}`,
          carId: car.id,
          name: car.title || `${car.year} ${car.make} ${car.model}${car.trim ? ` ${car.trim}` : ''}`,
          brand: car.make,
          year: car.year,
          listedAt: new Date(car.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          listedTime: new Date(car.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          stock: car.status === 'available' ? 1 : 0,
          stockLabel: car.status === 'available' ? 'available' : car.status === 'sold' ? 'sold' : 'reserved',
          price: car.price,
          status: car.status === 'available' ? 'Published' : 'Draft',
          titleType: car.titleType || 'Clean',
          mileage: car.mileage,
          transmission: car.transmission,
          fuelType: car.fuelType,
          featured: car.featured,
          image: coverPhoto?.s3Url || null,
          photoCount: car.photos?.length || 0,
          raw: car
        };
      });
      setCars(mapped);
    } catch (error) {
      notify.error('Failed to load inventory', 'Error');
    } finally {
      setLoading(false);
    }
  };

  // Vehicle form state
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    brand: '',
    model: '',
    year: '',
    price: '',
    titleType: 'Clean',
    status: 'Draft',
    description: '',
    vin: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
  });

  const handlePhotoUpload = (files) => {
    const newPhotos = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files);
    }
  };

  const removePhoto = (id) => {
    setUploadedPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleFormChange = (field) => (e) => {
    setVehicleForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmitVehicle = async () => {
    if (!vehicleForm.brand || !vehicleForm.model || !vehicleForm.year) {
      notify.error('Please fill in brand, model, and year', 'Missing Information');
      return;
    }

    setSubmitting(true);
    try {
      const dealerId = localStorage.getItem('dealerId');
      if (!dealerId) {
        notify.error('No dealer found', 'Error');
        return;
      }

      const title = `${vehicleForm.year} ${vehicleForm.brand} ${vehicleForm.model}`.trim();

      const carData = {
        dealerId: dealerId,
        title: title,
        price: parseFloat(vehicleForm.price) || 0,
        year: parseInt(vehicleForm.year) || new Date().getFullYear(),
        make: vehicleForm.brand,
        model: vehicleForm.model,
        trim: null,
        mileage: vehicleForm.mileage ? parseInt(vehicleForm.mileage) : null,
        transmission: vehicleForm.transmission || null,
        fuelType: vehicleForm.fuelType || null,
        exteriorColor: vehicleForm.color || null,
        interiorColor: null,
        vin: vehicleForm.vin || null,
        description: vehicleForm.description || null,
        titleType: vehicleForm.titleType || 'Clean',
        status: vehicleForm.status === 'Published' ? 'available' : 'reserved',
        featured: false
      };

      const carResponse = await carAPI.upsert(carData);
      const carId = carResponse?.data?.data?.carId;

      if (!carId) {
        console.error('Car created but no carId returned', carResponse?.data);
        notify.success(`${title} has been added to your inventory`, 'Vehicle Added');
        setOpenAddDialog(false);
        setUploadedPhotos([]);
        setVehicleForm({
          name: '', brand: '', model: '', year: '', price: '', titleType: 'Clean',
          status: 'Draft', description: '', vin: '', mileage: '',
          fuelType: '', transmission: '', color: '',
        });
        fetchCars();
        return;
      }

      if (uploadedPhotos.length > 0) {
        let uploadedCount = 0;
        let failedCount = 0;

        for (let i = 0; i < uploadedPhotos.length; i++) {
          const photo = uploadedPhotos[i];
          try {
            const presignedResponse = await carAPI.getPhotoPresignedUrl(carId, photo.name, photo.file.type);

            if (!presignedResponse?.data?.url) {
              console.error('No presigned URL returned', presignedResponse?.data);
              throw new Error('Server did not return a valid upload URL. Check S3 configuration.');
            }

            const { url: uploadUrl, key: s3Key, publicUrl: s3Url } = presignedResponse.data;

            await axios.put(uploadUrl, photo.file, {
              headers: { 'Content-Type': photo.file.type }
            });

            await carAPI.registerPhoto(carId, {
              s3Key,
              fileName: photo.name,
              contentType: photo.file.type,
              fileSize: photo.file.size,
              isCover: i === 0,
              order: i
            });

            uploadedCount++;
          } catch (photoError) {
            console.error(`Failed to upload photo ${photo.name}:`, photoError.response?.data || photoError.message);
            failedCount++;
          }
        }

        if (failedCount > 0) {
          notify.warning(`${uploadedCount} photo(s) uploaded, ${failedCount} failed. Car was still saved.`, 'Partial Upload');
        }
      }

      notify.success(`${title} has been added to your inventory`, 'Vehicle Added');
      setOpenAddDialog(false);
      setUploadedPhotos([]);
      setVehicleForm({
        name: '', brand: '', model: '', year: '', price: '', titleType: 'Clean',
        status: 'Draft', description: '', vin: '', mileage: '',
        fuelType: '', transmission: '', color: '',
      });
      fetchCars();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      notify.error(error.response?.data?.message || error.message || 'Failed to add vehicle', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    uploadedPhotos.forEach((p) => URL.revokeObjectURL(p.preview));
    setUploadedPhotos([]);
  };

  const handleDeleteCar = async (carId) => {
    try {
      await carAPI.delete(carId);
      notify.success('Vehicle deleted successfully', 'Deleted');
      fetchCars();
    } catch (error) {
      notify.error(error.response?.data?.message || 'Failed to delete vehicle', 'Error');
    }
  };

  const handleOpenEditDialog = (item) => {
    setEditingCar(item);
    setVehicleForm({
      name: item.raw.title || `${item.raw.year} ${item.raw.make} ${item.raw.model}`,
      brand: item.raw.make,
      model: item.raw.model,
      year: item.raw.year,
      price: item.raw.price,
      titleType: item.raw.titleType || 'Clean',
      status: item.raw.status === 'available' ? 'Published' : 'Draft',
      description: item.raw.description || '',
      vin: item.raw.vin || '',
      mileage: item.raw.mileage || '',
      fuelType: item.raw.fuelType || '',
      transmission: item.raw.transmission || '',
      color: item.raw.exteriorColor || '',
    });
    setEditDialogOpen(true);
  };

  const handleEditVehicle = async () => {
    if (!vehicleForm.brand || !vehicleForm.model || !vehicleForm.year) {
      notify.error('Please fill in brand, model, and year', 'Missing Information');
      return;
    }

    setSubmitting(true);
    try {
      const dealerId = localStorage.getItem('dealerId');
      if (!dealerId) {
        notify.error('No dealer found', 'Error');
        return;
      }

      const title = `${vehicleForm.year} ${vehicleForm.brand} ${vehicleForm.model}`.trim();

      const carData = {
        id: editingCar.carId,
        dealerId: dealerId,
        title: title,
        price: parseFloat(vehicleForm.price) || 0,
        year: parseInt(vehicleForm.year) || new Date().getFullYear(),
        make: vehicleForm.brand,
        model: vehicleForm.model,
        trim: null,
        mileage: vehicleForm.mileage ? parseInt(vehicleForm.mileage) : null,
        transmission: vehicleForm.transmission || null,
        fuelType: vehicleForm.fuelType || null,
        exteriorColor: vehicleForm.color || null,
        interiorColor: null,
        vin: vehicleForm.vin || null,
        description: vehicleForm.description || null,
        titleType: vehicleForm.titleType || 'Clean',
        status: vehicleForm.status === 'Published' ? 'available' : 'reserved',
        featured: editingCar.raw.featured
      };

      await carAPI.upsert(carData);
      notify.success(`${title} has been updated`, 'Vehicle Updated');
      setEditDialogOpen(false);
      setEditingCar(null);
      setVehicleForm({
        name: '', brand: '', model: '', year: '', price: '', titleType: 'Clean',
        status: 'Draft', description: '', vin: '', mileage: '',
        fuelType: '', transmission: '', color: '',
      });
      fetchCars();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      notify.error(error.response?.data?.message || error.message || 'Failed to update vehicle', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingCar(null);
    setVehicleForm({
      name: '', brand: '', year: '', price: '', titleType: 'Clean',
      status: 'Draft', description: '', vin: '', mileage: '',
      fuelType: '', transmission: '', color: '',
    });
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
        boxShadow: isDark ? 'none' : '0 0 0 3px rgba(94,53,177,0.1)',
      },
      '& input, & textarea': {
        py: 1.5,
        fontSize: '0.9rem',
        color: isDark ? '#f1f5f9' : '#0f172a',
      },
    },
    '& .MuiInputLabel-root': {
      color: isDark ? '#94a3b8' : '#64748b',
      '&.Mui-focused': { color: '#5E35B1' },
    },
  };

  const filtered = cars.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    const matchStock = stockFilter === "All" || item.stockLabel === stockFilter.toLowerCase();
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    return matchSearch && matchStock && matchStatus;
  });

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paginated.length > 0 && paginated.every((r) => selected.includes(r.id));
  const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !paginated.map((r) => r.id).includes(id)) : [...new Set([...selected, ...paginated.map((r) => r.id)])]);
  const toggleRow = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const totalValue = cars.reduce((sum, c) => sum + c.price, 0);
  const availableCount = cars.filter(c => c.status === 'Published').length;
  const cleanTitleCount = cars.filter(c => c.titleType === 'Clean').length;
  const avgPrice = cars.length > 0 ? totalValue / cars.length : 0;

  const statsCards = [
    {
      id: 1,
      value: cars.length.toString(),
      title: 'Total Vehicles',
      subtitle: 'In inventory',
      trend: 'up',
      trendValue: `${availableCount} available`,
      iconBgColor: theme.vars.palette.primary.main,
      icon: DirectionsCarIcon
    },
    {
      id: 2,
      value: `$${Math.round(totalValue).toLocaleString()}`,
      title: 'Inventory Value',
      subtitle: 'Total stock value',
      trend: 'up',
      trendValue: `Avg $${cars.length > 0 ? Math.round(totalValue / cars.length).toLocaleString() : 0}/vehicle`,
      iconBgColor: theme.vars.palette.success.main,
      icon: AttachMoneyIcon
    },
    {
      id: 3,
      value: cleanTitleCount.toString(),
      title: 'Clean Title',
      subtitle: 'Verified vehicles',
      trend: 'up',
      trendValue: `${cars.length > 0 ? Math.round((cleanTitleCount / cars.length) * 100) : 0}% of inventory`,
      iconBgColor: theme.vars.palette.warning.main,
      icon: CheckCircleIcon
    },
    {
      id: 4,
      value: cars.filter(c => c.photoCount > 0).length.toString(),
      title: 'With Photos',
      subtitle: 'Ready to showcase',
      trend: 'up',
      trendValue: `${cars.length - cars.filter(c => c.photoCount > 0).length} without photos`,
      iconBgColor: theme.vars.palette.secondary.main,
      icon: VisibilityIcon
    }
  ];

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: { xs: '1.15rem', sm: '1.5rem' }, color: "text.primary" }}>
            Manage Inventory
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mt: 0.25 }}>
            {loading ? <Skeleton width={120} height={20} sx={{ mt: 0.5 }} /> : `${cars.length} vehicles total`}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddDialog(true)}
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, boxShadow: "none", "&:hover": { boxShadow: "none" }, fontSize: { xs: '0.75rem', sm: '0.85rem' }, px: { xs: 1.5, sm: 2 } }}>
          Add Vehicle
        </Button>
      </Stack>

      {loading ? (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', bgcolor: 'background.paper' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box sx={{ width: '100%' }}>
                        <Skeleton width={80} height={32} sx={{ mb: 1 }} />
                        <Skeleton width={100} height={16} sx={{ mb: 0.5 }} />
                        <Skeleton width={120} height={14} />
                      </Box>
                      <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: 2 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 0 }}>
            <Box sx={{ p: { xs: 1.5, sm: 2.5 } }}>
              <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
              {[1, 2, 3, 4, 5].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Skeleton variant="rounded" width={84} height={64} sx={{ borderRadius: 2, flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="60%" height={20} sx={{ mb: 0.5 }} />
                    <Skeleton width="40%" height={16} />
                  </Box>
                  <Skeleton width={80} height={26} sx={{ borderRadius: 1 }} />
                  <Skeleton width={60} height={20} />
                  <Skeleton width={80} height={26} sx={{ borderRadius: 1 }} />
                </Box>
              ))}
            </Box>
          </Card>
        </>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {statsCards.map((card) => (
              <Grid key={card.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <StatsCard {...card} />
              </Grid>
            ))}
          </Grid>

          <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mb: 0 }}>
            <Box sx={{ p: { xs: 1.5, sm: 2.5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
              {/* Mobile: stacked layout */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 1.5 }}>
            <TextField
              size="small"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: 'background.default', '& fieldset': { border: 'none' } }
              }}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<FilterListIcon fontSize="small" />}
                sx={{ flex: 1, textTransform: 'none', color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', borderRadius: 2, px: 1.5, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' } }}
              >
                More Filters
              </Button>
              <Button
                size="small"
                startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
                sx={{ flex: 1, textTransform: 'none', color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', borderRadius: 2, px: 1.5, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' } }}
              >
                Export
              </Button>
            </Box>
          </Box>

          {/* Desktop: single row layout */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: { sm: 1.5, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { sm: 1, md: 1.5 }, flex: 1, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, bgcolor: 'background.default', '& fieldset': { border: 'none' } }
                }}
                sx={{ minWidth: { sm: 300, md: 380 } }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
              <Button
                size="small"
                startIcon={<FilterListIcon fontSize="small" />}
                sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', borderRadius: 2, px: 1.5, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' } }}
              >
                More Filters
              </Button>
              <Button
                size="small"
                startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
                sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500, fontSize: '0.82rem', borderRadius: 2, px: 1.5, border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' } }}
              >
                Export
              </Button>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ overflowX: 'auto', '&::-webkit-scrollbar': { height: 6 }, display: { xs: 'none', sm: 'block' } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ bgcolor: isDark ? "grey.900" : "grey.100", borderBottom: '1px solid', borderColor: 'divider', pl: 2, minWidth: 120 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" checked={allSelected} indeterminate={selected.length > 0 && !allSelected} onChange={toggleAll} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>ID</Typography>
                  </Box>
                </TableCell>
                <TH>Vehicle</TH>
                <TH>Title</TH>
                <TH>Mileage</TH>
                <TH>Transmission</TH>
                <TH>Fuel</TH>
                <TH>Price</TH>
                <TH>Status</TH>
                <TH align="right"> </TH>
              </TableRow>
            </TableHead>
          <TableBody>
            {paginated.map((item) => (
              <TableRow key={item.id}
                selected={selected.includes(item.id)}
                sx={{
                  "&:hover": {
                    "& td": { bgcolor: isDark ? "#1a202c" : "#f8fafc" }
                  },
                  "&:last-child td": { borderBottom: 0 },
                  "&.Mui-selected": {
                    "& td": { bgcolor: "rgba(99,102,241,0.15)" }
                  },
                  "& td": { bgcolor: "background.paper", transition: "background-color 0.15s ease" }
                }}>
                <TableCell padding="checkbox" sx={{ pl: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" checked={selected.includes(item.id)} onChange={() => toggleRow(item.id)} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {item.featured && <StarIcon sx={{ fontSize: 14, color: '#FBBF24' }} />}
                      <Typography variant="caption" sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'primary.main', fontSize: '0.78rem' }}>{item.id}</Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Stack direction="row" spacing={1.75} alignItems="center">
                    <Badge
                      badgeContent={item.photoCount > 0 ? item.photoCount : null}
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.65rem',
                          height: 18,
                          minWidth: 18,
                          borderRadius: 4,
                          fontWeight: 600,
                        }
                      }}
                    >
                      <Avatar variant="rounded" src={item.photoCount > 0 ? item.image : undefined}
                        sx={{ width: 84, height: 64, borderRadius: 2, bgcolor: isDark ? "grey.700" : "grey.200" }}>
                        {item.photoCount === 0 && <ImageOutlinedIcon sx={{ fontSize: 32, color: 'text.disabled' }} />}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "text.primary", lineHeight: 1.3 }}>
                        {item.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mt: 0.3 }}>
                        {item.brand}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <TitleTypeChip titleType={item.titleType} />
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <SpeedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: "0.82rem", color: "text.primary", fontWeight: 500 }}>
                      {item.mileage ? `${Number(item.mileage).toLocaleString()} mi` : '—'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <SettingsSuggestIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: "0.82rem", color: "text.primary", fontWeight: 500 }}>
                      {item.transmission || '—'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocalGasStationIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: "0.82rem", color: "text.primary", fontWeight: 500 }}>
                      {item.fuelType || '—'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 700, color: "text.primary" }}>
                    ${item.price.toLocaleString()}
                  </Typography>
                </TableCell>

                <TableCell sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
                  <StatusChip status={item.status} />
                </TableCell>

                <TableCell align="right" sx={{ pr: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <RowMenu carId={item.carId} onEdit={() => handleOpenEditDialog(item)} onDelete={handleDeleteCar} />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: 'center', py: 6, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <DirectionsCarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    {search ? 'No vehicles match your search' : 'No vehicles in inventory yet'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>

        {/* Mobile Card View */}
        <Box sx={{ display: { xs: 'block', sm: 'none' }, px: 1.5, pb: 1 }}>
          {paginated.map((item) => (
            <Card key={item.id} sx={{ mb: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
                <Badge
                  badgeContent={item.photoCount > 0 ? item.photoCount : null}
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, borderRadius: 4 } }}
                >
                  <Avatar variant="rounded" src={item.photoCount > 0 ? item.image : undefined}
                    sx={{ width: 72, height: 56, borderRadius: 2, bgcolor: isDark ? "grey.700" : "grey.200", flexShrink: 0 }}>
                    {item.photoCount === 0 && <ImageOutlinedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />}
                  </Avatar>
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
                    {item.featured && <StarIcon sx={{ fontSize: 13, color: '#FBBF24' }} />}
                    <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.primary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', mb: 1 }}>{item.brand}</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    <TitleTypeChip titleType={item.titleType} />
                    <StatusChip status={item.status} />
                  </Box>
                </Box>
              </Box>
              <Divider sx={{ borderColor: isDark ? '#374151' : '#f1f5f9' }} />
              <Box sx={{ px: 2, py: 1.5, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SpeedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Mileage</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
                    {item.mileage ? `${Number(item.mileage).toLocaleString()}` : '—'}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <SettingsSuggestIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Trans.</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
                    {item.transmission || '—'}
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocalGasStationIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>Fuel</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'text.primary' }}>
                    {item.fuelType || '—'}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: isDark ? '#374151' : '#f1f5f9' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 800, color: 'text.primary' }}>
                  ${item.price.toLocaleString()}
                </Typography>
                <RowMenu carId={item.carId} onEdit={() => handleOpenEditDialog(item)} onDelete={handleDeleteCar} />
              </Box>
            </Card>
          ))}
        </Box>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper", "& .MuiTablePagination-toolbar": { px: 2 }, display: { xs: 'none', sm: 'block' } }}
        />

        {/* Mobile Pagination */}
        {filtered.length > rowsPerPage && (
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: 'center', alignItems: 'center', gap: 2, py: 2 }}>
            <Button
              size="small"
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, border: '1px solid', borderColor: 'divider', '&:disabled': { opacity: 0.4 } }}
            >
              Previous
            </Button>
            <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', fontWeight: 500 }}>
              Page {page + 1} of {Math.ceil(filtered.length / rowsPerPage)}
            </Typography>
            <Button
              size="small"
              disabled={(page + 1) * rowsPerPage >= filtered.length}
              onClick={() => setPage(p => p + 1)}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, border: '1px solid', borderColor: 'divider', '&:disabled': { opacity: 0.4 } }}
            >
              Next
            </Button>
          </Box>
        )}

        {/* Mobile Empty State */}
        {paginated.length === 0 && (
          <Box sx={{ display: { xs: 'block', sm: 'none' }, textAlign: 'center', py: 6 }}>
            <DirectionsCarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              {search || stockFilter !== 'All' || statusFilter !== 'All' ? 'No vehicles match your filters' : 'No vehicles in inventory yet'}
            </Typography>
          </Box>
        )}
      </Card>
        </>
      )}

      {/* Add Vehicle Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            bgcolor: isDark ? '#1e293b' : '#fff',
            boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary' }}>Add New Vehicle</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>Fill in the details and upload photos</Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: 'text.secondary', bgcolor: isDark ? '#374151' : '#f1f5f9', '&:hover': { bgcolor: isDark ? '#4B5563' : '#e2e8f0' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: isDark ? '#374151' : '#e2e8f0' }} />
        <DialogContent sx={{ p: 0, maxHeight: '85vh', overflow: 'auto' }}>
          <Box sx={{ p: 3 }}>
            {/* Photo Upload Section */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1.5 }}>
                Vehicle Photos <Typography component="span" sx={{ color: 'text.secondary', fontWeight: 400 }}>(optional, max 10)</Typography>
              </Typography>

              {/* Upload Area */}
              <Box
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: `2px dashed ${dragActive ? '#5E35B1' : isDark ? '#4B5563' : '#cbd5e1'}`,
                  borderRadius: 2.5,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: dragActive ? (isDark ? 'rgba(94,53,177,0.1)' : 'rgba(94,53,177,0.05)') : (isDark ? '#0f172a' : '#f8fafc'),
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: '#5E35B1', bgcolor: isDark ? 'rgba(94,53,177,0.08)' : 'rgba(94,53,177,0.03)' },
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => e.target.files && handlePhotoUpload(e.target.files)}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: dragActive ? '#5E35B1' : (isDark ? '#64748b' : '#94a3b8'), mb: 1 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary', mb: 0.5 }}>
                  {dragActive ? 'Drop photos here' : 'Drag & drop photos here'}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1.5 }}>
                  or click to browse · JPG, PNG, WebP
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCameraIcon fontSize="small" />}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Choose Files
                </Button>
              </Box>

              {/* Photo Preview Grid */}
              {uploadedPhotos.length > 0 && (
                <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: 'repeat(5, 1fr)', sm: 'repeat(6, 1fr)', md: 'repeat(8, 1fr)' }, gap: 1 }}>
                  {uploadedPhotos.map((photo) => (
                    <Box
                      key={photo.id}
                      sx={{
                        position: 'relative',
                        borderRadius: 2,
                        overflow: 'hidden',
                        aspectRatio: '3/2',
                        bgcolor: isDark ? '#0f172a' : '#f1f5f9',
                        border: '1px solid',
                        borderColor: isDark ? '#374151' : '#e2e8f0',
                      }}
                    >
                      <Box component="img" src={photo.preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small"
                        onClick={() => removePhoto(photo.id)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          width: 22,
                          height: 22,
                          minWidth: 0,
                          '&:hover': { bgcolor: 'rgba(239,68,68,0.8)' },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      {uploadedPhotos.indexOf(photo) === 0 && (
                        <Box sx={{ position: 'absolute', bottom: 4, left: 4, bgcolor: '#5E35B1', color: '#fff', px: 1, py: 0.25, borderRadius: 1, fontSize: '0.6rem', fontWeight: 600 }}>
                          Cover
                        </Box>
                      )}
                    </Box>
                  ))}
                  {uploadedPhotos.length < 10 && (
                    <Box
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        borderRadius: 2,
                        border: `2px dashed ${isDark ? '#4B5563' : '#cbd5e1'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        aspectRatio: '3/2',
                        bgcolor: isDark ? '#0f172a' : '#f8fafc',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#5E35B1', bgcolor: isDark ? 'rgba(94,53,177,0.08)' : 'rgba(94,53,177,0.03)' },
                      }}
                    >
                      <ImageOutlinedIcon sx={{ fontSize: 24, color: isDark ? '#64748b' : '#94a3b8', mb: 0.5 }} />
                      <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', fontWeight: 500 }}>Add more</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: isDark ? '#374151' : '#e2e8f0', mb: 3 }} />

            {/* Vehicle Details Form */}
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1.5 }}>Vehicle Information</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Brand" placeholder="e.g. Toyota" value={vehicleForm.brand} onChange={handleFormChange('brand')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Model" placeholder="e.g. Camry" value={vehicleForm.model} onChange={handleFormChange('model')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="VIN Number" placeholder="Vehicle Identification Number" value={vehicleForm.vin} onChange={handleFormChange('vin')} sx={inputStyle} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Year" type="number" placeholder="2026" value={vehicleForm.year} onChange={handleFormChange('year')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Price ($)" type="number" placeholder="28500" value={vehicleForm.price} onChange={handleFormChange('price')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Title Type</InputLabel>
                  <Select value={vehicleForm.titleType} label="Title Type" onChange={handleFormChange('titleType')}>
                    <MenuItem value="Clean">Clean Title</MenuItem>
                    <MenuItem value="Rebuild">Rebuild Title</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="Mileage" placeholder="e.g. 15000" value={vehicleForm.mileage} onChange={handleFormChange('mileage')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Transmission</InputLabel>
                  <Select value={vehicleForm.transmission} label="Transmission" onChange={handleFormChange('transmission')}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                    <MenuItem value="CVT">CVT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select value={vehicleForm.fuelType} label="Fuel Type" onChange={handleFormChange('fuelType')}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Gasoline">Gasoline</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="Color" placeholder="e.g. Black" value={vehicleForm.color} onChange={handleFormChange('color')} sx={inputStyle} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Description" multiline minRows={3} placeholder="Describe the vehicle..." value={vehicleForm.description} onChange={handleFormChange('description')} sx={inputStyle} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        {/* Dialog Footer */}
        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: isDark ? '#374151' : '#e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, color: 'text.secondary', '&:hover': { bgcolor: isDark ? '#374151' : '#f1f5f9' } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitVehicle}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: submitting ? 'none' : 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
              bgcolor: submitting ? 'action.disabled' : undefined,
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(94,53,177,0.3)',
              '&:hover': { boxShadow: submitting ? 'none' : '0 6px 20px rgba(94,53,177,0.4)' },
            }}
          >
            {submitting ? 'Adding...' : 'Add Vehicle'}
          </Button>
        </Box>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 5,
            bgcolor: isDark ? '#1e293b' : '#fff',
            boxShadow: isDark ? '0 25px 50px rgba(0,0,0,0.5)' : '0 25px 50px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary' }}>Edit Vehicle</Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.25 }}>Update vehicle details</Typography>
          </Box>
          <IconButton onClick={handleCloseEditDialog} sx={{ color: 'text.secondary', bgcolor: isDark ? '#374151' : '#f1f5f9', '&:hover': { bgcolor: isDark ? '#4B5563' : '#e2e8f0' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: isDark ? '#374151' : '#e2e8f0' }} />
        <DialogContent sx={{ p: 0, maxHeight: '85vh', overflow: 'auto' }}>
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: 'text.primary', mb: 1.5 }}>Vehicle Information</Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Brand" placeholder="e.g. Toyota" value={vehicleForm.brand} onChange={handleFormChange('brand')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Model" placeholder="e.g. Camry" value={vehicleForm.model} onChange={handleFormChange('model')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="VIN Number" placeholder="Vehicle Identification Number" value={vehicleForm.vin} onChange={handleFormChange('vin')} sx={inputStyle} />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Year" type="number" placeholder="2026" value={vehicleForm.year} onChange={handleFormChange('year')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField fullWidth label="Price ($)" type="number" placeholder="28500" value={vehicleForm.price} onChange={handleFormChange('price')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Title Type</InputLabel>
                  <Select value={vehicleForm.titleType} label="Title Type" onChange={handleFormChange('titleType')}>
                    <MenuItem value="Clean">Clean Title</MenuItem>
                    <MenuItem value="Rebuild">Rebuild Title</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="Mileage" placeholder="e.g. 15000" value={vehicleForm.mileage} onChange={handleFormChange('mileage')} sx={inputStyle} />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Transmission</InputLabel>
                  <Select value={vehicleForm.transmission} label="Transmission" onChange={handleFormChange('transmission')}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Automatic">Automatic</MenuItem>
                    <MenuItem value="Manual">Manual</MenuItem>
                    <MenuItem value="CVT">CVT</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <FormControl fullWidth sx={inputStyle}>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select value={vehicleForm.fuelType} label="Fuel Type" onChange={handleFormChange('fuelType')}>
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Gasoline">Gasoline</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <TextField fullWidth label="Color" placeholder="e.g. Black" value={vehicleForm.color} onChange={handleFormChange('color')} sx={inputStyle} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Description" multiline minRows={3} placeholder="Describe the vehicle..." value={vehicleForm.description} onChange={handleFormChange('description')} sx={inputStyle} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: isDark ? '#374151' : '#e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, color: 'text.secondary', '&:hover': { bgcolor: isDark ? '#374151' : '#f1f5f9' } }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditVehicle}
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              background: submitting ? 'none' : 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
              bgcolor: submitting ? 'action.disabled' : undefined,
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(94,53,177,0.3)',
              '&:hover': { boxShadow: submitting ? 'none' : '0 6px 20px rgba(94,53,177,0.4)' },
            }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
