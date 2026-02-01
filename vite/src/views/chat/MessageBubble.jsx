import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Fade } from '@mui/material';
import { MoreVert as MoreIcon, Done as DoneIcon, DoneAll as DoneAllIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

const MessageBubble = ({ message, isAdmin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMine = message.isSender === true;
  const isPending = message.isPending === true; // ⭐ NUEVO

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        mb: 2,
        px: 2,
        gap: 1,
        position: 'relative',
        opacity: isPending ? 0.7 : 1, // ⭐ Opacidad reducida para pendientes
        '&:hover .message-actions': {
          opacity: 1
        }
      }}
    >
      {/* Avatar IZQUIERDA (otros) */}
      {!isMine && (
        <Avatar
          src={message.avatar}
          alt={message.senderName}
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#1967D2',
            fontSize: '0.875rem',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          {(message.senderName || 'U')[0]?.toUpperCase()}
        </Avatar>
      )}

      {/* Contenedor del mensaje */}
      <Box
        sx={{
          maxWidth: { xs: '75%', sm: '60%', md: '55%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMine ? 'flex-end' : 'flex-start'
        }}
      >
        {/* Nombre del remitente (solo para mensajes recibidos) */}
        {!isMine && (
          <Typography
            variant="caption"
            sx={{
              color: '#5f6368',
              fontWeight: 500,
              mb: 0.5,
              ml: 1,
              fontSize: '0.75rem'
            }}
          >
            {message.senderName || 'User'}
          </Typography>
        )}

        {/* Burbuja del mensaje */}
        <Box
          sx={{
            position: 'relative',
            bgcolor: isMine ? '#1967D2' : '#f1f3f4',
            color: isMine ? '#fff' : '#202124',
            px: 2,
            py: 1.5,
            borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            boxShadow: '0 1px 2px 0 rgba(60,64,67,0.15)',
            wordBreak: 'break-word',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 1px 3px 0 rgba(60,64,67,0.3)'
            }
          }}
        >
          <Typography
            sx={{
              fontSize: '0.9375rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word'
            }}
          >
            {message.content || message.text}
          </Typography>
        </Box>

        {/* Metadatos: hora + estado */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
            px: 1
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#5f6368',
              fontSize: '0.6875rem',
              fontWeight: 400
            }}
          >
            {formatTime(message.sentAt || message.timestamp)}
          </Typography>

          {/* Estado de lectura (solo mensajes enviados) */}
          {isMine && (
            <>
              {isPending ? (
                <CircularProgress size={12} thickness={5} sx={{ color: '#5f6368' }} /> // ⭐ Spinner
              ) : message.isRead ? (
                <DoneAllIcon sx={{ fontSize: 14, color: '#1967D2' }} />
              ) : (
                <DoneIcon sx={{ fontSize: 14, color: '#5f6368' }} />
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Avatar DERECHA (míos) */}
      {isMine && (
        <Avatar
          src={message.avatar}
          alt="You"
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#1967D2',
            fontSize: '0.875rem',
            fontWeight: 600,
            flexShrink: 0
          }}
        >
          {(message.senderName || 'Y')[0]?.toUpperCase()}
        </Avatar>
      )}

      {/* Menú contextual */}
      <IconButton
        size="small"
        onClick={handleMenuOpen}
        className="message-actions"
        sx={{
          position: 'absolute',
          top: -8,
          right: isMine ? 48 : 'auto',
          left: isMine ? 'auto' : 48,
          bgcolor: '#fff',
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3)',
          opacity: 0,
          transition: 'opacity 0.2s',
          '&:hover': {
            bgcolor: '#f1f3f4'
          }
        }}
      >
        <MoreIcon sx={{ fontSize: 16, color: '#5f6368' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 160,
            boxShadow: '0 2px 6px 2px rgba(60,64,67,0.15)'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>
          Copy
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem' }}>
          Reply
        </MenuItem>
        {isMine && (
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', color: '#d93025' }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MessageBubble;
