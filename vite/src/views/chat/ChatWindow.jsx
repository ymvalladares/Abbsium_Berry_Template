import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Badge,
  Tooltip,
  Zoom,
  Divider,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CallOutlined as PhoneIcon,
  VideocamOutlined as VideocamIcon,
  InfoOutlined as InfoIcon,
  SendRounded as SendIcon,
  EmojiEmotionsOutlined as EmojiIcon,
  AttachFileOutlined as AttachIcon,
  MicOutlined as MicIcon,
  KeyboardVoiceOutlined as VoiceIcon
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import { useAuth } from '../../contexts/AuthContext';

const ChatWindow = ({ isAdmin, selectedChat, messages, isConnected, isLoading, onSendMessage, onBack, isMobile }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

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

  // Estado de carga
  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
          bgcolor: '#fff',
          borderRadius: 3
        }}
      >
        <CircularProgress size={32} thickness={4} sx={{ color: '#1967D2' }} />
      </Box>
    );
  }

  // Estado vacío
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
          bgcolor: '#fff',
          borderRadius: 3,
          px: 4
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: '#e8f0fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3
          }}
        >
          <Typography sx={{ fontSize: '2.5rem' }}>💬</Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            color: '#202124',
            mb: 1
          }}
        >
          {isAdmin ? 'Select a conversation' : 'Start a conversation'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#5f6368',
            textAlign: 'center',
            maxWidth: 300
          }}
        >
          {isAdmin ? 'Choose a conversation from the sidebar to view messages' : 'Select an admin to get started with support'}
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
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e8eaed',
          bgcolor: '#fff',
          minHeight: 64
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              onClick={onBack}
              sx={{
                color: '#5f6368',
                '&:hover': { bgcolor: '#f1f3f4' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: selectedChat.isOnline ? '#188038' : '#dadce0',
                width: 12,
                height: 12,
                borderRadius: '50%',
                border: '2px solid #fff'
              }
            }}
          >
            <Avatar
              src={selectedChat.avatar}
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#1967D2',
                fontWeight: 500,
                fontSize: '1rem'
              }}
            >
              {(selectedChat.userName || 'U')[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: '#202124',
                lineHeight: 1.3
              }}
            >
              {selectedChat.userName || 'User'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: selectedChat.isOnline ? '#188038' : '#5f6368',
                fontSize: '0.75rem',
                fontWeight: 500
              }}
            >
              {selectedChat.isOnline ? 'Active now' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Voice call" arrow>
            <IconButton
              sx={{
                color: '#5f6368',
                '&:hover': { bgcolor: '#f1f3f4' }
              }}
            >
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Video call" arrow>
            <IconButton
              sx={{
                color: '#5f6368',
                '&:hover': { bgcolor: '#f1f3f4' }
              }}
            >
              <VideocamIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Conversation details" arrow>
            <IconButton
              sx={{
                color: '#5f6368',
                '&:hover': { bgcolor: '#f1f3f4' }
              }}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* ========== MESSAGES AREA ========== */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          bgcolor: '#fff',
          py: 2,
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
        {/* Indicador de fecha */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 1 }}>
          <Chip
            label="Today"
            size="small"
            sx={{
              bgcolor: '#e8f0fe',
              color: '#1967D2',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-label': {
                px: 1.5
              }
            }}
          />
        </Box>

        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 3
            }}
          >
            <Typography
              sx={{
                color: '#5f6368',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}
            >
              🔒 Messages are end-to-end encrypted
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isAdmin={isAdmin} />
            ))}
          </>
        )}

        {/* Indicador de "escribiendo..." */}
        {isTyping && (
          <Box sx={{ px: 2, py: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Avatar sx={{ width: 24, height: 24 }}>{(selectedChat.userName || 'U')[0]}</Avatar>
              <Box
                sx={{
                  bgcolor: '#f1f3f4',
                  borderRadius: '18px',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  gap: 0.5
                }}
              >
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#5f6368',
                      animation: 'typing 1.4s infinite',
                      animationDelay: `${i * 0.2}s`,
                      '@keyframes typing': {
                        '0%, 60%, 100%': {
                          transform: 'translateY(0)'
                        },
                        '30%': {
                          transform: 'translateY(-8px)'
                        }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* ========== INPUT AREA ========== */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #e8eaed',
          bgcolor: '#fff'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'flex-end'
          }}
        >
          {/* Botón de adjuntar */}
          <Tooltip title="Attach files" arrow>
            <IconButton
              size="small"
              sx={{
                color: '#5f6368',
                mb: 0.5,
                '&:hover': { bgcolor: '#f1f3f4' }
              }}
            >
              <AttachIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Campo de texto */}
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f1f3f4',
                borderRadius: '24px',
                fontSize: '0.9375rem',
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
                },
                py: 0.5,
                px: 2
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    sx={{
                      color: '#5f6368',
                      '&:hover': { bgcolor: 'rgba(95,99,104,0.1)' }
                    }}
                  >
                    <EmojiIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Botón de enviar o voz */}
          {message.trim() ? (
            <Zoom in={true}>
              <IconButton
                onClick={handleSend}
                disabled={!isConnected}
                sx={{
                  bgcolor: '#1967D2',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  mb: 0.5,
                  '&:hover': {
                    bgcolor: '#1557b0'
                  },
                  '&:disabled': {
                    bgcolor: '#e8eaed',
                    color: '#bdc1c6'
                  }
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Zoom>
          ) : (
            <Tooltip title="Voice message" arrow>
              <IconButton
                size="small"
                sx={{
                  color: '#5f6368',
                  mb: 0.5,
                  '&:hover': { bgcolor: '#f1f3f4' }
                }}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Hint de teclas */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: '#5f6368',
            fontSize: '0.6875rem',
            mt: 1
          }}
        >
          Press <b>Enter</b> to send • <b>Shift + Enter</b> for new line
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatWindow;
