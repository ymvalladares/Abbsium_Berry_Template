import { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Fade, Tooltip, Popover } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  MoreVert, Done, DoneAll, ContentCopy, Reply,
  DeleteOutline, EmojiEmotions,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { showSnackbar } from '../../utils/snackbarNotif';

const primaryColor = '#8B5CF6';
const primaryHover = '#7C3AED';
const primaryLight = '#F3E8FF';
const greyBorder = '#e2e8f0';
const greyText = '#64748b';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const MessageBubble = ({ message, isAdmin, onReply, isHighlighted, onDelete, onToggleReaction }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const primLight = isDark ? '#2D1B69' : primaryLight;
  const textClr = isDark ? '#F1F5F9' : '#0f172a';
  const bgClr = isDark ? '#1E293B' : '#fff';
  const borderClr = isDark ? '#374151' : greyBorder;
  const iconClr = isDark ? '#9CA3AF' : '#475569';
  const [anchorEl, setAnchorEl] = useState(null);
  const [reactionAnchor, setReactionAnchor] = useState(null);
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

  const handleReactionClick = (event) => {
    event.stopPropagation();
    setReactionAnchor(event.currentTarget);
  };

  const handleReactionClose = () => {
    setReactionAnchor(null);
  };

  const handleReaction = (emoji) => {
    const messageId = message.id || message.messageId || message.tempId;
    if (onToggleReaction && messageId) {
      onToggleReaction(messageId, emoji);
    }
    handleReactionClose();
  };

  const getReadStatusIcon = () => {
    if (isPending) {
      return <CircularProgress size={8} thickness={5} sx={{ color: greyText }} />;
    }
    
    if (message.isRead) {
      return (
        <Tooltip title={`Read at ${formatTime(message.readAt || message.sentAt)}`} arrow>
          <DoneAll sx={{ fontSize: 11, color: '#10b981' }} />
        </Tooltip>
      );
    }
    
    return (
      <Tooltip title="Delivered" arrow>
        <Done sx={{ fontSize: 11, color: greyText }} />
      </Tooltip>
    );
  };

  const reactions = message.reactions || {};
  const hasReactions = Object.keys(reactions).length > 0;

  return (
    <Box
      data-message-element="true"
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
        '&:hover .reaction-btn': { opacity: 1, transform: 'scale(1)' },
      }}
    >
      <Avatar
        src={message.avatar}
        alt={message.senderName}
        sx={{
          width: 24,
          height: 24,
          bgcolor: primaryColor,
          color: '#fff',
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
            color: iconClr,
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
            background: isMine ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryHover} 100%)` : bgClr,
            color: isMine ? '#fff' : textClr,
            px: 1.5,
            py: 0.8,
            borderRadius: isMine
              ? '14px 14px 4px 14px'
              : '14px 14px 14px 4px',
            border: isMine ? 'none' : `1px solid ${borderClr}`,
            boxShadow: isMine
              ? `0 4px 12px ${primaryColor}40, 0 2px 6px ${primaryColor}20`
              : '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
            wordBreak: 'break-word',
            transition: 'box-shadow 0.2s ease, transform 0.15s ease',
            ...(isHighlighted && {
              boxShadow: `0 0 0 3px ${primaryColor}50, 0 2px 12px ${primaryColor}25`,
              transform: 'scale(1.015)',
            }),
            '&:hover': {
              boxShadow: isMine
                ? `0 6px 16px ${primaryColor}50, 0 3px 8px ${primaryColor}25`
                : '0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
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

        {hasReactions && (
          <Box sx={{
            display: 'flex',
            gap: 0.5,
            mt: 0.3,
            px: 0.5,
            flexWrap: 'wrap',
            flexDirection: isMine ? 'row-reverse' : 'row',
          }}>
            {Object.entries(reactions).map(([emoji, users]) => (
              <Box
                key={emoji}
                onClick={() => handleReaction(emoji)}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.3,
                  px: 0.8,
                  py: 0.2,
                  borderRadius: '12px',
                  bgcolor: users.some((u) => u.userId === 'me') ? primLight : (isDark ? '#1e293b' : '#f8fafc'),
                  border: `1px solid ${users.some((u) => u.userId === 'me') ? primaryColor + '40' : borderClr}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    bgcolor: primLight,
                    borderColor: primaryColor + '60',
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.75rem' }}>{emoji}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 500 }}>
                  {users.length}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

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
              color: iconClr,
              fontSize: '0.6rem',
              fontWeight: 500,
            }}>
              {formatTime(message.sentAt || message.timestamp)}
            </Typography>

            {isMine && getReadStatusIcon()}
          </Box>
        </Tooltip>
      </Box>

      <IconButton
        size="small"
        onClick={handleReactionClick}
        className="reaction-btn"
        sx={{
          position: 'absolute',
          top: -2,
          right: isMine ? 30 : 'auto',
          left: isMine ? 'auto' : 30,
          bgcolor: bgClr,
          border: `1px solid ${borderClr}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 22,
          height: 22,
          zIndex: 2,
          '&:hover': { bgcolor: primLight, color: primaryColor },
        }}
      >
        <EmojiEmotions sx={{ fontSize: 12 }} />
      </IconButton>

      <IconButton
        size="small"
        onClick={handleMenuOpen}
        className="msg-actions"
        sx={{
          position: 'absolute',
          top: -2,
          right: isMine ? 'auto' : 30,
          left: isMine ? 30 : 'auto',
          bgcolor: bgClr,
          border: `1px solid ${borderClr}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          width: 22,
          height: 22,
          zIndex: 2,
          '&:hover': { bgcolor: isDark ? '#1e293b' : '#f8fafc' },
        }}
      >
        <MoreVert sx={{ fontSize: 12, color: iconClr }} />
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
            border: `1px solid ${borderClr}`,
            boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.08)',
            bgcolor: isDark ? '#1e293b' : '#fff',
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
          <ContentCopy sx={{ fontSize: 15, color: iconClr }} /> Copy
        </MenuItem>
        <MenuItem onClick={handleReply}>
          <Reply sx={{ fontSize: 15, color: iconClr }} /> Reply
        </MenuItem>
        {isMine && (
          <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
            <DeleteOutline sx={{ fontSize: 15 }} /> Delete
          </MenuItem>
        )}
      </Menu>

      <Popover
        open={Boolean(reactionAnchor)}
        anchorEl={reactionAnchor}
        onClose={handleReactionClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 0.5,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.12)',
            border: `1px solid ${borderClr}`,
            bgcolor: isDark ? '#1e293b' : '#fff',
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.3 }}>
          {QUICK_REACTIONS.map((emoji) => (
            <IconButton
              key={emoji}
              onClick={() => handleReaction(emoji)}
              sx={{
                width: 32,
                height: 32,
                fontSize: '1.1rem',
                '&:hover': { bgcolor: primLight, transform: 'scale(1.2)' },
                transition: 'transform 0.15s ease',
              }}
            >
              {emoji}
            </IconButton>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};

export default MessageBubble;
