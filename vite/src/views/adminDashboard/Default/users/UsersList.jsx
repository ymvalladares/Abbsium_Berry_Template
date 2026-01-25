import React, { useState, useMemo, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

import api from '../../../../services/AxiosService';

import UsersFilters from './UsersFilters';
import UsersTable from './UsersTable';
import UsersUpsertPaper from './UsersUpsertPaper';
import { useFilters } from '../../../../contexts/FiltersContext';

// 👉 en el futuro esto viene del service
const MOCK_USERS = [
  {
    id: 1,
    name: 'Galen Slixby',
    username: 'gslixby0',
    email: 'gslixby0@abc.net.au',
    role: 'Editor',
    plan: 'Enterprise',
    status: 'Inactive',
    avatar: 'GS'
  },
  {
    id: 2,
    name: 'Halsey Redmore',
    username: 'hredmore1',
    email: 'hredmore1@imgur.com',
    role: 'Author',
    plan: 'Team',
    status: 'Pending',
    avatar: null
  },
  {
    id: 3,
    name: 'Marjory Sicely',
    username: 'msicely2',
    email: 'msicely2@who.int',
    role: 'Maintainer',
    plan: 'Enterprise',
    status: 'Active',
    avatar: null
  },
  {
    id: 4,
    name: 'Cyrill Risby',
    username: 'crisby3',
    email: 'crisby3@wordpress.com',
    role: 'Maintainer',
    plan: 'Team',
    status: 'Inactive',
    avatar: null
  }
];

const UsersList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openUpsert, setOpenUpsert] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // 👉 Obtiene filtros del contexto
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

  const stats = [
    { title: 'Session', value: '21,459', change: '+29%', subtitle: 'Total User', color: '#9b87f5', isPositive: true },
    { title: 'Paid Users', value: '4,567', change: '+18%', subtitle: 'Last week analytics', color: '#f87171', isPositive: true },
    { title: 'Active Users', value: '19,860', change: '-14%', subtitle: 'Last week analytics', color: '#4ade80', isPositive: false },
    { title: 'Pending Users', value: '237', change: '+42%', subtitle: 'Last week analytics', color: '#fbbf24', isPositive: true }
  ];

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

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? filteredUsers.map((u) => u.id) : []);
  };

  const handleSelectUser = (id) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

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
        users={filteredUsers} // ✅ aquí usamos filtrados automáticamente
        selectedUsers={selectedUsers}
        isMobile={isMobile}
        isTablet={isTablet}
        onSelectAll={handleSelectAll}
        onSelectUser={handleSelectUser}
        onEditUser={(user) => {
          setEditUser(user);
          setOpenUpsert(true);
        }}
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
        onSubmit={(data) => {
          if (editUser) {
            // EDIT
            setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...data } : u)));
          } else {
            // CREATE
            setUsers((prev) => [...prev, { ...data, id: Date.now(), status: data.active ? 'Active' : 'Inactive' }]);
          }

          setOpenUpsert(false);
          setEditUser(null);
        }}
        onSuccess={() => {
          fetchUsers(); // ✅ Refrescar lista después de crear/editar
        }}
      />
    </Box>
  );
};

export default UsersList;
