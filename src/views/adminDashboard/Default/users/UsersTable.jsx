import { useState } from 'react';
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
import { useColorScheme } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import KeyIcon from '@mui/icons-material/Key';

import { glassCard, gradientButton, gradientIconBox, glowShadow, GRADIENT_MAIN, GRADIENT_DANGER, GRADIENT_WARM } from './aiUi';

const getEmailVerifiedColor = (verified) => (verified ? 'success' : 'warning');

const headerCellSx = (isDark) => ({
  color: isDark ? '#e2e8f0' : '#334155',
  fontWeight: 800,
  fontSize: '0.76rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  bgcolor: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
  borderBottom: `1px solid ${isDark ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.22)'}`
});

const rowCellSx = (isDark) => ({
  borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)'}`
});

const chipSx = (verified, isDark) => ({
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.02em',
  border: `1px solid ${verified ? 'rgba(52,211,153,0.45)' : 'rgba(251,191,36,0.45)'}`,
  bgcolor: verified ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)',
  color: verified ? (isDark ? '#4ade80' : '#059669') : isDark ? '#facc15' : '#d97706',
  boxShadow: glowShadow(verified ? '52,211,153' : '251,191,36', 0.45, 12)
});

const actionBtnSx = (color, hoverColor, bgRgb) => ({
  width: 32,
  height: 32,
  bgcolor: `rgba(${bgRgb},0.1)`,
  color,
  transition: 'all 0.2s',
  '&:hover': {
    bgcolor: `rgba(${bgRgb},0.22)`,
    color: hoverColor,
    transform: 'translateY(-1px)',
    boxShadow: glowShadow(bgRgb, 0.4, 10)
  }
});

const UsersTable = ({ users, selectedUsers, isMobile, isTablet, onSelectAll, onSelectUser, onEditUser, onDeleteUser, onResetPassword }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  // =========================
  // DELETE CONFIRM STATE
  // =========================
  const [openConfirm, setOpenConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // =========================
  // RESET PASSWORD STATE
  // =========================
  const [openReset, setOpenReset] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

  const handleAskDelete = (user) => {
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id);
    }
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setUserToDelete(null);
  };

  const handleAskReset = (user) => {
    setUserToReset(user);
    setOpenReset(true);
  };

  const handleConfirmReset = () => {
    if (userToReset) {
      onResetPassword(userToReset.id);
    }
    setOpenReset(false);
    setUserToReset(null);
  };

  const handleCancelReset = () => {
    setOpenReset(false);
    setUserToReset(null);
  };

  const dialogPaperSx = {
    ...glassCard(isDark),
    borderRadius: '24px',
    p: 1.5,
    boxShadow: isDark
      ? '0 32px 80px -20px rgba(2,6,23,0.85), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 32px 80px -24px rgba(30,58,138,0.3), inset 0 1px 0 rgba(255,255,255,0.95)'
  };

  const infoBoxSx = {
    mt: 2,
    p: 1.5,
    borderRadius: '12px',
    bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.05)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(59,130,246,0.12)'}`
  };

  const confirmButton = (gradient, glowRgb) => ({
    ...gradientButton(gradient, glowRgb),
    py: '8px',
    px: 3
  });

  return (
    <>
      <Card elevation={0} sx={glassCard(isDark)}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={headerCellSx(isDark)}>
                  <Checkbox
                    checked={users.length > 0 && selectedUsers.length === users.length}
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }}
                  />
                </TableCell>
                <TableCell sx={headerCellSx(isDark)}>User</TableCell>
                {!isMobile && <TableCell sx={headerCellSx(isDark)}>Email</TableCell>}
                {!isTablet && <TableCell sx={headerCellSx(isDark)}>Role</TableCell>}
                <TableCell sx={headerCellSx(isDark)}>Email Confirmed</TableCell>
                <TableCell align="right" sx={headerCellSx(isDark)}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    '& td': { borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.08)' },
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.045)'
                    }
                  }}
                >
                  <TableCell padding="checkbox" sx={rowCellSx(isDark)}>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => onSelectUser(user.id)}
                      sx={{ color: '#3b82f6', '&.Mui-checked': { color: '#3b82f6' } }}
                    />
                  </TableCell>

                  <TableCell sx={rowCellSx(isDark)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                      <Box
                        sx={{
                          position: 'relative',
                          borderRadius: '50%',
                          p: '2px',
                          backgroundImage: GRADIENT_MAIN,
                          boxShadow: glowShadow('59,130,246', 0.5, 12),
                          lineHeight: 0
                        }}
                      >
                        {user.avatar ? (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: isDark ? '#0f172a' : '#fff',
                              color: isDark ? '#60a5fa' : '#1d4ed8',
                              fontWeight: 800,
                              fontSize: 14
                            }}
                          >
                            {user.avatar}
                          </Avatar>
                        ) : (
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: isDark ? '#0f172a' : '#fff',
                              color: isDark ? '#60a5fa' : '#1d4ed8',
                              fontWeight: 800,
                              fontSize: 14
                            }}
                          >
                            {user.name?.charAt(0) || '?'}
                          </Avatar>
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {!isMobile && <TableCell sx={rowCellSx(isDark)}>{user.email}</TableCell>}
                  {!isTablet && (
                    <TableCell sx={{ ...rowCellSx(isDark), fontWeight: 600, color: isDark ? '#93c5fd' : '#1d4ed8', fontSize: '0.85rem' }}>
                      {user.role}
                    </TableCell>
                  )}

                  <TableCell sx={rowCellSx(isDark)}>
                    <Chip
                      label={user.emailConfirmed ? 'Verified' : 'Not Verified'}
                      color={getEmailVerifiedColor(user.emailConfirmed)}
                      size="small"
                      variant="outlined"
                      sx={chipSx(user.emailConfirmed, isDark)}
                    />
                  </TableCell>

                  <TableCell align="right" sx={rowCellSx(isDark)}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.75 }}>
                      <IconButton size="small" onClick={() => onEditUser(user)} sx={actionBtnSx('#60a5fa', '#3b82f6', '59,130,246')}>
                        <EditIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleAskReset(user)}
                        sx={actionBtnSx(isDark ? '#fbbf24' : '#d97706', isDark ? '#fcd34d' : '#b45309', '251,146,60')}
                      >
                        <KeyIcon fontSize="small" />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => handleAskDelete(user)}
                        sx={actionBtnSx(isDark ? '#fb7185' : '#ef4444', isDark ? '#fda4af' : '#b91c1c', '239,68,68')}
                      >
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
      <Dialog open={openConfirm} onClose={handleCancelDelete} fullWidth maxWidth="xs" PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={gradientIconBox(40, '12px', GRADIENT_DANGER, '239,68,68')}>
              <WarningAmberRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Delete user?
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this user?
          </Typography>

          {userToDelete && (
            <Box sx={infoBoxSx}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {userToDelete.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userToDelete.email}
              </Typography>
            </Box>
          )}

          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#fb7185', fontWeight: 700 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            size="small"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" size="small" sx={confirmButton(GRADIENT_DANGER, '239,68,68')}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* =========================
          RESET PASSWORD DIALOG
         ========================= */}
      <Dialog open={openReset} onClose={handleCancelReset} fullWidth maxWidth="xs" PaperProps={{ sx: dialogPaperSx }}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={gradientIconBox(40, '12px', GRADIENT_WARM, '251,146,60')}>
              <KeyIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              Reset password?
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to reset this user's password to the default?
          </Typography>

          {userToReset && (
            <Box sx={infoBoxSx}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {userToReset.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userToReset.email}
              </Typography>
            </Box>
          )}

          <Typography variant="caption" sx={{ display: 'block', mt: 2, fontWeight: 700, color: '#3b82f6' }}>
            New password: Abbsium.2020
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={handleCancelReset}
            variant="outlined"
            size="small"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700 }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmReset} variant="contained" size="small" sx={confirmButton(GRADIENT_WARM, '251,146,60')}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersTable;
