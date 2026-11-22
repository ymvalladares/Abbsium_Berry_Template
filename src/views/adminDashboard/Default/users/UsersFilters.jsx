import {
  Card,
  Grid,
  Box,
  Button,
  TextField,
  Chip,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useFilters } from '../../../../contexts/FiltersContext';

const toggleGroupSx = (isDark) => ({
  '& .MuiToggleButton-root': {
    borderRadius: '12px',
    textTransform: 'none',
    border: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
    bgcolor: isDark ? '#0f172a' : '#fff',
    py: 1,
    m: 0,
    color: 'text.secondary',
    fontSize: '0.8rem',
    fontWeight: 600,
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
      borderColor: isDark ? '#475569' : '#cbd5e1'
    },
    '&.Mui-selected': {
      bgcolor: isDark ? 'rgba(3, 153, 223, 0.16)' : '#E3F2FD',
      color: isDark ? '#60a5fa' : '#0288cc',
      fontWeight: 700,
      borderColor: 'transparent',
      '&:hover': {
        bgcolor: isDark ? 'rgba(3, 153, 223, 0.24)' : '#E3F2FD'
      }
    }
  },
  '&:not(:first-of-type)': { ml: 1 }
});

const fieldStyle = (isDark) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: isDark ? '#0f172a' : '#fff',
    transition: 'all 0.2s ease',
    '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': {
      borderColor: '#0399DF',
      borderWidth: '2px',
      boxShadow: '0 0 0 3px #E3F2FD'
    },
    '& input': { py: 1.5, fontSize: '0.95rem', fontWeight: 500, color: isDark ? '#f1f5f9' : '#1e293b' }
  }
});

const sectionCardSx = (isDark) => ({
  mb: 3,
  border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
  borderRadius: 3,
  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
  background: isDark ? '#111827' : '#fff',
  overflow: 'hidden'
});

const outlinedBtnSx = (isDark) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.85rem',
  color: isDark ? '#94a3b8' : '#64748b',
  borderColor: isDark ? '#374151' : '#e2e8f0',
  borderWidth: '1.5px',
  bgcolor: isDark ? '#111827' : '#fff',
  '&:hover': {
    borderColor: isDark ? '#4B5563' : '#cbd5e1',
    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  transition: 'all 0.2s'
});

const containedBtnSx = {
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.85rem',
  bgcolor: '#0399DF',
  boxShadow: '0 4px 12px rgba(3,153,223,0.3)',
  '&:hover': {
    bgcolor: '#0288cc',
    boxShadow: '0 6px 20px rgba(3,153,223,0.4)',
    transform: 'translateY(-2px)'
  },
  transition: 'all 0.2s'
};

const UsersFilters = ({ onAddUser }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { filters, updateFilter } = useFilters();

  // Contador de filtros activos
  const activeFiltersCount = [filters.role, filters.sortBy, filters.dateRange].filter(Boolean).length;

  return (
    <Card elevation={0} sx={sectionCardSx(isDark)}>
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {/* ===== HEADER ===== */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 1 }}>
              Filters
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  sx={{
                    bgcolor: isDark ? 'rgba(3, 153, 223, 0.16)' : '#E3F2FD',
                    color: isDark ? '#60a5fa' : '#0288cc',
                    fontWeight: 700,
                    height: 20,
                    minWidth: 20,
                    '& .MuiChip-label': { px: 0.75 }
                  }}
                />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              Refine your user search
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              startIcon={<FileDownloadIcon />}
              variant="outlined"
              size="small"
              sx={{ ...outlinedBtnSx(isDark), display: { xs: 'none', sm: 'flex' } }}
            >
              Export
            </Button>

            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={onAddUser} size="small" sx={containedBtnSx}>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                Add User
              </Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                Add
              </Box>
            </Button>
          </Box>
        </Box>

        {/* ===== SEARCH BAR ===== */}
        <TextField
          fullWidth
          placeholder="Search by name, username or email..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          sx={{ mb: 3, ...fieldStyle(isDark) }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
        />

        <Divider sx={{ mb: 3, borderColor: isDark ? '#374151' : '#f1f5f9' }} />

        {/* ===== FILTER OPTIONS ===== */}
        <Grid container spacing={3}>
          {/* ROLE FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
              ROLE
            </Typography>
            <ToggleButtonGroup
              value={filters.role || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('role', newValue)}
              fullWidth
              size="small"
              sx={toggleGroupSx(isDark)}
            >
              <ToggleButton value="">
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                All
              </ToggleButton>
              <ToggleButton value="Admin">
                <AdminPanelSettingsIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Admin
              </ToggleButton>
              <ToggleButton value="User">
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                User
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* SORT BY FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
              SORT BY
            </Typography>
            <ToggleButtonGroup
              value={filters.sortBy || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('sortBy', newValue)}
              fullWidth
              size="small"
              sx={toggleGroupSx(isDark)}
            >
              <ToggleButton value="">
                <SortIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Default
              </ToggleButton>
              <ToggleButton value="nameAsc">
                <ArrowUpwardIcon sx={{ fontSize: 18, mr: 0.5 }} />
                A-Z
              </ToggleButton>
              <ToggleButton value="nameDesc">
                <ArrowDownwardIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Z-A
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* DATE RANGE FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.04em' }}>
              JOINED DATE
            </Typography>
            <ToggleButtonGroup
              value={filters.dateRange || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('dateRange', newValue)}
              fullWidth
              size="small"
              sx={toggleGroupSx(isDark)}
            >
              <ToggleButton value="">
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                All
              </ToggleButton>
              <ToggleButton value="7days">7 days</ToggleButton>
              <ToggleButton value="30days">30 days</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {/* ===== CLEAR FILTERS ===== */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => {
                updateFilter('role', '');
                updateFilter('sortBy', '');
                updateFilter('dateRange', '');
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
                borderRadius: '10px',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(3, 153, 223, 0.1)' : 'rgba(3, 153, 223, 0.06)',
                  color: '#0399DF'
                }
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}

        {/* ===== EXPORT MOBILE ===== */}
        <Box sx={{ mt: 2, display: { xs: 'block', sm: 'none' } }}>
          <Button
            startIcon={<FileDownloadIcon />}
            variant="outlined"
            fullWidth
            sx={outlinedBtnSx(isDark)}
          >
            Export Users
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default UsersFilters;
