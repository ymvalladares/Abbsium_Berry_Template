import React, { useState, useRef, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton, TextField, CircularProgress, Badge, Tooltip, Zoom } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalPhoneOutlined as PhoneIcon,
  VideocamOutlined as VideocamIcon,
  MoreHoriz as MoreVertIcon,
  SendRounded as SendIcon,
  AutoAwesomeOutlined as ForumIcon
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ isAdmin, selectedChat, messages, isConnected, isLoading, onSendMessage, onBack, isMobile }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !isConnected) return;
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

  // --- LOADING STATE: Sophisticated Progress ---
  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
          bgcolor: '#FFFFFF',
          borderRadius: '24px'
        }}
      >
        <CircularProgress size={28} thickness={5} sx={{ color: '#18181B' }} />
      </Box>
    );
  }

  // --- EMPTY STATE: Minimalist Graphic ---
  if (!selectedChat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
          bgcolor: '#FFFFFF',
          borderRadius: '24px',
          textAlign: 'center',
          px: 4
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '24px',
            bgcolor: '#F4F4F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <ForumIcon sx={{ color: '#A1A1AA', fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#18181B', letterSpacing: '-0.02em' }}>
          {isAdmin ? 'Ready to sync?' : 'Chat with Support'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#71717A', mt: 1, maxWidth: '280px', lineHeight: 1.6 }}>
          {isAdmin
            ? 'Select a conversation from the sidebar to start managing threads.'
            : 'Select an admin to resolve your inquiries instantly.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '75vh',
        bgcolor: '#FFFFFF',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid #E4E4E7',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.02), 0 10px 10px -5px rgba(0,0,0,0.01)'
      }}
    >
      {/* HEADER: High-Fidelity Glassmorphism */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #F4F4F5',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton onClick={onBack} sx={{ color: '#18181B', bgcolor: '#F4F4F5', mr: 1 }}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
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
                width: 44,
                height: 44,
                bgcolor: '#18181B',
                color: '#FFF',
                fontWeight: 700,
                fontSize: '0.9rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}
            >
              {selectedChat.userName?.[0] || 'U'}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#18181B', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              {selectedChat.userName || 'Member'}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: '#71717A', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}
            >
              {isConnected ? 'Active session' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton sx={{ color: '#71717A', '&:hover': { color: '#18181B', bgcolor: '#F4F4F5' } }}>
            <PhoneIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ color: '#71717A', '&:hover': { color: '#18181B', bgcolor: '#F4F4F5' } }}>
            <VideocamIcon fontSize="small" />
          </IconButton>
          <IconButton sx={{ color: '#71717A', '&:hover': { color: '#18181B', bgcolor: '#F4F4F5' } }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* MESSAGES AREA: Focused & Spaced */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          bgcolor: '#FFFFFF',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { background: '#F4F4F5', borderRadius: '10px' }
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography
              variant="caption"
              sx={{ color: '#A1A1AA', bgcolor: '#F4F4F5', px: 2, py: 0.5, borderRadius: '8px', fontWeight: 600 }}
            >
              Encrypted end-to-end
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA: The "Architectural Dock" */}
      <Box sx={{ p: 3, borderTop: '1px solid #F4F4F5' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            alignItems: 'center',
            bgcolor: '#FFFFFF',
            border: '1.5px solid #E4E4E7',
            borderRadius: '16px',
            pl: 2,
            pr: 1,
            py: 0.5,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:focus-within': {
              borderColor: '#18181B',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
            }
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.9rem',
                fontWeight: 500,
                color: '#18181B',
                '& fieldset': { border: 'none' }
              }
            }}
          />
          <Zoom in={message.trim().length > 0}>
            <IconButton
              onClick={handleSend}
              disabled={!isConnected || !message.trim()}
              sx={{
                bgcolor: '#18181B',
                color: '#FFF',
                width: 40,
                height: 40,
                '&:hover': { bgcolor: '#3F3F46', transform: 'scale(1.05)' },
                '&.Mui-disabled': { bgcolor: '#F4F4F5', color: '#D4D4D8' },
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Zoom>
        </Box>
        <Typography
          variant="caption"
          sx={{ display: 'block', textAlign: 'center', mt: 1.5, color: '#A1A1AA', fontSize: '0.65rem', fontWeight: 500 }}
        >
          Press <b>Enter</b> to send message
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatWindow;
