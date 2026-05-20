import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Fade } from '@mui/material';
import {
  MoreVert, Done, DoneAll, ContentCopy, Reply,
  DeleteOutline,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';

const primaryColor = '#0EA5E9';

const MessageBubble = ({ message, isAdmin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMine = message.isSender === true;
  const isPending = message.isPending === true;

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMine ? 'flex-end' : 'flex-start',
        mb: 1.5,
        px: 1,
        gap: 1,
        position: 'relative',
        opacity: isPending ? 0.6 : 1,
        transition: 'opacity 0.3s ease',
        '&:hover .msg-actions': { opacity: 1, transform: 'scale(1)' },
      }}
    >
      {!isMine && (
        <Avatar
          src={message.avatar}
          alt={message.senderName}
          sx={{
            width: 30, height: 30,
            bgcolor: primaryColor,
            fontSize: '0.8rem', fontWeight: 600,
            flexShrink: 0, mt: 0.5,
          }}
        >
          {(message.senderName || 'U')[0]?.toUpperCase()}
        </Avatar>
      )}

      <Box sx={{
        maxWidth: { xs: '80%', sm: '65%', md: '55%' },
        display: 'flex', flexDirection: 'column',
        alignItems: isMine ? 'flex-end' : 'flex-start',
      }}>
        {!isMine && (
          <Typography variant="caption" sx={{
            color: '#94a3b8', fontWeight: 500, mb: 0.3, ml: 1, fontSize: '0.7rem',
          }}>
            {message.senderName || 'User'}
          </Typography>
        )}

        <Box
          sx={{
            position: 'relative',
            bgcolor: isMine ? primaryColor : '#fff',
            color: isMine ? '#fff' : '#0f172a',
            px: 2,
            py: 1.3,
            borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            border: isMine ? 'none' : '1px solid #e2e8f0',
            boxShadow: isMine
              ? `0 2px 8px ${primaryColor}30`
              : '0 1px 2px rgba(0,0,0,0.04)',
            wordBreak: 'break-word',
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: isMine
                ? `0 4px 14px ${primaryColor}40`
                : '0 2px 8px rgba(0,0,0,0.06)',
            },
          }}
        >
          <Typography sx={{
            fontSize: '0.9rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>
            {message.content || message.text}
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 0.5,
          mt: 0.3, px: 1,
        }}>
          <Typography variant="caption" sx={{
            color: '#94a3b8', fontSize: '0.65rem', fontWeight: 400,
          }}>
            {formatTime(message.sentAt || message.timestamp)}
          </Typography>

          {isMine && (
            <>
              {isPending ? (
                <CircularProgress size={10} thickness={5} sx={{ color: '#94a3b8' }} />
              ) : message.isRead ? (
                <DoneAll sx={{ fontSize: 13, color: primaryColor }} />
              ) : (
                <Done sx={{ fontSize: 13, color: '#94a3b8' }} />
              )}
            </>
          )}
        </Box>
      </Box>

      <IconButton
        size="small"
        onClick={handleMenuOpen}
        className="msg-actions"
        sx={{
          position: 'absolute',
          top: -6,
          right: isMine ? 40 : 'auto',
          left: isMine ? 'auto' : 40,
          bgcolor: '#fff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 28, height: 28,
          '&:hover': { bgcolor: '#f8fafc' },
        }}
      >
        <MoreVert sx={{ fontSize: 14, color: '#64748b' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 150,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.85rem', py: 1, gap: 1 }}>
          <ContentCopy sx={{ fontSize: 16, color: '#64748b' }} /> Copy
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.85rem', py: 1, gap: 1 }}>
          <Reply sx={{ fontSize: 16, color: '#64748b' }} /> Reply
        </MenuItem>
        {isMine && (
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: '0.85rem', py: 1, gap: 1, color: '#ef4444' }}>
            <DeleteOutline sx={{ fontSize: 16 }} /> Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MessageBubble;
