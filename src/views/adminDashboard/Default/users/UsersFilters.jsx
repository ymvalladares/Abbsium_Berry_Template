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

import { glassCard, glassInput, gradientButton, gradientText } from './aiUi';

const toggleGroupSx = (isDark) => ({
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
      boxShadow: 'inset 0 0 0 1.5px rgba(59,130,246,0.85), 0 6px 18px -6px rgba(59,130,246,0.55)',
      '&:hover': {
        bgcolor: isDark ? 'rgba(59,130,246,0.24)' : 'rgba(59,130,246,0.14)'
      }
    }
  },
  '&:not(:first-of-type)': { ml: 1 }
});

const UsersFilters = ({ onAddUser }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { filters, updateFilter } = useFilters();

  // Contador de filtros activos
  const activeFiltersCount = [filters.role, filters.sortBy, filters.dateRange].filter(Boolean).length;

  return (
    <Card elevation={0} sx={{ ...glassCard(isDark), mb: 3 }}>
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {/* ===== HEADER ===== */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={gradientText}>
                Filters
              </Box>
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  sx={{
                    backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #14b8a6 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    height: 20,
                    minWidth: 20,
                    boxShadow: '0 4px 12px -4px rgba(59,130,246,0.6)',
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
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                display: { xs: 'none', sm: 'flex' },
                color: isDark ? '#93c5fd' : '#1d4ed8',
                borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)',
                bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
                '&:hover': {
                  borderColor: '#3b82f6',
                  bgcolor: isDark ? 'rgba(59,130,246,0.16)' : 'rgba(59,130,246,0.1)',
                  boxShadow: '0 6px 16px -6px rgba(59,130,246,0.5)'
                }
              }}
            >
              Export
            </Button>

            <Button variant="contained" startIcon={<PersonAddIcon />} onClick={onAddUser} size="small" sx={gradientButton()}>
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
          sx={{ mb: 3, ...glassInput(isDark) }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#3b82f6' }} />
              </InputAdornment>
            )
          }}
        />

        <Divider sx={{ mb: 3, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)' }} />

        {/* ===== FILTER OPTIONS ===== */}
        <Grid container spacing={3}>
          {/* ROLE FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: '0.08em' }}>
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
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: '0.08em' }}>
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
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ mb: 1, display: 'block', letterSpacing: '0.08em' }}>
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
                fontWeight: 700,
                color: 'text.secondary',
                borderRadius: '10px',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)',
                  color: '#3b82f6'
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
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              color: isDark ? '#93c5fd' : '#1d4ed8',
              borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)'
            }}
          >
            Export Users
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default UsersFilters;
