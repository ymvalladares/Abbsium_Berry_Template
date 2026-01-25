import React from 'react';
import {
  Card,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  IconButton
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ✅ Nueva función para el color de email verified
const getEmailVerifiedColor = (verified) => {
  return verified ? 'success' : 'warning';
};

const UsersTable = ({ users, selectedUsers, isMobile, isTablet, onSelectAll, onSelectUser, onEditUser }) => {
  return (
    <Card sx={{ borderRadius: 2 }}>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUsers.length === users.length}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>User</TableCell>
              {!isMobile && <TableCell>Email</TableCell>}
              {!isTablet && <TableCell>Role</TableCell>}
              <TableCell>Email Confirmed</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox checked={selectedUsers.includes(user.id)} onChange={() => onSelectUser(user.id)} />
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user.avatar ? (
                      <Avatar sx={{ bgcolor: '#9b87f5' }}>{user.avatar}</Avatar>
                    ) : (
                      <Avatar src={`https://i.pravatar.cc/150?u=${user.id}`} />
                    )}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.username}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                {!isMobile && <TableCell>{user.email}</TableCell>}
                {!isTablet && <TableCell>{user.role}</TableCell>}

                {/* ✅ CORREGIDO: Muestra texto legible y color apropiado */}
                <TableCell>
                  <Chip
                    label={user.emailConfirmed ? 'Verified' : 'Not Verified'}
                    color={getEmailVerifiedColor(user.emailConfirmed)}
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton size="small" onClick={() => onEditUser(user)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default UsersTable;
