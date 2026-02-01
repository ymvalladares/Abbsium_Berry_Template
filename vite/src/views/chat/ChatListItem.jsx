import React from 'react';
import { Box, Avatar, Typography, Badge } from '@mui/material';
import { DoneAll as ReadIcon, Circle as UnreadDotIcon } from '@mui/icons-material';

const ChatListItem = ({ chat, isSelected, onClick }) => {
  const formatTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const hasUnread = (chat.unreadCount || 0) > 0;
  const isOnline = chat.isOnline || chat.status === 'online';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.5,
        cursor: 'pointer',
        bgcolor: isSelected ? '#e8f0fe' : 'transparent',
        borderLeft: isSelected ? '3px solid #1967D2' : '3px solid transparent',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          bgcolor: isSelected ? '#e8f0fe' : '#f1f3f4'
        }
      }}
    >
      {/* Avatar con badge online */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            bgcolor: isOnline ? '#188038' : 'transparent',
            width: 10,
            height: 10,
            borderRadius: '50%',
            border: isOnline ? '2px solid #fff' : 'none'
          }
        }}
      >
        <Avatar
          src={chat.avatar}
          alt={chat.userName || chat.name}
          sx={{
            width: 48,
            height: 48,
            bgcolor: '#1967D2',
            fontSize: '1rem',
            fontWeight: 500
          }}
        >
          {(chat.userName || chat.name || 'U')[0]?.toUpperCase()}
        </Avatar>
      </Badge>

      {/* Información del chat */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 0.25
          }}
        >
          <Typography
            sx={{
              fontWeight: hasUnread ? 500 : 400,
              color: '#202124',
              fontSize: '0.9375rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {chat.userName || chat.name}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: hasUnread ? '#1967D2' : '#5f6368',
              fontSize: '0.75rem',
              fontWeight: hasUnread ? 500 : 400,
              ml: 1,
              flexShrink: 0
            }}
          >
            {formatTime(chat.lastMessageAt || chat.timestamp)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8125rem',
              color: hasUnread ? '#202124' : '#5f6368',
              fontWeight: hasUnread ? 500 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              lineHeight: 1.4
            }}
          >
            {chat.lastMessage || 'No messages yet'}
          </Typography>

          {/* Badge de mensajes no leídos */}
          {hasUnread && (
            <Box
              sx={{
                minWidth: 20,
                height: 20,
                borderRadius: '10px',
                bgcolor: '#1967D2',
                color: '#fff',
                fontSize: '0.6875rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 0.5,
                flexShrink: 0
              }}
            >
              {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatListItem;
