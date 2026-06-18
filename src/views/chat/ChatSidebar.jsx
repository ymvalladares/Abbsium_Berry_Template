import { useState, useMemo } from 'react';
import { Box, TextField, InputAdornment, Typography, IconButton, CircularProgress, Badge, Paper, Skeleton } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Search, Close, Chat, People, Forum } from '@mui/icons-material';
import ChatListItem from './ChatListItem';
import { useChat } from '../../contexts/ChatContext';

const primaryColor = '#8B5CF6';
const primaryLight = '#F3E8FF';

const ChatSidebar = ({ isMobile }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primLight = isDark ? '#2D1B69' : primaryLight;
  const { isAdmin, conversations, admins, isConnected, isLoading, selectChat, selectedChat } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  const displayList = useMemo(() => {
    let list = isAdmin ? conversations : admins;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => item.userName?.toLowerCase().includes(q));
    }

    return [...list].sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || 0);
      const dateB = new Date(b.lastMessageAt || 0);
      return dateB - dateA;
    });
  }, [isAdmin, conversations, admins, searchQuery]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: isMobile ? '100%' : '360px',
        minWidth: isMobile ? '100%' : '360px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: isMobile ? 0 : '12px 0 0 12px',
        border: isMobile ? 'none' : '1px solid',
        borderColor: 'divider',
        borderRight: isMobile ? 'none' : '1px solid',
        borderRightColor: 'divider',
        boxShadow: isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        overflow: 'hidden',
        touchAction: 'manipulation'
      }}
    >
      <Box sx={{ px: 2.25, py: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                bgcolor: primLight,
                p: 1,
                borderRadius: 2.5,
                display: 'flex',
                boxShadow: `0 3px 10px ${primaryColor}1A`,
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              <Forum sx={{ color: primaryColor, fontSize: 20 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.2 }}>
                  {isAdmin ? 'Messages' : 'Support Chat'}
                </Typography>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: isConnected ? '#10b981' : '#ef4444',
                    flexShrink: 0,
                    boxShadow: isConnected ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none'
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', letterSpacing: '0.02em' }}>
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
                <Search sx={{ color: isDark ? '#6B7280' : '#94a3b8', fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: isDark ? '#6B7280' : '#94a3b8' }}>
                  <Close sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              bgcolor: isDark ? '#1e293b' : '#f8fafc',
              fontSize: { xs: '16px', sm: '0.85rem' },
              '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0', borderWidth: '1.5px' },
              '&:hover fieldset': { borderColor: isDark ? '#4B5563' : '#cbd5e1' },
              '&.Mui-focused fieldset': {
                borderColor: primaryColor,
                borderWidth: '2px',
                boxShadow: isDark ? 'none' : `0 0 0 3px ${primaryLight}`
              },
              '& input': { py: 1.2, color: isDark ? '#f1f5f9' : '#0f172a' },
              '& input::placeholder': { color: isDark ? '#6B7280' : '#94a3b8' }
            }
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.25,
          py: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#4B5563' : '#e2e8f0', borderRadius: '3px' }
        }}
      >
        {isLoading ? (
          <Box sx={{ px: 1.25, py: 1 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                px: 1, py: 0.75, mx: 0.25, my: 0.6, borderRadius: 2.5,
              }}>
                <Skeleton variant="circular" width={38} height={38} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width={100} height={14} sx={{ mb: 0.5 }} />
                  <Skeleton width={140} height={12} />
                </Box>
                <Skeleton width={30} height={14} />
              </Box>
            ))}
          </Box>
        ) : displayList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: primLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              {isAdmin ? <People sx={{ color: primaryColor, fontSize: 24 }} /> : <Chat sx={{ color: primaryColor, fontSize: 24 }} />}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
              {searchQuery ? 'No results found' : isAdmin ? 'No conversations yet' : 'No admins available'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {searchQuery ? 'Try a different search term' : isAdmin ? 'New conversations will appear here' : 'Check back later'}
            </Typography>
          </Box>
        ) : (
          <Box>
            {displayList.map((item) => (
              <ChatListItem key={item.id} chat={item} isSelected={item.id === selectedChat?.id} onClick={() => selectChat(item)} />
            ))}
          </Box>
        )}
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: '0.6rem',
          py: 1.2,
          letterSpacing: '0.03em',
          userSelect: 'none'
        }}
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
          <Box
            component="span"
            sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isConnected ? '#10b981' : '#ef4444', display: 'inline-block' }}
          />
          <Typography component="span" sx={{ fontWeight: 'bold', fontSize: '0.55rem' }}>
            {isConnected ? 'Connected · Abbsium Chat' : 'Reconnecting...'}
          </Typography>
        </Box>
      </Typography>
    </Paper>
  );
};

export default ChatSidebar;
