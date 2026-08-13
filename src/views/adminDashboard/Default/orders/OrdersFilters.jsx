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
  Divider,
  Stack
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TuneIcon from '@mui/icons-material/Tune';

import { useFilters } from '../../../../contexts/FiltersContext';

import { glassCard, glassInput, gradientButton, gradientText, glowShadow, GRADIENT_MAIN } from './aiUi';

const ACCENT_RGB = '59,130,246';

const toggleGroupSx = (isDark) => ({
  '& .MuiToggleButton-root': {
    borderRadius: '12px',
    textTransform: 'none',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(59,130,246,0.15)'}`,
    bgcolor: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.6)',
    py: 1,
    fontSize: '13px',
    color: 'text.secondary',
    fontWeight: 600,
    m: 0,
    transition: 'all 0.2s',
    '&:hover': {
      bgcolor: isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
      borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)'
    },
    '&.Mui-selected': {
      bgcolor: isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.1)',
      borderColor: 'transparent',
      color: isDark ? '#93c5fd' : '#1d4ed8',
      fontWeight: 800,
      boxShadow: `inset 0 0 0 1.5px rgba(${ACCENT_RGB},0.85), 0 6px 18px -6px rgba(${ACCENT_RGB},0.55)`,
      '&:hover': {
        bgcolor: isDark ? 'rgba(59,130,246,0.24)' : 'rgba(59,130,246,0.14)'
      }
    }
  },
  '&:not(:first-of-type)': { ml: 1 }
});

const OrdersFilters = ({ onAddOrder }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { filters, updateFilter, clearFilters } = useFilters();

  // Contador real de filtros aplicados
  const activeCount = [filters.status, filters.priority, filters.search].filter(Boolean).length;

  return (
    <Card elevation={0} sx={{ ...glassCard(isDark), mb: 3 }}>
      <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        {/* ===== HEADER SECTION ===== */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                <Box component="span" sx={gradientText}>Orders</Box>
              </Typography>
              {activeCount > 0 && (
                <Chip
                  label={activeCount}
                  size="small"
                  sx={{
                    backgroundImage: GRADIENT_MAIN,
                    color: '#fff',
                    fontWeight: 900,
                    height: 20,
                    minWidth: 20,
                    fontSize: '10px',
                    borderRadius: '6px',
                    boxShadow: glowShadow(ACCENT_RGB, 0.6, 10)
                  }}
                />
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: isDark ? '#64748b' : '#94a3b8', fontWeight: 500 }}>
              Filter and export your logistics data
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                borderColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.35)',
                color: isDark ? '#93c5fd' : '#1d4ed8',
                bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
                fontWeight: 700,
                px: 2,
                display: { xs: 'none', sm: 'flex' },
                '&:hover': {
                  borderColor: '#3b82f6',
                  bgcolor: isDark ? 'rgba(59,130,246,0.16)' : 'rgba(59,130,246,0.1)',
                  boxShadow: glowShadow(ACCENT_RGB, 0.5, 16)
                }
              }}
            >
              Export
            </Button>

            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon />}
              onClick={onAddOrder}
              size="small"
              sx={{ ...gradientButton(), px: 2.5 }}
            >
              New Order
            </Button>
          </Stack>
        </Stack>

        {/* ===== SEARCH BAR ===== */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search by ID, Customer name or tracking..."
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          sx={{ mb: 3, ...glassInput(isDark) }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Divider sx={{ mb: 3, borderStyle: 'dashed', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(59,130,246,0.12)' }} />

        {/* ===== FILTER GRID ===== */}
        <Grid container spacing={3}>
          {/* STATUS FILTER */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#94a3b8' : '#475569', mb: 1, display: 'block', letterSpacing: '0.08em' }}>
              ORDER STATUS
            </Typography>
            <ToggleButtonGroup
              value={filters.status || ''}
              exclusive
              onChange={(e, val) => updateFilter('status', val)}
              fullWidth
              size="small"
              sx={toggleGroupSx(isDark)}
            >
              <ToggleButton value="">All</ToggleButton>
              <ToggleButton value="pending">
                <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Pending
              </ToggleButton>
              <ToggleButton value="completed">
                <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> Completed
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* PRIORITY FILTER */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: isDark ? '#94a3b8' : '#475569', mb: 1, display: 'block', letterSpacing: '0.08em' }}>
              PRIORITY LEVEL
            </Typography>
            <ToggleButtonGroup
              value={filters.priority || ''}
              exclusive
              onChange={(e, val) => updateFilter('priority', val)}
              fullWidth
              size="small"
              sx={toggleGroupSx(isDark)}
            >
              <ToggleButton value="">Default</ToggleButton>
              <ToggleButton
                value="high"
                sx={{
                  '&.Mui-selected': {
                    color: '#ef4444',
                    borderColor: 'transparent',
                    bgcolor: isDark ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.08)',
                    boxShadow: 'inset 0 0 0 1.5px rgba(239,68,68,0.8), 0 6px 18px -6px rgba(239,68,68,0.5)'
                  }
                }}
              >
                High
              </ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="low">Low</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>

        {/* ===== FOOTER ACTIONS ===== */}
        {activeCount > 0 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={clearFilters}
              startIcon={<TuneIcon sx={{ fontSize: 14 }} />}
              sx={{
                textTransform: 'none',
                color: isDark ? '#64748b' : '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                borderRadius: '10px',
                '&:hover': { color: '#3b82f6', bgcolor: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)' }
              }}
            >
              Clear all active filters
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default OrdersFilters;