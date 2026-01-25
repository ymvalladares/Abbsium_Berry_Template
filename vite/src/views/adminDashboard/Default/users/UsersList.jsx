import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

import api from '../../../../services/AxiosService';
import { showSnackbar } from '../../../../utils/snackbarNotif';

import UsersFilters from './UsersFilters';
import UsersTable from './UsersTable';
import UsersUpsertPaper from './UsersUpsertPaper';
import { useFilters } from '../../../../contexts/FiltersContext';

const UsersList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState([]);
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
    try {
      const response = await api.get('/User/All-Users'); // 🔹 filtros como query params
      console.log('Fetched users:', response.data);
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
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
      showSnackbar('User deleted successfully', 'success');

      fetchUsers();
      setSelectedUsers((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      console.error('Delete user error:', err);
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
        {stats.map((stat, index) => (
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
      />

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
