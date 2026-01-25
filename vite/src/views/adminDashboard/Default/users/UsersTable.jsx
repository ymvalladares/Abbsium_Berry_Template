import React, { useState } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const getEmailVerifiedColor = (verified) => (verified ? 'success' : 'warning');

const UsersTable = ({ users, selectedUsers, isMobile, isTablet, onSelectAll, onSelectUser, onEditUser, onDeleteUser }) => {
  // =========================
  // DELETE CONFIRM STATE
  // =========================
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleAskDelete = (user) => {
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id); // 🔥 SOLO AQUÍ SE BORRA
    }
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  return (
    <>
      <Card sx={{ borderRadius: 2 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={users.length > 0 && selectedUsers.length === users.length}
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

                      {/* 👉 ahora primero pregunta */}
                      <IconButton size="small" onClick={() => handleAskDelete(user)}>
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

      {/* =========================
          CONFIRM DELETE DIALOG
         ========================= */}
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberRoundedIcon color="warning" />
            <Typography variant="h6">Delete user?</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this user?
          </Typography>

          {userToDelete && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(0,0,0,0.04)'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {userToDelete.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userToDelete.email}
              </Typography>
            </Box>
          )}

          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCancelDelete} variant="outlined" size="small">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error" size="small">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTable;
