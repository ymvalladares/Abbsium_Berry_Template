import { useState, useMemo } from 'react';
import {
  Box, TextField, InputAdornment, Typography, IconButton,
  Avatar, CircularProgress, Badge, Divider, Chip,
} from '@mui/material';
import {
  Search, MoreVert, EditOutlined, Close, Chat, People,
} from '@mui/icons-material';
import ChatListItem from './ChatListItem';

const primaryColor = '#0EA5E9';
const primaryLight = '#F0F9FF';

const ChatSidebar = ({
  isAdmin, conversations, admins, isConnected,
  isLoading, onSelectChat, selectedChatId, isMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const displayList = useMemo(() => {
    let list = isAdmin ? conversations : admins;

    if (filterType === 'unread') {
      list = list.filter((item) => (item.unreadCount || 0) > 0);
    }
    if (filterType === 'active') {
      list = list.filter((item) => item.isOnline);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) =>
        item.userName?.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || 0);
      const dateB = new Date(b.lastMessageAt || 0);
      return dateB - dateA;
    });
  }, [isAdmin, conversations, admins, searchQuery, filterType]);

  const totalUnread = useMemo(() => {
    const list = isAdmin ? conversations : admins;
    return list.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
  }, [isAdmin, conversations, admins]);

  return (
    <Box
      sx={{
        width: isMobile ? '100%' : '360px',
        minWidth: isMobile ? '100%' : '360px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  bgcolor: isConnected ? '#10b981' : '#ef4444',
                  width: 10, height: 10, borderRadius: '50%',
                  border: '2px solid #fff',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 38, height: 38,
                  bgcolor: primaryColor,
                  fontSize: '0.9rem', fontWeight: 600,
                }}
              >
                {isAdmin ? 'A' : 'U'}
              </Avatar>
            </Badge>
            <Box>
              <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', lineHeight: 1.3 }}>
                {isAdmin ? 'Messages' : 'Support Chat'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                {displayList.length} {displayList.length === 1 ? 'conversation' : 'conversations'}
              </Typography>
            </Box>
          </Box>

          {isAdmin && (
            <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { bgcolor: primaryLight } }}>
              <EditOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        <TextField
          fullWidth
          placeholder={isAdmin ? 'Search conversations...' : 'Search admins...'}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}
                  sx={{ color: '#94a3b8' }}>
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '10px',
              bgcolor: '#f8fafc',
              fontSize: '0.85rem',
              '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                borderWidth: '2px',
                boxShadow: `0 0 0 3px ${primaryColor}20`,
              },
            },
          }}
        />
      </Box>

      {isAdmin && (
        <Box
          sx={{
            px: 2, py: 1.2,
            borderBottom: '1px solid #f1f5f9',
            display: 'flex', gap: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {['all', 'unread', 'active'].map((f) => (
            <Chip
              key={f}
              label={f === 'all' ? 'All' : f === 'unread' ? `Unread${totalUnread > 0 ? ` (${totalUnread})` : ''}` : 'Active'}
              size="small"
              onClick={() => setFilterType(f)}
              sx={{
                bgcolor: filterType === f ? primaryLight : 'transparent',
                color: filterType === f ? primaryColor : '#64748b',
                fontWeight: filterType === f ? 600 : 400,
                fontSize: '0.8rem',
                border: filterType === f ? `1px solid ${primaryColor}40` : '1px solid #e2e8f0',
                '&:hover': { bgcolor: filterType === f ? primaryLight : '#f8fafc' },
                transition: 'all 0.15s ease',
              }}
            />
          ))}
        </Box>
      )}

      <Box sx={{
        flex: 1, overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '3px' },
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={28} thickness={4} sx={{ color: primaryColor }} />
          </Box>
        ) : displayList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: primaryLight, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 2,
            }}>
              {isAdmin ? <People sx={{ color: primaryColor, fontSize: 24 }} /> : <Chat sx={{ color: primaryColor, fontSize: 24 }} />}
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, mb: 0.5 }}>
              {searchQuery ? 'No results found' : isAdmin ? 'No conversations yet' : 'No admins available'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              {searchQuery ? 'Try a different search term' : isAdmin ? 'New conversations will appear here' : 'Check back later'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 0.5 }}>
            {displayList.map((item, index) => (
              <Box key={item.id}>
                <ChatListItem
                  chat={item}
                  isSelected={item.id === selectedChatId}
                  onClick={() => onSelectChat(item)}
                />
                {index < displayList.length - 1 && (
                  <Divider sx={{ mx: 2.5, borderColor: '#f1f5f9' }} />
                )}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{
        px: 2.5, py: 1.5,
        borderTop: '1px solid #f1f5f9',
        bgcolor: '#fafafa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography sx={{
          fontSize: '0.65rem', color: '#94a3b8', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 0.5,
          letterSpacing: '0.02em',
        }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: isConnected ? '#10b981' : '#ef4444' }} />
          {isConnected ? 'End-to-end encrypted' : 'Reconnecting...'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
