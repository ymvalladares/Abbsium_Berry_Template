import { Box, Avatar, Typography, Badge } from '@mui/material';

const primaryColor = '#0EA5E9';

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

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        px: 2.5,
        py: 1.8,
        cursor: 'pointer',
        bgcolor: isSelected ? primaryColor + '08' : 'transparent',
        borderLeft: isSelected ? `3px solid ${primaryColor}` : '3px solid transparent',
        transition: 'all 0.15s ease',
        position: 'relative',
        '&:hover': {
          bgcolor: isSelected ? primaryColor + '08' : '#f8fafc',
        },
      }}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
        sx={{
          '& .MuiBadge-badge': {
            bgcolor: isOnline ? '#10b981' : 'transparent',
            width: 10, height: 10, borderRadius: '50%',
            border: isOnline ? '2px solid #fff' : 'none',
          },
        }}
      >
        <Avatar
          src={chat.avatar}
          alt={chat.userName || chat.name}
          sx={{
            width: 46, height: 46,
            bgcolor: primaryColor,
            fontSize: '1rem', fontWeight: 600,
          }}
        >
          {(chat.userName || chat.name || 'U')[0]?.toUpperCase()}
        </Avatar>
      </Badge>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
          <Typography sx={{
            fontWeight: hasUnread ? 600 : 500,
            color: '#0f172a',
            fontSize: '0.9rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {chat.userName || chat.name}
          </Typography>

          <Typography variant="caption" sx={{
            color: hasUnread ? primaryColor : '#94a3b8',
            fontSize: '0.7rem',
            fontWeight: hasUnread ? 600 : 400,
            ml: 1, flexShrink: 0,
          }}>
            {formatTime(chat.lastMessageAt || chat.timestamp)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          <Typography variant="body2" sx={{
            fontSize: '0.8rem',
            color: hasUnread ? '#334155' : '#94a3b8',
            fontWeight: hasUnread ? 500 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1, lineHeight: 1.4,
          }}>
            {chat.lastMessage || 'No messages yet'}
          </Typography>

          {hasUnread && (
            <Box sx={{
              minWidth: 20, height: 20,
              borderRadius: '10px',
              bgcolor: primaryColor,
              color: '#fff',
              fontSize: '0.65rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              px: 0.5, flexShrink: 0,
            }}>
              {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatListItem;
