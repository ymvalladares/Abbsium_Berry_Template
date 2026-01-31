import React, { useState, useMemo } from 'react';
import { Box, TextField, InputAdornment, Typography, IconButton, Avatar, CircularProgress, Tooltip, Badge } from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, FiberManualRecord as StatusIcon } from '@mui/icons-material';
import ChatListItem from './ChatListItem';

const ChatSidebar = ({ isAdmin, conversations, admins, isConnected, isLoading, onSelectChat, selectedChatId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const displayList = useMemo(() => {
    if (isAdmin) {
      return conversations.filter((chat) => chat.userName?.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return admins.filter((admin) => admin.userName?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  }, [isAdmin, conversations, admins, searchQuery]);

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '400px' },
        display: 'flex',
        flexDirection: 'column',
        height: '75vh',
        bgcolor: '#FFFFFF',
        border: '1px solid #F0F0F2',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03), 0 0 1px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}
    >
      {/* --- HEADER: High-Contrast Hierarchy --- */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, #FFFFFF, #FAFAFB)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: isConnected ? '#10B981' : '#F43F5E',
                boxShadow: '0 0 0 2px #fff',
                width: 10,
                height: 10,
                borderRadius: '50%'
              }
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: '#18181B',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '-0.5px'
              }}
            >
              {isAdmin ? 'C' : 'A'}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#18181B', lineHeight: 1.2, letterSpacing: '-0.2px' }}>
              {isAdmin ? 'Conversations' : 'Team Admins'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#71717A', fontWeight: 500 }}>
              {displayList.length} Active {isAdmin ? 'Threads' : 'Members'}
            </Typography>
          </Box>
        </Box>

        <Tooltip title="New Action" placement="top" arrow>
          <IconButton
            sx={{
              bgcolor: '#F4F4F5',
              borderRadius: '10px',
              color: '#18181B',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#18181B', color: '#FFF', transform: 'translateY(-1px)' }
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* --- SEARCH: Layered Interaction --- */}
      <Box sx={{ px: 2, pb: 2.5 }}>
        <TextField
          fullWidth
          placeholder={isAdmin ? 'Filter conversations...' : 'Search admins...'}
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#A1A1AA', fontSize: 18 }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '12px',
              bgcolor: '#F4F4F5',
              fontSize: '0.875rem',
              '& fieldset': { border: 'none' },
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { bgcolor: '#EBEBEF' },
              '&.Mui-focused': {
                bgcolor: '#FFF',
                boxShadow: '0 0 0 1px #E4E4E7, 0 4px 12px rgba(0,0,0,0.05)'
              },
              px: 1
            }
          }}
        />
      </Box>

      {/* --- LIST AREA: The "User Surface" --- */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          pb: 2,
          // Premium Minimalist Scrollbar
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: '#E4E4E7',
            borderRadius: '10px',
            '&:hover': { background: '#D4D4D8' }
          },
          '&::-webkit-scrollbar-track': { background: 'transparent' }
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress size={28} thickness={5} sx={{ color: '#18181B' }} />
          </Box>
        ) : displayList.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, px: 4 }}>
            <Typography variant="body2" sx={{ color: '#A1A1AA', fontWeight: 500 }}>
              No results found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {displayList.map((item) => (
              <Box
                key={item.id}
                sx={{
                  position: 'relative',
                  '&::before':
                    item.id === selectedChatId
                      ? {
                          content: '""',
                          position: 'absolute',
                          left: '-6px',
                          top: '25%',
                          bottom: '25%',
                          width: '3px',
                          backgroundColor: '#18181B',
                          borderRadius: '0 4px 4px 0',
                          zIndex: 10
                        }
                      : {}
                }}
              >
                <ChatListItem
                  chat={item}
                  isSelected={item.id === selectedChatId}
                  onClick={() => onSelectChat(item)}
                  sx={{
                    borderRadius: '10px',
                    mb: 0.5,
                    mx: 0.5,
                    transition: 'all 0.15s ease',
                    bgcolor: item.id === selectedChatId ? '#F4F4F5' : 'transparent',
                    '&:hover': {
                      bgcolor: item.id === selectedChatId ? '#F4F4F5' : '#FAFAFB',
                      cursor: 'pointer'
                    },
                    // Visual hierarchy for internal labels
                    '& .MuiTypography-root': {
                      color: item.id === selectedChatId ? '#09090B' : '#3F3F46',
                      fontWeight: item.id === selectedChatId ? 600 : 500
                    }
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* --- FOOTER: Secondary Action Context --- */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #F0F0F2',
          bgcolor: '#FAFAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#A1A1AA',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
        >
          {isAdmin ? 'Management Mode' : 'Customer Support'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatSidebar;
