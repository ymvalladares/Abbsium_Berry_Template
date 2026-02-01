import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  Avatar,
  CircularProgress,
  Tooltip,
  Badge,
  Divider,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  EditOutlined as NewChatIcon,
  SettingsOutlined as SettingsIcon,
  FilterListOutlined as FilterIcon,
  CheckCircleOutline as ReadIcon,
  MarkChatUnreadOutlined as UnreadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import ChatListItem from './ChatListItem';

const ChatSidebar = ({ isAdmin, conversations, admins, isConnected, isLoading, onSelectChat, selectedChatId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, unread, archived

  const displayList = useMemo(() => {
    let list = isAdmin ? conversations : admins;

    // Aplicar filtro
    if (filterType === 'unread') {
      list = list.filter((item) => (item.unreadCount || 0) > 0);
    }

    // Aplicar búsqueda
    if (searchQuery.trim()) {
      list = list.filter((item) => item.userName?.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Ordenar por último mensaje
    return list.sort((a, b) => {
      const dateA = new Date(a.lastMessageAt || 0);
      const dateB = new Date(b.lastMessageAt || 0);
      return dateB - dateA;
    });
  }, [isAdmin, conversations, admins, searchQuery, filterType]);

  const totalUnread = useMemo(() => {
    const list = isAdmin ? conversations : admins;
    return list.reduce((sum, item) => sum + (item.unreadCount || 0), 0);
  }, [isAdmin, conversations, admins]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (filter) => {
    setFilterType(filter);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', md: '360px' },
        display: 'flex',
        flexDirection: 'column',
        height: '75vh',
        bgcolor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #dadce0',
        boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
      }}
    >
      {/* ========== HEADER ========== */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #e8eaed',
          bgcolor: '#fff'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: isConnected ? '#188038' : '#ea4335',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '2px solid #fff'
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#1967D2',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}
              >
                {isAdmin ? 'A' : 'U'}
              </Avatar>
            </Badge>

            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 500,
                  color: '#202124',
                  fontSize: '1.125rem',
                  lineHeight: 1.3
                }}
              >
                {isAdmin ? 'Messages' : 'Support Chat'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#5f6368',
                  fontSize: '0.75rem',
                  fontWeight: 400
                }}
              >
                {displayList.length} {displayList.length === 1 ? 'conversation' : 'conversations'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {isAdmin && (
              <Tooltip title="New conversation" arrow>
                <IconButton
                  size="small"
                  sx={{
                    color: '#5f6368',
                    '&:hover': { bgcolor: '#f1f3f4' }
                  }}
                >
                  <NewChatIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="More options" arrow>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  color: '#5f6368',
                  '&:hover': { bgcolor: '#f1f3f4' }
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Barra de búsqueda */}
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
                <SearchIcon sx={{ color: '#5f6368', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{
                    color: '#5f6368',
                    '&:hover': { bgcolor: 'rgba(95,99,104,0.1)' }
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              borderRadius: '24px',
              bgcolor: '#f1f3f4',
              fontSize: '0.875rem',
              fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
              '& fieldset': {
                border: 'none'
              },
              '&:hover': {
                bgcolor: '#e8eaed'
              },
              '&.Mui-focused': {
                bgcolor: '#fff',
                boxShadow: '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)'
              }
            }
          }}
        />
      </Box>

      {/* ========== FILTROS ========== */}
      {isAdmin && (
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #e8eaed',
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}
        >
          <Chip
            label="All"
            size="small"
            onClick={() => setFilterType('all')}
            sx={{
              bgcolor: filterType === 'all' ? '#e8f0fe' : 'transparent',
              color: filterType === 'all' ? '#1967D2' : '#5f6368',
              fontWeight: filterType === 'all' ? 500 : 400,
              fontSize: '0.8125rem',
              border: filterType === 'all' ? 'none' : '1px solid #dadce0',
              '&:hover': {
                bgcolor: filterType === 'all' ? '#d2e3fc' : '#f1f3f4'
              }
            }}
          />
          <Chip
            label={`Unread ${totalUnread > 0 ? `(${totalUnread})` : ''}`}
            size="small"
            onClick={() => setFilterType('unread')}
            sx={{
              bgcolor: filterType === 'unread' ? '#e8f0fe' : 'transparent',
              color: filterType === 'unread' ? '#1967D2' : '#5f6368',
              fontWeight: filterType === 'unread' ? 500 : 400,
              fontSize: '0.8125rem',
              border: filterType === 'unread' ? 'none' : '1px solid #dadce0',
              '&:hover': {
                bgcolor: filterType === 'unread' ? '#d2e3fc' : '#f1f3f4'
              }
            }}
          />
          <Chip
            label="Active"
            size="small"
            onClick={() => setFilterType('active')}
            sx={{
              bgcolor: filterType === 'active' ? '#e8f0fe' : 'transparent',
              color: filterType === 'active' ? '#1967D2' : '#5f6368',
              fontWeight: filterType === 'active' ? 500 : 400,
              fontSize: '0.8125rem',
              border: filterType === 'active' ? 'none' : '1px solid #dadce0',
              '&:hover': {
                bgcolor: filterType === 'active' ? '#d2e3fc' : '#f1f3f4'
              }
            }}
          />
        </Box>
      )}

      {/* ========== LISTA DE CONVERSACIONES ========== */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: '#fff',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent'
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: '#dadce0',
            borderRadius: '4px',
            '&:hover': {
              bgcolor: '#bdc1c6'
            }
          }
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={32} thickness={4} sx={{ color: '#1967D2' }} />
          </Box>
        ) : displayList.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 4
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: '#f1f3f4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <Typography sx={{ fontSize: '2rem' }}>{searchQuery ? '🔍' : '💬'}</Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#5f6368',
                fontWeight: 400,
                mb: 0.5
              }}
            >
              {searchQuery ? 'No results found' : 'No conversations yet'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#80868b',
                fontSize: '0.75rem'
              }}
            >
              {searchQuery
                ? 'Try a different search term'
                : isAdmin
                  ? 'New conversations will appear here'
                  : 'Select an admin to start chatting'}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 1 }}>
            {displayList.map((item, index) => (
              <React.Fragment key={item.id}>
                <ChatListItem chat={item} isSelected={item.id === selectedChatId} onClick={() => onSelectChat(item)} />
                {index < displayList.length - 1 && <Divider sx={{ mx: 2, my: 0.5, borderColor: '#f1f3f4' }} />}
              </React.Fragment>
            ))}
          </Box>
        )}
      </Box>

      {/* ========== FOOTER ========== */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e8eaed',
          bgcolor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          sx={{
            fontSize: '0.6875rem',
            color: '#5f6368',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          🔒 End-to-end encrypted
        </Typography>
      </Box>

      {/* ========== MENÚ CONTEXTUAL ========== */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 2px 6px 2px rgba(60,64,67,0.15)',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5 }}>
          <ListItemIcon>
            <ReadIcon fontSize="small" sx={{ color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText>Mark all as read</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5 }}>
          <ListItemIcon>
            <FilterIcon fontSize="small" sx={{ color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText>Filter options</ListItemText>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.875rem', py: 1.5 }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: '#5f6368' }} />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ChatSidebar;
