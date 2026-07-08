import { createContext, useContext, useState, useCallback } from 'react';
import { Box, Typography, IconButton, Snackbar, Slide } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const NotificationContext = createContext(null);

const ICONS = {
  success: CheckCircleIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const COLORS = {
  success: { bg: '#065F46', border: '#10B981', text: '#6EE7B7', icon: '#10B981' },
  error: { bg: '#7F1D1D', border: '#EF4444', text: '#FCA5A5', icon: '#EF4444' },
  warning: { bg: '#78350F', border: '#F59E0B', text: '#FDE68A', icon: '#F59E0B' },
  info: { bg: '#1E3A5F', border: '#3B82F6', text: '#93C5FD', icon: '#3B82F6' },
};

const LIGHT_COLORS = {
  success: { bg: '#ECFDF5', border: '#10B981', text: '#065F46', icon: '#10B981' },
  error: { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', icon: '#EF4444' },
  warning: { bg: '#FFFBEB', border: '#F59E0B', text: '#92400E', icon: '#F59E0B' },
  info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', icon: '#3B82F6' },
};

function NotificationToast({ notification, onClose }) {
  const { mode } = useColorScheme();
  const isDark = mode === 'dark';
  const colors = isDark ? COLORS : LIGHT_COLORS;
  const { type, message, title } = notification;
  const config = colors[type] || colors.info;
  const Icon = ICONS[type] || ICONS.info;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        borderRadius: 2.5,
        bgcolor: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)',
        width: '100%',
      }}
    >
      <Icon sx={{ fontSize: 22, color: config.icon, flexShrink: 0, mt: 0.1 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {title && (
          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: config.text, mb: 0.25 }}>
            {title}
          </Typography>
        )}
        <Typography sx={{ fontSize: '0.8rem', color: isDark ? '#CBD5E1' : '#475569', lineHeight: 1.4 }}>
          {message}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: config.text,
          width: 22,
          height: 22,
          minWidth: 0,
          p: 0,
          '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
        }}
      >
        <CloseIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', title = '') => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, title };
    setNotifications((prev) => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = {
    success: (message, title) => addNotification(message, 'success', title),
    error: (message, title) => addNotification(message, 'error', title),
    warning: (message, title) => addNotification(message, 'warning', title),
    info: (message, title) => addNotification(message, 'info', title),
  };

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={4500}
          onClose={() => removeNotification(notification.id)}
          TransitionComponent={Slide}
          TransitionProps={{ direction: 'up' }}
        >
          <div style={{ width: '100%', maxWidth: 440, padding: '0 8px' }}>
            <NotificationToast notification={notification} onClose={() => removeNotification(notification.id)} />
          </div>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
