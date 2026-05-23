import { Box, Avatar, Typography, Badge, IconButton, Divider, Tooltip } from '@mui/material';
import { MoreVert, DoneAll, PushPin } from '@mui/icons-material';

const primaryColor = '#0EA5E9';
const primaryLight = '#E0F2FE';

const ChatListItem = ({ chat, isSelected, onClick, hasDivider, onTogglePin, isPinned }) => {
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
  const hasMessages = !!chat.lastMessage;

  return (
    <>
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          bgcolor: isSelected ? primaryLight : 'transparent',
          transition: 'all 0.15s ease',
          position: 'relative',
          '&:hover': {
            bgcolor: isSelected ? primaryLight : '#f8fafc',
          },
          '&:hover .list-actions': { opacity: 1 },
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
                width: 11, height: 11, borderRadius: '50%',
                border: isOnline ? '2.5px solid #fff' : 'none',
                ...(isSelected && { borderColor: primaryLight }),
              },
            }}
          >
            <Avatar
              src={chat.avatar}
              alt={chat.userName || chat.name}
              sx={{
                width: 44, height: 44,
                bgcolor: primaryColor,
                fontSize: '1rem', fontWeight: 600,
              }}
            >
              {(chat.userName || chat.name || 'U')[0]?.toUpperCase()}
            </Avatar>
          </Badge>
          {isPinned && (
            <Box sx={{
              position: 'absolute', top: -4, right: -4,
              bgcolor: '#fff', borderRadius: '50%',
              width: 16, height: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>
              <PushPin sx={{ fontSize: 10, color: primaryColor, transform: 'rotate(45deg)' }} />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.3 }}>
            <Typography sx={{
              fontWeight: hasUnread ? 700 : 600,
              color: '#0f172a',
              fontSize: '0.9rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1,
            }}>
              {chat.userName || chat.name}
            </Typography>
            <Typography variant="caption" sx={{
              color: hasUnread ? primaryColor : '#94a3b8',
              fontSize: '0.68rem',
              fontWeight: hasUnread ? 600 : 400,
              ml: 1, flexShrink: 0,
              letterSpacing: '0.02em',
            }}>
              {formatTime(chat.lastMessageAt || chat.timestamp)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasMessages && (
              <DoneAll sx={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }} />
            )}
            <Typography variant="body2" sx={{
              fontSize: '0.8rem',
              color: hasUnread ? '#334155' : '#94a3b8',
              fontWeight: hasUnread ? 500 : 400,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              flex: 1, lineHeight: 1.4,
            }}>
              {chat.lastMessage || 'No messages yet'}
            </Typography>
          </Box>

          {isOnline && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.3 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#10b981' }} />
              <Typography variant="caption" sx={{
                fontSize: '0.6rem', color: '#10b981', fontWeight: 500, lineHeight: 1,
              }}>
                Online
              </Typography>
            </Box>
          )}
        </Box>

        {hasUnread && (
          <Box sx={{
            minWidth: 20, height: 20,
            borderRadius: '10px',
            bgcolor: primaryColor,
            color: '#fff',
            fontSize: '0.65rem', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            px: 0.5, flexShrink: 0,
            position: 'absolute', top: 10, right: 8,
          }}>
            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, ml: 'auto', flexShrink: 0 }}>
          <Tooltip title={isPinned ? 'Unpin' : 'Pin'} arrow>
            <IconButton
              size="small"
              className="list-actions"
              onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
              sx={{
                opacity: 0,
                transition: 'opacity 0.15s ease',
                color: isPinned ? primaryColor : '#94a3b8',
                p: 0.5,
                '&:hover': { bgcolor: primaryLight },
              }}
            >
              <PushPin sx={{ fontSize: 14, transform: isPinned ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            className="list-actions"
            onClick={(e) => e.stopPropagation()}
            sx={{
              opacity: 0,
              transition: 'opacity 0.15s ease',
              color: '#94a3b8',
              p: 0.5,
              '&:hover': { bgcolor: primaryLight },
            }}
          >
            <MoreVert sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
      {hasDivider && <Divider sx={{ mx: 2.5, borderColor: '#f1f5f9' }} />}
    </>
  );
};

export default ChatListItem;
