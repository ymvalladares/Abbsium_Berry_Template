import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Fade, Tooltip } from '@mui/material';
import {
  MoreVert, Done, DoneAll, ContentCopy, Reply,
  DeleteOutline,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { showSnackbar } from '../../utils/snackbarNotif';

const primaryColor = '#0EA5E9';
const primaryLight = '#E0F2FE';
const greyBorder = '#e2e8f0';
const greyText = '#94a3b8';

const MessageBubble = ({ message, isAdmin, onReply, isHighlighted, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMine = message.isSender === true;
  const isPending = message.isPending === true;

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit', second: '2-digit',
    });
  };

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = async () => {
    handleMenuClose();
    try {
      await navigator.clipboard.writeText(message.content || message.text || '');
      showSnackbar('Copied to clipboard', 'success');
    } catch {
      showSnackbar('Failed to copy', 'error');
    }
  };

  const handleReply = () => {
    handleMenuClose();
    if (onReply) onReply(message);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(message);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMine ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        mb: 0.7,
        px: 0.5,
        gap: 0.5,
        position: 'relative',
        opacity: isPending ? 0.55 : 1,
        transition: 'opacity 0.3s ease',
        '&:hover .msg-actions': { opacity: 1, transform: 'scale(1)' },
      }}
    >
      <Avatar
        src={message.avatar}
        alt={message.senderName}
        sx={{
          width: 24,
          height: 24,
          bgcolor: primaryColor,
          fontSize: '0.65rem',
          fontWeight: 600,
          flexShrink: 0,
          mb: 0.1,
          boxShadow: `0 2px 6px ${primaryColor}25`,
          ...(isMine && { opacity: 0 }),
        }}
      >
        {(message.senderName || 'U')[0]?.toUpperCase()}
      </Avatar>

      <Box sx={{
        maxWidth: { xs: '85%', sm: '68%', md: '58%' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: isMine ? 'flex-end' : 'flex-start',
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 0.1,
          px: 0.5,
          flexDirection: isMine ? 'row-reverse' : 'row',
        }}>
          <Typography variant="caption" sx={{
            color: greyText,
            fontWeight: 600,
            fontSize: '0.6rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}>
            {message.senderName || 'User'}
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'relative',
            bgcolor: isMine ? primaryColor : '#fff',
            color: isMine ? '#fff' : '#0f172a',
            px: 1.5,
            py: 0.8,
            borderRadius: isMine
              ? '14px 14px 4px 14px'
              : '14px 14px 14px 4px',
            border: isMine ? 'none' : `1px solid ${greyBorder}`,
            boxShadow: isMine
              ? `0 2px 8px ${primaryColor}30, 0 4px 16px ${primaryColor}15`
              : '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
            wordBreak: 'break-word',
            transition: 'box-shadow 0.2s ease, transform 0.15s ease',
            ...(isHighlighted && {
              boxShadow: `0 0 0 3px ${primaryColor}50, 0 2px 12px ${primaryColor}25`,
              transform: 'scale(1.015)',
            }),
            '&:hover': {
              boxShadow: isMine
                ? `0 4px 14px ${primaryColor}40, 0 6px 20px ${primaryColor}20`
                : '0 2px 6px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)',
            },
          }}
        >
          <Typography sx={{
            fontSize: '0.85rem',
            lineHeight: 1.45,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            fontWeight: 400,
          }}>
            {message.content || message.text}
          </Typography>
        </Box>

        <Tooltip title={formatFullDate(message.sentAt || message.timestamp)} arrow placement="right" enterDelay={600}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.4,
            mt: 0.2,
            px: 0.5,
            cursor: 'default',
          }}>
            <Typography variant="caption" sx={{
              color: greyText,
              fontSize: '0.6rem',
              fontWeight: 500,
            }}>
              {formatTime(message.sentAt || message.timestamp)}
            </Typography>

            {isMine && (
              <>
                {isPending ? (
                  <CircularProgress size={8} thickness={5} sx={{ color: greyText }} />
                ) : message.isRead ? (
                  <DoneAll sx={{ fontSize: 11, color: '#10b981' }} />
                ) : (
                  <Done sx={{ fontSize: 11, color: greyText }} />
                )}
              </>
            )}
          </Box>
        </Tooltip>
      </Box>

      <IconButton
        size="small"
        onClick={handleMenuOpen}
        className="msg-actions"
        sx={{
          position: 'absolute',
          top: -2,
          right: isMine ? 30 : 'auto',
          left: isMine ? 'auto' : 30,
          bgcolor: '#fff',
          border: `1px solid ${greyBorder}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 22,
          height: 22,
          zIndex: 2,
          '&:hover': { bgcolor: '#f8fafc' },
        }}
      >
        <MoreVert sx={{ fontSize: 12, color: '#64748b' }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        TransitionComponent={Fade}
        transitionDuration={200}
        PaperProps={{
          sx: {
            borderRadius: 2.5,
            minWidth: 150,
            border: `1px solid ${greyBorder}`,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            '& .MuiMenuItem-root': {
              fontSize: '0.82rem',
              py: 1,
              gap: 1.2,
              transition: 'all 0.15s ease',
            },
          },
        }}
      >
        <MenuItem onClick={handleCopy}>
          <ContentCopy sx={{ fontSize: 15, color: '#64748b' }} /> Copy
        </MenuItem>
        <MenuItem onClick={handleReply}>
          <Reply sx={{ fontSize: 15, color: '#64748b' }} /> Reply
        </MenuItem>
        {isMine && (
          <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
            <DeleteOutline sx={{ fontSize: 15 }} /> Delete
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default MessageBubble;
