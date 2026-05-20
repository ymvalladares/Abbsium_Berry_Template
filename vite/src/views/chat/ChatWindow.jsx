import { useState, useRef, useEffect } from 'react';
import {
  Box, Avatar, Typography, IconButton, TextField,
  CircularProgress, Badge, InputAdornment,
} from '@mui/material';
import {
  ArrowBack, SendRounded, AttachFileOutlined,
  MicOutlined,   EmojiEmotionsOutlined,
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';

const primaryColor = '#0EA5E9';
const primaryHover = '#0284C7';
const primaryLight = '#F0F9FF';

const ChatWindow = ({
  isAdmin, selectedChat, messages, isConnected,
  isLoading, onSendMessage, onBack, isMobile,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isMobile && selectedChat) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedChat, isMobile]);

  const handleSend = async () => {
    if (!message.trim() || !isConnected || !selectedChat) return;
    try {
      await onSendMessage(message);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', bgcolor: '#fff', borderRadius: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
      }}>
        <CircularProgress size={28} thickness={4} sx={{ color: primaryColor }} />
      </Box>
    );
  }

  if (!selectedChat) {
    return (
      <Box sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', bgcolor: '#fff', borderRadius: 3,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        px: 4,
      }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          bgcolor: primaryLight, display: 'flex',
          alignItems: 'center', justifyContent: 'center', mb: 3,
        }}>
          <Typography sx={{ fontSize: '2rem' }}>💬</Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '1.05rem', mb: 1 }}>
          {isAdmin ? 'Select a conversation' : 'Start a conversation'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', maxWidth: 280 }}>
          {isAdmin ? 'Choose a conversation from the sidebar to view messages' : 'Select an admin to get started with support'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', bgcolor: '#fff', borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
    }}>
      <Box sx={{
        px: { xs: 2, sm: 3 }, py: 1.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #f1f5f9',
        bgcolor: '#fff', minHeight: 60,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isMobile && (
            <IconButton onClick={onBack}
              sx={{ color: '#64748b', '&:hover': { bgcolor: primaryLight } }}>
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: selectedChat.isOnline ? '#10b981' : '#cbd5e1',
                width: 11, height: 11, borderRadius: '50%',
                border: '2px solid #fff',
              },
            }}
          >
            <Avatar
              src={selectedChat.avatar}
              sx={{
                width: 40, height: 40,
                bgcolor: primaryColor,
                fontWeight: 600, fontSize: '1rem',
              }}
            >
              {(selectedChat.userName || 'U')[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Box>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem', lineHeight: 1.3 }}>
              {selectedChat.userName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{
              color: selectedChat.isOnline ? '#10b981' : '#94a3b8',
              fontSize: '0.7rem', fontWeight: 500,
            }}>
              {selectedChat.isOnline ? 'Active now' : 'Offline'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{
        flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 2,
        bgcolor: '#fafbfc',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '3px' },
      }}>
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 8,
          }}>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>
              No messages yet — send one below!
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id || msg.tempId} message={msg} isAdmin={isAdmin} />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{
        px: { xs: 2, sm: 3 }, py: 1.5,
        borderTop: '1px solid #f1f5f9',
        bgcolor: '#fff',
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <IconButton size="small" sx={{ color: '#94a3b8', mb: 0.5, '&:hover': { bgcolor: primaryLight } }}>
            <AttachFileOutlined sx={{ fontSize: 18 }} />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!isConnected}
            inputRef={inputRef}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
                borderRadius: '12px',
                fontSize: '0.9rem',
                '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                  borderWidth: '2px',
                  boxShadow: `0 0 0 3px ${primaryColor}20`,
                },
                py: 0.3,
                px: 1.5,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { bgcolor: primaryLight } }}>
                    <EmojiEmotionsOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {message.trim() ? (
            <IconButton
              onClick={handleSend}
              disabled={!isConnected}
              sx={{
                bgcolor: primaryColor,
                color: '#fff',
                width: 38, height: 38,
                mb: 0.5,
                '&:hover': { bgcolor: primaryHover },
                '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                transition: 'all 0.15s ease',
              }}
            >
              <SendRounded sx={{ fontSize: 18 }} />
            </IconButton>
          ) : (
            <IconButton size="small" sx={{ color: '#94a3b8', mb: 0.5, '&:hover': { bgcolor: primaryLight } }}>
              <MicOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        <Typography variant="caption" sx={{
          display: 'block', textAlign: 'center',
          color: '#94a3b8', fontSize: '0.65rem', mt: 0.8,
        }}>
          Press <b>Enter</b> to send · <b>Shift + Enter</b> for new line
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatWindow;
