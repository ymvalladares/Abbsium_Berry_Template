import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import api from '../../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

import UsersFilters from './UsersFilters';
import UsersTable from './UsersTable';
import UsersUpsertPaper from './UsersUpsertPaper';
import { useFilters } from '../../../../contexts/FiltersContext';

import { AuroraLayer, glassCard, gradientText, gradientIconBox, glowShadow } from './aiUi';

const UsersList = () => {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const notify = useNotification();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openUpsert, setOpenUpsert] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // 👉 filtros desde context
  const { filters } = useFilters();

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // ✅ Validar que role exista antes de comparar
      if (filters.role && u.role !== filters.role) return false;

      // ✅ Validar que plan exista antes de comparar
      if (filters.plan && u.plan !== filters.plan) return false;

      // ✅ Validar que status exista antes de comparar
      if (filters.status && u.status !== filters.status) return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();

        // ✅ Validar cada propiedad antes de usar toLowerCase()
        const name = u.name?.toLowerCase() || '';
        const username = u.username?.toLowerCase() || '';
        const email = u.email?.toLowerCase() || '';
        const role = u.role?.toLowerCase() || '';

        if (!name.includes(q) && !username.includes(q) && !email.includes(q) && !role.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/User/All-Users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      notify.error('Could not load users. Please refresh the page.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  // 👉 Se ejecuta al montar y cada vez que cambian los filtros
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // =============================
  // SELECT
  // =============================
  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? users.map((u) => u.id) : []);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // =============================
  // DELETE
  // =============================
  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/User/Delete/${id}`);
      notify.success('User has been removed from the system', 'User Deleted');
      fetchUsers();
      setSelectedUsers((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error('Delete user error:', err);
      notify.error('Could not delete the user. Please try again.', 'Delete Failed');
    }
  };

  const handleResetPassword = async (id) => {
    try {
      await api.post('/User/Admin-Reset-Password', { userId: id, newPassword: 'Abbsium.2020' });
      notify.success('User password has been reset to default', 'Password Reset');
    } catch (err) {
      console.error('Reset password error:', err);
      notify.error('Could not reset the password. Please try again.', 'Reset Failed');
    }
  };

  const stats = [
    { title: 'Session', value: '21,459', change: '+29%', subtitle: 'Total User', color: '#9b87f5', isPositive: true },
    { title: 'Paid Users', value: '4,567', change: '+18%', subtitle: 'Last week analytics', color: '#f87171', isPositive: true },
    { title: 'Active Users', value: '19,860', change: '-14%', subtitle: 'Last week analytics', color: '#4ade80', isPositive: false },
    { title: 'Pending Users', value: '237', change: '+42%', subtitle: 'Last week analytics', color: '#fbbf24', isPositive: true }
  ];

  return (
    <Box sx={{ position: 'relative', mb: 2 }}>
      {/* ===== AURORA / PHOTOREAL AMBIENT BACKGROUND ===== */}
      <AuroraLayer isDark={isDark} />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* ===== STATS ===== */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {loading
            ? stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
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
            : stats.map((stat, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card elevation={0} sx={glassCard(isDark)}>
                    <CardContent sx={{ p: '22px 20px !important' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase'
                            }}
                          >
                            {stat.title}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.75, flexWrap: 'wrap' }}>
                            <Typography variant="h4" sx={{ ...gradientText, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                              {stat.value}
                            </Typography>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.25,
                                px: 0.75,
                                py: 0.35,
                                borderRadius: 1.5,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                color: stat.isPositive ? (isDark ? '#34d399' : '#059669') : isDark ? '#fb7185' : '#dc2626',
                                bgcolor: stat.isPositive ? 'rgba(52,211,153,0.14)' : 'rgba(251,113,133,0.14)',
                                boxShadow: glowShadow(stat.isPositive ? '52,211,153' : '251,113,133', 0.4, 10)
                              }}
                            >
                              {stat.isPositive ? <TrendingUpIcon sx={{ fontSize: 12 }} /> : <TrendingDownIcon sx={{ fontSize: 12 }} />}
                              {stat.change}
                            </Box>
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {stat.subtitle}
                          </Typography>
                        </Box>

                        <Box sx={gradientIconBox()}>
                          <PeopleIcon sx={{ color: '#fff', fontSize: 22 }} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>

        {/* ===== FILTERS ===== */}
        <UsersFilters
          onAddUser={() => {
            setEditUser(null);
            setOpenUpsert(true);
          }}
        />

        {/* ===== TABLE ===== */}
        {loading ? (
          <Card elevation={0} sx={glassCard(isDark)}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Skeleton variant="circular" width={20} height={20} />
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton variant="text" width={100} />
                    </TableCell>
                    {!isTablet && (
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                    )}
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={60} />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell padding="checkbox">
                        <Skeleton variant="circular" width={20} height={20} />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Box>
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={140} height={16} />
                          </Box>
                        </Box>
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                      )}
                      <TableCell>
                        <Skeleton variant="text" width={60} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="rounded" width={60} height={24} />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" width={80} />
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Skeleton variant="circular" width={32} height={32} />
                          <Skeleton variant="circular" width={32} height={32} />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <UsersTable
            users={filteredUsers}
            selectedUsers={selectedUsers}
            isMobile={isMobile}
            isTablet={isTablet}
            onSelectAll={handleSelectAll}
            onSelectUser={handleSelectUser}
            onEditUser={(user) => {
              setEditUser(user);
              setOpenUpsert(true);
            }}
            onDeleteUser={handleDeleteUser}
            onResetPassword={handleResetPassword}
          />
        )}

        {/* ===== ADD / EDIT ===== */}
        <UsersUpsertPaper
          open={openUpsert}
          mode={editUser ? 'edit' : 'create'}
          initialData={editUser}
          onClose={() => {
            setOpenUpsert(false);
            setEditUser(null);
          }}
          onSubmit={async (data) => {
            try {
              await api.post('/User/Upsert', {
                ...data,
                id: editUser?.id
              });

              showSnackbar(editUser ? 'User updated' : 'User created', 'success');
            } catch (err) {
              console.error(err);
              showSnackbar('Failed to save user', 'error');
            }

            setOpenUpsert(false);
            setEditUser(null);
          }}
          onSuccess={() => {
            fetchUsers(); // 🔥 NO SE TOCA
          }}
        />
      </Box>
    </Box>
  );
};

export default UsersList;
