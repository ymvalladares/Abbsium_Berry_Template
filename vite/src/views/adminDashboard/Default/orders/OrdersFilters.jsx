import React from 'react';
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
  Stack,
  alpha
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TuneIcon from '@mui/icons-material/Tune';

import { useFilters } from '../../../../contexts/FiltersContext';

const radius = 2.5; // Tu firma visual

const toggleGroupStyle = {
  '& .MuiToggleButton-root': {
    borderRadius: radius,
    textTransform: 'none',
    border: '1px solid #e2e8f0',
    py: 1,
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 500,
    ml: 2,
    '&.Mui-selected': {
      bgcolor: alpha('#6366f1', 0.08),
      borderColor: '#6366f1',
      color: '#6366f1',
      fontWeight: 700,
      '&:hover': { bgcolor: alpha('#6366f1', 0.12) }
    }
  }
};

const OrdersFilters = ({ onAddOrder }) => {
  const { filters, updateFilter, clearFilters } = useFilters();

  // Contador real de filtros aplicados
  const activeCount = [filters.status, filters.priority, filters.search].filter(Boolean).length;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: radius,
        mb: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* ===== HEADER SECTION ===== */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>
                Orders
              </Typography>
              {activeCount > 0 && (
                <Chip
                  label={activeCount}
                  size="small"
                  sx={{
                    bgcolor: '#6366f1',
                    color: '#fff',
                    fontWeight: 900,
                    height: 18,
                    fontSize: '10px',
                    borderRadius: '4px'
                  }}
                />
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
              Filter and export your logistics data
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              startIcon={<FileDownloadIcon sx={{ fontSize: 18 }} />}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: radius,
                textTransform: 'none',
                borderColor: '#e2e8f0',
                color: '#64748b',
                fontWeight: 700,
                px: 2,
                display: { xs: 'none', sm: 'flex' }
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
              sx={{
                bgcolor: '#0f172a',
                '&:hover': { bgcolor: '#000' },
                borderRadius: radius,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.5
              }}
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
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: radius,
              bgcolor: '#fafafa',
              transition: '0.2s',
              '& fieldset': { borderColor: '#e2e8f0' },
              '&:hover': { bgcolor: '#fff' },
              '&.Mui-focused': { bgcolor: '#fff', '& fieldset': { borderColor: '#6366f1' } }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
              </InputAdornment>
            )
          }}
        />

        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

        {/* ===== FILTER GRID ===== */}
        <Grid container spacing={3}>
          {/* STATUS FILTER */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', mb: 1, display: 'block', letterSpacing: '0.05em' }}>
              ORDER STATUS
            </Typography>
            <ToggleButtonGroup
              value={filters.status || ''}
              exclusive
              onChange={(e, val) => updateFilter('status', val)}
              fullWidth
              size="small"
              sx={toggleGroupStyle}
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
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#475569', mb: 1, display: 'block', letterSpacing: '0.05em' }}>
              PRIORITY LEVEL
            </Typography>
            <ToggleButtonGroup
              value={filters.priority || ''}
              exclusive
              onChange={(e, val) => updateFilter('priority', val)}
              fullWidth
              size="small"
              sx={toggleGroupStyle}
            >
              <ToggleButton value="">Default</ToggleButton>
              <ToggleButton
                value="high"
                sx={{ '&.Mui-selected': { color: '#ef4444', borderColor: '#ef4444', bgcolor: alpha('#ef4444', 0.05) } }}
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
                color: '#94a3b8',
                fontWeight: 700,
                fontSize: '12px',
                '&:hover': { color: '#6366f1', bgcolor: 'transparent' }
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
