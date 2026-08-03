import { Box, Avatar, Typography, Badge } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';

const primaryColor = '#8B5CF6';

const ChatListItem = ({ chat, isSelected, onClick }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primLight = isDark ? '#2D1B69' : '#F3E8FF';
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

  const isOnline = chat.isOnline || chat.status === 'online';
  const unreadCount = chat.unreadCount || 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.25,
        py: 0.8,
        mx: 0.25,
        my: 0.5,
        borderRadius: 2.5,
        cursor: 'pointer',
        bgcolor: isSelected ? primLight : 'transparent',
        border: 'none',
        transition: 'all 0.15s ease',
        position: 'relative',
        '&:hover': {
          bgcolor: isSelected ? primLight : isDark ? '#1e293b' : '#f8fafc',
        },
        touchAction: 'manipulation',
      }}
    >
      {/* Avatar */}
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: isOnline ? '#10b981' : 'transparent',
              width: 10, height: 10, borderRadius: '50%',
              border: isOnline ? (isDark ? '2px solid #1e293b' : '2px solid #fff') : 'none',
              ...(isSelected && { borderColor: primLight }),
            },
          }}
        >
          <Avatar
            src={chat.avatar}
            alt={chat.userName || chat.name}
            sx={{
              width: 40, height: 40,
              bgcolor: isSelected ? primaryColor : (isDark ? '#1e293b' : '#fff'),
              border: `2px solid ${primaryColor}`,
              color: isSelected ? '#fff' : primaryColor,
              fontSize: '0.9rem', fontWeight: 600,
            }}
          >
            {(chat.userName || chat.name || 'U')[0]?.toUpperCase()}
          </Avatar>
        </Badge>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Top row: name */}
        <Typography sx={{
          fontWeight: isSelected ? 700 : 600,
          color: isSelected ? primaryColor : isDark ? '#f1f5f9' : '#0f172a',
          fontSize: '0.82rem',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          mb: 0.15,
        }}>
          {chat.userName || chat.name}
        </Typography>

        {/* Bottom row: last message */}
        <Typography variant="caption" sx={{
          color: unreadCount > 0 ? (isDark ? '#D1D5DB' : '#475569') : (isDark ? '#6B7280' : '#94a3b8'),
          fontSize: '0.72rem',
          fontWeight: unreadCount > 0 ? 500 : 400,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {chat.lastMessage || 'Start a conversation'}
        </Typography>
      </Box>

      {/* Right side: time + badge stacked */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        flexShrink: 0,
        minWidth: 28,
      }}>
        <Typography variant="caption" sx={{
          color: unreadCount > 0 ? primaryColor : (isDark ? '#64748b' : '#94a3b8'),
          fontSize: '0.62rem',
          fontWeight: 600,
          lineHeight: 1,
        }}>
          {formatTime(chat.lastMessageAt || chat.timestamp)}
        </Typography>
        {unreadCount > 0 && (
          <Box sx={{
            minWidth: 20, height: 20,
            borderRadius: '10px',
            bgcolor: primaryColor,
            color: '#fff',
            fontSize: '0.65rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            px: 0.5,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatListItem;
