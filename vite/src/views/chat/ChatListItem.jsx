import { Box, Avatar, Typography, Badge } from '@mui/material';

const primaryColor = '#8B5CF6';
const primaryLight = '#F3E8FF';

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

  const isOnline = chat.isOnline || chat.status === 'online';
  const unreadCount = chat.unreadCount || 0;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1,
        py: 0.75,
        mx: 0.25,
        my: 0.6,
        borderRadius: 2.5,
        cursor: 'pointer',
        bgcolor: isSelected ? primaryLight : 'transparent',
        border: 'none',
        transition: 'all 0.15s ease',
        position: 'relative',
        '&:hover': {
          bgcolor: isSelected ? primaryLight : '#f8fafc',
        },
        touchAction: 'manipulation',
      }}
    >
      <Box sx={{ position: 'relative', flexShrink: 0 }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot"
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: isOnline ? '#10b981' : 'transparent',
              width: 9, height: 9, borderRadius: '50%',
              border: isOnline ? '2px solid #fff' : 'none',
              ...(isSelected && { borderColor: primaryLight }),
            },
          }}
        >
          <Avatar
            src={chat.avatar}
            alt={chat.userName || chat.name}
            sx={{
              width: 38, height: 38,
              bgcolor: isSelected ? primaryColor : '#fff',
              border: `2px solid ${primaryColor}`,
              color: isSelected ? '#fff' : primaryColor,
              fontSize: '0.9rem', fontWeight: 600,
            }}
          >
            {(chat.userName || chat.name || 'U')[0]?.toUpperCase()}
          </Avatar>
        </Badge>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.2 }}>
          <Typography sx={{
            fontWeight: isSelected ? 700 : 500,
            color: isSelected ? primaryColor : '#0f172a',
            fontSize: '0.85rem',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {chat.userName || chat.name}
          </Typography>
          {unreadCount > 0 ? (
            <Box sx={{
              minWidth: 20, height: 20,
              borderRadius: '10px',
              bgcolor: primaryColor,
              color: '#fff',
              fontSize: '0.65rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              px: 0.5, flexShrink: 0,
              ml: 0.75,
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Box>
          ) : (
            <Typography variant="caption" sx={{
              color: '#1e293b',
              fontSize: '0.7rem',
              fontWeight: 700,
              ml: 0.4, flexShrink: 0,
              letterSpacing: '0.02em',
            }}>
              {formatTime(chat.lastMessageAt || chat.timestamp)}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35 }}>
          {chat.lastMessage && (
            <Typography variant="caption" sx={{
              color: unreadCount > 0 ? '#475569' : '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: unreadCount > 0 ? 500 : 400,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {chat.lastMessage}
            </Typography>
          )}
        </Box>

        {isOnline && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.2 }}>
            <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#10b981' }} />
            <Typography variant="caption" sx={{
              fontSize: '0.55rem', color: '#10b981', fontWeight: 500, lineHeight: 1,
            }}>
              Online
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatListItem;
