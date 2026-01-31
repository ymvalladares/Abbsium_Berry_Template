import React from 'react';
import { Box, Avatar, Typography, Badge } from '@mui/material';

const ChatListItem = ({ chat, isSelected, onClick }) => {
  // ⭐ NUEVO: Formatear tiempo relativo
  const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        cursor: 'pointer',
        bgcolor: isSelected ? '#EDE7F6' : 'transparent',
        borderLeft: isSelected ? '3px solid #5E35B1' : '3px solid transparent',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          bgcolor: '#EDE7F6'
        }
      }}
    >
      {/* Avatar + online */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            bgcolor: chat.isOnline ? '#4caf50' : 'transparent',
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: '2px solid #fff'
          }
        }}
      >
        <Avatar
          src={chat.avatar}
          alt={chat.userName || chat.name} // ⭐ ACTUALIZADO
          sx={{
            width: 40,
            height: 40
          }}
        />
      </Badge>

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.25
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: chat.unreadCount > 0 ? 700 : 600, // ⭐ ACTUALIZADO
              color: '#5E35B1',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {chat.userName || chat.name} {/* ⭐ ACTUALIZADO */}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: '#9e9e9e',
                fontSize: '0.65rem'
              }}
            >
              {formatTime(chat.lastMessageAt || chat.timestamp)} {/* ⭐ ACTUALIZADO */}
            </Typography>

            {/* Unread message indicator */}
            {chat.unreadCount > 0 && ( // ⭐ ACTUALIZADO
              <Box
                sx={{
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                  borderRadius: '50%',
                  bgcolor: '#5E35B1',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {chat.unreadCount} {/* ⭐ ACTUALIZADO */}
              </Box>
            )}
          </Box>
        </Box>

        <Typography
          variant="body2"
          sx={{
            fontSize: '0.75rem',
            color: chat.unreadCount > 0 ? '#111827' : '#6b7280', // ⭐ ACTUALIZADO
            fontWeight: chat.unreadCount > 0 ? 600 : 400, // ⭐ ACTUALIZADO
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {chat.lastMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatListItem;
