import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme, useMediaQuery, Skeleton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import PeopleIcon from '@mui/icons-material/People';

import api from '../../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

import UsersFilters from './UsersFilters';
import UsersTable from './UsersTable';
import UsersUpsertPaper from './UsersUpsertPaper';
import { useFilters } from '../../../../contexts/FiltersContext';

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
    <Box sx={{ mb: 2 }}>
      {/* ===== STATS ===== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {loading ? (
          stats.map((stat, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '100%' }}>
                      <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                      <Skeleton variant="text" width={120} height={40} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width={100} height={16} />
                    </Box>
                    <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          stats.map((stat, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stat.value}{' '}
                      <Typography component="span" variant="body2" sx={{ color: stat.isPositive ? '#10b981' : '#ef4444' }}>
                        {stat.change}
                      </Typography>
                    </Typography>
                    <Typography variant="caption">{stat.subtitle}</Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: `${stat.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <PeopleIcon sx={{ color: stat.color }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))
        )}
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
        <Card sx={{ borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox"><Skeleton variant="circular" width={20} height={20} /></TableCell>
                  {!isMobile && <TableCell><Skeleton variant="text" width={80} /></TableCell>}
                  <TableCell><Skeleton variant="text" width={100} /></TableCell>
                  {!isTablet && <TableCell><Skeleton variant="text" width={80} /></TableCell>}
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell><Skeleton variant="text" width={60} /></TableCell>
                  <TableCell align="right"><Skeleton variant="text" width={60} /></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell padding="checkbox"><Skeleton variant="circular" width={20} height={20} /></TableCell>
                    {!isMobile && <TableCell><Skeleton variant="text" width={80} /></TableCell>}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={100} height={20} />
                          <Skeleton variant="text" width={140} height={16} />
                        </Box>
                      </Box>
                    </TableCell>
                    {!isTablet && <TableCell><Skeleton variant="text" width={80} /></TableCell>}
                    <TableCell><Skeleton variant="text" width={60} /></TableCell>
                    <TableCell><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                    <TableCell><Skeleton variant="text" width={80} /></TableCell>
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
  );
};

export default UsersList;
