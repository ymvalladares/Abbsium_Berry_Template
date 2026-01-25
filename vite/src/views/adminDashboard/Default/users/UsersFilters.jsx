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
  Divider
} from '@mui/material';

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

const UsersFilters = ({ onAddUser }) => {
  const { filters, updateFilter } = useFilters();

  // Contador de filtros activos
  const activeFiltersCount = [filters.role, filters.sortBy, filters.dateRange].filter(Boolean).length;

  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* ===== HEADER ===== */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
              Filters
              {activeFiltersCount > 0 && (
                <Chip
                  label={activeFiltersCount}
                  size="small"
                  sx={{
                    bgcolor: '#9b87f5',
                    color: '#fff',
                    fontWeight: 700,
                    height: 20,
                    minWidth: 20,
                    '& .MuiChip-label': { px: 0.75 }
                  }}
                />
              )}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Refine your user search
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              startIcon={<FileDownloadIcon />}
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Export
            </Button>

            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={onAddUser}
              size="small"
              sx={{
                bgcolor: '#9b87f5',
                '&:hover': { bgcolor: '#8b77e5' },
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(155,135,245,0.35)'
              }}
            >
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
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              bgcolor: '#fafafa',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              },
              '&.Mui-focused': {
                bgcolor: '#fff',
                boxShadow: '0 0 0 3px rgba(155,135,245,0.15)'
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            )
          }}
        />

        <Divider sx={{ mb: 3 }} />

        {/* ===== FILTER OPTIONS ===== */}
        <Grid container spacing={3}>
          {/* ROLE FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              ROLE
            </Typography>
            <ToggleButtonGroup
              value={filters.role || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('role', newValue)}
              fullWidth
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(155,135,245,0.12)',
                    borderColor: '#9b87f5',
                    color: '#9b87f5',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(155,135,245,0.18)'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="" sx={{ mr: 1 }}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                All
              </ToggleButton>
              <ToggleButton value="Admin" sx={{ mr: 1 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Admin
              </ToggleButton>
              <ToggleButton value="User" sx={{ mr: 1 }}>
                <PersonIcon sx={{ fontSize: 18, mr: 0.5 }} />
                User
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* SORT BY FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              SORT BY
            </Typography>
            <ToggleButtonGroup
              value={filters.sortBy || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('sortBy', newValue)}
              fullWidth
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(155,135,245,0.12)',
                    borderColor: '#9b87f5',
                    color: '#9b87f5',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(155,135,245,0.18)'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="" sx={{ mr: 1 }}>
                <SortIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Default
              </ToggleButton>
              <ToggleButton value="nameAsc" sx={{ mr: 1 }}>
                <ArrowUpwardIcon sx={{ fontSize: 18, mr: 0.5 }} />
                A-Z
              </ToggleButton>
              <ToggleButton value="nameDesc" sx={{ mr: 1 }}>
                <ArrowDownwardIcon sx={{ fontSize: 18, mr: 0.5 }} />
                Z-A
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* DATE RANGE FILTER */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              JOINED DATE
            </Typography>
            <ToggleButtonGroup
              value={filters.dateRange || ''}
              exclusive
              onChange={(e, newValue) => updateFilter('dateRange', newValue)}
              fullWidth
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: 'divider',
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(155,135,245,0.12)',
                    borderColor: '#9b87f5',
                    color: '#9b87f5',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(155,135,245,0.18)'
                    }
                  }
                }
              }}
            >
              <ToggleButton value="" sx={{ mr: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, mr: 0.5 }} />
                All
              </ToggleButton>
              <ToggleButton value="7days" sx={{ mr: 1 }}>
                7 days
              </ToggleButton>
              <ToggleButton value="30days" sx={{ mr: 1 }}>
                30 days
              </ToggleButton>
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
                color: 'text.secondary',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
              }}
            >
              Clear all filters
            </Button>
          </Box>
        )}

        {/* ===== EXPORT MOBILE ===== */}
        <Box sx={{ mt: 2, display: { xs: 'block', sm: 'none' } }}>
          <Button startIcon={<FileDownloadIcon />} variant="outlined" fullWidth sx={{ borderRadius: 2, textTransform: 'none' }}>
            Export Users
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default UsersFilters;
