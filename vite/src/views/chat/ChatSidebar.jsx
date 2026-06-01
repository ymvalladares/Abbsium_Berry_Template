import { useState, useMemo, useCallback } from 'react';
import {
  Box, TextField, InputAdornment, Typography, IconButton,
  Avatar, CircularProgress, Badge, Chip, Paper,
} from '@mui/material';
import {
  Search, Close, Chat, People, Forum,
} from '@mui/icons-material';
import ChatListItem from './ChatListItem';
import { getPinnedIds, togglePin as togglePinStorage } from './chatPins';
import { useChat } from '../../contexts/ChatContext';

const primaryColor = '#0EA5E9';
const primaryLight = '#E0F2FE';

const ChatSidebar = ({ isMobile }) => {
  const {
    isAdmin, conversations, admins, isConnected,
    isLoading, selectChat, selectedChat,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pinnedIds, setPinnedIds] = useState(getPinnedIds);

  const handleTogglePin = useCallback((id) => {
    const updated = togglePinStorage(id);
    setPinnedIds(updated);
  }, []);

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
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      const dateA = new Date(a.lastMessageAt || 0);
      const dateB = new Date(b.lastMessageAt || 0);
      return dateB - dateA;
    });
  }, [isAdmin, conversations, admins, searchQuery, filterType, pinnedIds]);

  const totalUnread = useMemo(() => {
    const list = isAdmin ? conversations : admins;
    return list.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
  }, [isAdmin, conversations, admins]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: isMobile ? '100%' : '360px',
        minWidth: isMobile ? '100%' : '360px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: '12px 0 0 12px',
        border: '1px solid #e2e8f0',
        borderRight: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}
    >
        <Box sx={{ px: { xs: 2.5, sm: 3 }, py: { xs: 2, sm: 2.5 }, borderBottom: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ bgcolor: primaryLight, p: 1, borderRadius: 2.5, display: 'flex', boxShadow: `0 3px 10px ${primaryColor}1A`, transition: 'transform 0.2s ease', '&:hover': { transform: 'scale(1.05)' } }}>
                <Forum sx={{ color: primaryColor, fontSize: 20 }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', lineHeight: 1.2 }}>
                    {isAdmin ? 'Messages' : 'Support Chat'}
                  </Typography>
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: isConnected ? '#10b981' : '#ef4444',
                    flexShrink: 0,
                    boxShadow: isConnected ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none',
                  }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', letterSpacing: '0.02em' }}>
                  {displayList.length} {displayList.length === 1 ? 'conversation' : 'conversations'}
                </Typography>
              </Box>
            </Box>
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
                borderRadius: '12px',
                bgcolor: '#f8fafc',
                fontSize: { xs: '16px', sm: '0.85rem' },
              '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
              '&:hover fieldset': { borderColor: '#cbd5e1' },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                borderWidth: '2px',
                boxShadow: `0 0 0 3px ${primaryLight}`,
              },
              '& input': { py: 1.2 },
            },
          }}
        />
      </Box>

      {isAdmin && (
        <Box
          sx={{
            px: { xs: 2.5, sm: 3 }, py: 1.5,
            borderBottom: '1px solid #e2e8f0',
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
                bgcolor: filterType === f ? primaryLight : '#fff',
                color: filterType === f ? primaryColor : '#64748b',
                fontWeight: filterType === f ? 600 : 500,
                fontSize: '0.8rem',
                border: filterType === f ? `1.5px solid ${primaryColor}40` : '1.5px solid #e2e8f0',
                borderRadius: '8px',
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
          <Box>
            {displayList.map((item, index) => (
              <ChatListItem
                key={item.id}
                chat={item}
                isSelected={item.id === selectedChat?.id}
                onClick={() => selectChat(item)}
                onTogglePin={() => handleTogglePin(item.id)}
                isPinned={pinnedIds.includes(item.id)}
                hasDivider={index < displayList.length - 1}
              />
            ))}
          </Box>
        )}
      </Box>

      <Typography sx={{
        textAlign: 'center',
        color: '#94a3b8', fontSize: '0.6rem',
        py: 1.2, letterSpacing: '0.03em',
        userSelect: 'none',
      }}>
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isConnected ? '#10b981' : '#ef4444', display: 'inline-block' }} />
          {isConnected ? 'Connected · Abbsium Chat' : 'Reconnecting...'}
        </Box>
      </Typography>
    </Paper>
  );
};

export default ChatSidebar;
