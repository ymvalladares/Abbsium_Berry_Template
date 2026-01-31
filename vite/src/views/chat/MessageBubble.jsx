import React from 'react';
import { Box, Avatar, Typography } from '@mui/material';

const MessageBubble = ({ message }) => {
  // ⭐ NUEVO: Formatear hora
  const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.isSender || message.isAdminMessage ? 'flex-end' : 'flex-start', // ⭐ ACTUALIZADO
        gap: 0.5,
        mb: 0.5,
        px: 1
      }}
    >
      {/* Avatar */}
      {!message.isSender &&
        !message.isAdminMessage && ( // ⭐ ACTUALIZADO
          <Avatar
            src={message.avatar}
            alt={message.senderName || message.sender} // ⭐ ACTUALIZADO
            sx={{ width: 28, height: 28 }}
          />
        )}

      {/* Message */}
      <Box
        sx={{
          maxWidth: { xs: '80%', sm: '65%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: message.isSender || message.isAdminMessage ? 'flex-end' : 'flex-start' // ⭐ ACTUALIZADO
        }}
      >
        <Box
          sx={{
            bgcolor: message.isSender || message.isAdminMessage ? '#5E35B1' : '#fff', // ⭐ ACTUALIZADO
            color: message.isSender || message.isAdminMessage ? '#fff' : '#111', // ⭐ ACTUALIZADO
            px: 1.25,
            py: 0.75,
            borderRadius: 2,
            boxShadow:
              message.isSender || message.isAdminMessage // ⭐ ACTUALIZADO
                ? '0 1px 3px rgba(94,53,177,0.3)'
                : '0 1px 2px rgba(0,0,0,0.08)',
            lineHeight: 1.4,
            wordBreak: 'break-word'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.9rem',
              whiteSpace: 'pre-wrap'
            }}
          >
            {message.content || message.text} {/* ⭐ ACTUALIZADO */}
          </Typography>
        </Box>

        <Typography
          variant="caption"
          sx={{
            color: '#9ca3af',
            mt: 0.25,
            fontSize: '0.65rem',
            alignSelf: message.isSender || message.isAdminMessage ? 'flex-end' : 'flex-start' // ⭐ ACTUALIZADO
          }}
        >
          {formatTime(message.sentAt || message.timestamp)} {/* ⭐ ACTUALIZADO */}
        </Typography>
      </Box>

      {/* Sender avatar */}
      {(message.isSender || message.isAdminMessage) && ( // ⭐ ACTUALIZADO
        <Avatar
          src={message.avatar}
          alt={message.senderName || message.sender} // ⭐ ACTUALIZADO
          sx={{ width: 28, height: 28 }}
        />
      )}
    </Box>
  );
};

export default MessageBubble;
