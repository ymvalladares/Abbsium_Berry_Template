import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Avatar, Typography, IconButton, TextField,
  CircularProgress, Badge, InputAdornment, Paper, Fade,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack, SendRounded, AttachFileOutlined, Close,
  MicOutlined, EmojiEmotionsOutlined, Forum,
  CallOutlined, VideocamOutlined, InfoOutlined,
  SearchOutlined, KeyboardArrowDown,
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';

const primaryColor = '#0EA5E9';
const primaryHover = '#0284C7';
const primaryLight = '#E0F2FE';

const formatDateLabel = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (msgDate.getTime() === today.getTime()) return 'Today';
  if (msgDate.getTime() === yesterday.getTime()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
};

const shouldShowDateSeparator = (current, previous) => {
  if (!previous) return true;
  const d1 = new Date(current.sentAt || current.timestamp);
  const d2 = new Date(previous.sentAt || previous.timestamp);
  return d1.toDateString() !== d2.toDateString();
};

const ChatWindow = ({
  isAdmin, selectedChat, messages, isConnected,
  isLoading, onSendMessage, onBack, isMobile,
  standalone, outerOnly,
}) => {
  const [message, setMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isMobile && selectedChat) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedChat, isMobile]);

  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBtn(!isNearBottom);
  }, []);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !isConnected || !selectedChat) return;
    try {
      await onSendMessage(message);
      setMessage('');
      setReplyTo(null);
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

  const handleReplyMessage = (msg) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  const getRadius = () => {
    if (standalone) return 3;
    if (outerOnly) return '0 12px 12px 0';
    return 3;
  };

  const searchedIndices = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase();
    return messages.reduce((acc, msg, idx) => {
      const text = (msg.content || msg.text || '').toLowerCase();
      if (text.includes(q)) acc.push(idx);
      return acc;
    }, []);
  }, [messages, searchTerm]);

  useEffect(() => {
    if (searchedIndices.length > 0 && searchIndex >= searchedIndices.length) {
      setSearchIndex(0);
    }
  }, [searchedIndices, searchIndex]);

  const scrollToSearchResult = (index) => {
    const msgElements = messagesContainerRef.current?.querySelectorAll('[data-msg-id]');
    const targetIdx = searchedIndices[index];
    if (msgElements && targetIdx !== undefined && msgElements[targetIdx]) {
      msgElements[targetIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  useEffect(() => {
    if (searchedIndices.length > 0) {
      scrollToSearchResult(searchIndex);
    }
  }, [searchIndex, searchedIndices]);

  const clearReply = () => setReplyTo(null);

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', borderRadius: getRadius(),
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
      }}>
        <CircularProgress size={28} thickness={4} sx={{ color: primaryColor }} />
      </Paper>
    );
  }

  if (!selectedChat) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', borderRadius: getRadius(),
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        px: 4,
      }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          bgcolor: primaryLight, display: 'flex',
          alignItems: 'center', justifyContent: 'center', mb: 3,
          boxShadow: `0 4px 12px ${primaryColor}20`,
        }}>
          <Forum sx={{ color: primaryColor, fontSize: 32 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 1 }}>
          {isAdmin ? 'Select a conversation' : 'Start a conversation'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center', maxWidth: 280 }}>
          {isAdmin ? 'Choose a conversation from the sidebar to view messages' : 'Select an admin to get started with support'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', borderRadius: getRadius(),
      overflow: 'hidden',
      border: '1px solid #e2e8f0',
      borderLeft: outerOnly ? 'none' : '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
    }}>
      <Box sx={{
        px: { xs: 2, sm: 2.5 }, py: 1.2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0',
        bgcolor: '#fff', minHeight: 60,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
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
                border: '2.5px solid #fff',
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

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', lineHeight: 1.3 }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
          {showSearch ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              bgcolor: '#f8fafc', borderRadius: '8px', px: 1, py: 0.3,
              border: '1.5px solid #e2e8f0',
            }}>
              <SearchOutlined sx={{ fontSize: 16, color: '#94a3b8' }} />
              <input
                autoFocus
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setSearchIndex(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (e.shiftKey) {
                      setSearchIndex((prev) => (prev > 0 ? prev - 1 : searchedIndices.length - 1));
                    } else {
                      setSearchIndex((prev) => (prev < searchedIndices.length - 1 ? prev + 1 : 0));
                    }
                  }
                }}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '0.8rem', width: 140, color: '#0f172a',
                }}
              />
              {searchTerm && (
                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                  {searchedIndices.length > 0 ? `${searchIndex + 1}/${searchedIndices.length}` : '0/0'}
                </Typography>
              )}
              <IconButton size="small" onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                sx={{ color: '#94a3b8', p: 0.3 }}>
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Tooltip title="Search in conversation">
                <IconButton size="small" onClick={() => setShowSearch(true)}
                  sx={{ color: '#64748b', '&:hover': { bgcolor: primaryLight } }}>
                  <SearchOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Audio call">
                <IconButton size="small"
                  sx={{ color: '#64748b', '&:hover': { bgcolor: primaryLight } }}>
                  <CallOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video call">
                <IconButton size="small"
                  sx={{ color: '#64748b', '&:hover': { bgcolor: primaryLight } }}>
                  <VideocamOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Conversation info">
                <IconButton size="small"
                  sx={{ color: '#64748b', '&:hover': { bgcolor: primaryLight } }}>
                  <InfoOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 2,
          bgcolor: '#fafbfc',
          position: 'relative',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '3px' },
        }}
      >
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
            {messages.map((msg, idx) => (
              <Box key={msg.id || msg.tempId || idx} data-msg-id={idx}>
                {shouldShowDateSeparator(msg, messages[idx - 1]) && (
                  <Box sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    my: 2.5, position: 'relative',
                  }}>
                    <Typography variant="caption" sx={{
                      bgcolor: '#fafbfc', px: 2, py: 0.5,
                      borderRadius: '12px',
                      color: '#94a3b8', fontWeight: 600, fontSize: '0.7rem',
                      border: '1px solid #e2e8f0',
                      zIndex: 1,
                    }}>
                      {formatDateLabel(msg.sentAt || msg.timestamp)}
                    </Typography>
                  </Box>
                )}
                <MessageBubble
                  message={msg}
                  isAdmin={isAdmin}
                  onReply={handleReplyMessage}
                  isHighlighted={searchedIndices.includes(idx) && searchedIndices[searchIndex] === idx}
                />
              </Box>
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Fade in={showScrollBtn}>
        <IconButton
          onClick={scrollToBottom}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 120,
            right: { xs: 24, sm: 40 },
            bgcolor: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            width: 36, height: 36,
            '&:hover': { bgcolor: '#f8fafc' },
            zIndex: 10,
          }}
        >
          <KeyboardArrowDown sx={{ fontSize: 18, color: '#64748b' }} />
        </IconButton>
      </Fade>

      <Box sx={{
        px: { xs: 2.5, sm: 3 }, py: 1.5,
        borderTop: '1px solid #e2e8f0',
        bgcolor: '#fff',
        position: 'relative',
      }}>
        {replyTo && (
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 1,
            mb: 1, px: 1.5, py: 1,
            bgcolor: primaryLight, borderRadius: '8px',
            borderLeft: `3px solid ${primaryColor}`,
          }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 600, fontSize: '0.7rem' }}>
                Replying to {replyTo.senderName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{
                color: '#475569', fontSize: '0.8rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {(replyTo.content || replyTo.text || '').substring(0, 80)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearReply}
              sx={{ color: '#94a3b8', p: 0.3, mt: 0.2 }}>
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { bgcolor: primaryLight } }}>
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
                fontSize: { xs: '16px', sm: '0.9rem' },
                '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': {
                  borderColor: primaryColor,
                  borderWidth: '2px',
                  boxShadow: `0 0 0 3px ${primaryLight}`,
                },
                py: 0.5,
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
                width: 36, height: 36,
                '&:hover': { bgcolor: primaryHover },
                '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' },
                transition: 'all 0.15s ease',
              }}
            >
              <SendRounded sx={{ fontSize: 18 }} />
            </IconButton>
          ) : (
            <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { bgcolor: primaryLight } }}>
              <MicOutlined sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        <Typography variant="caption" sx={{
          display: 'block', textAlign: 'center',
          color: '#94a3b8', fontSize: '0.65rem', mt: 0.8,
        }}>
          End-to-end encrypted · Abbsium Chat
        </Typography>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
