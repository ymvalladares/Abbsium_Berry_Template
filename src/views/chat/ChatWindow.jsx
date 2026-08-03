import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Avatar, Typography, IconButton, TextField,
  CircularProgress, Badge, Paper, Fade,
  Tooltip, Skeleton,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  ArrowBack, SendRounded, AttachFileOutlined, Close,
  MicOutlined, EmojiEmotionsOutlined, AddPhotoAlternateOutlined, Forum,
  CallOutlined, VideocamOutlined, InfoOutlined,
  SearchOutlined, KeyboardArrowDown,
  Done, DoneAll,
} from '@mui/icons-material';
import MessageBubble from './MessageBubble';
import EmojiPicker from './EmojiPicker';
import { useChat } from '../../contexts/ChatContext';
import { useNotification } from 'contexts/NotificationContext';

const primaryColor = '#8B5CF6';
const primaryHover = '#7C3AED';
const primaryLight = '#F3E8FF';
const primaryLightDark = '#2D1B69';
const iconColor = '#475569';
const iconColorDark = '#9CA3AF';
const darkBg = '#1e293b';
const darkBg2 = '#111827';
const darkBorder = '#374151';

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

const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
};

const ChatWindow = ({ isMobile }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();

  const iconClr = isDark ? iconColorDark : iconColor;
  const primLight = isDark ? primaryLightDark : primaryLight;

  const {
    isAdmin, selectedChat, messages, isConnected,
    isLoading, sendMessage, deleteMessage, goBackToList,
    isOtherTyping, sendTypingIndicator, toggleReaction,
    saveDraft, getDraft, clearDraft, updateUnreadBadge,
    markMessagesAsRead, selectedConversationId,
  } = useChat();

  const [message, setMessage] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);
  const [replyTo, setReplyTo] = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingDebounceRef = useRef(null);

  useEffect(() => {
    const draft = getDraft();
    setMessage(draft);
  }, [selectedChat]);

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

    if (isNearBottom) {
      updateUnreadBadge(0);
      const unreadMsgs = messages.filter((m) => !m.isSender && !m.isRead);
      if (unreadMsgs.length > 0) {
        markMessagesAsRead();
      }
    }
  }, [updateUnreadBadge, messages, markMessagesAsRead]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !isConnected || !selectedChat) {
      if (!isConnected) notify.error('Unable to send message. Connection lost.', 'Send Failed');
      return;
    }
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }
    sendTypingIndicator();
    await sendMessage(message);
    setMessage('');
    setReplyTo(null);
    clearDraft();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    saveDraft(value);

    if (value.trim()) {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
      sendTypingIndicator();
      typingDebounceRef.current = setTimeout(() => {
        sendTypingIndicator();
      }, 2000);
    } else {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }
      sendTypingIndicator();
    }
  };

  const handleReplyMessage = (msg) => {
    setReplyTo(msg);
    inputRef.current?.focus();
  };

  const handleDeleteMessage = (msg) => {
    deleteMessage(msg);
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

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || message.length;
      const end = input.selectionEnd || message.length;
      const newMsg = message.slice(0, start) + emoji + message.slice(end);
      setMessage(newMsg);
      saveDraft(newMsg);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      const newMsg = message + emoji;
      setMessage(newMsg);
      saveDraft(newMsg);
    }
  };

  const getReadReceiptInfo = useCallback(() => {
    if (!messages.length) return { allRead: false, lastReadTime: null, unreadCount: 0 };

    const sentMessages = messages.filter((m) => m.isSender);
    if (!sentMessages.length) return { allRead: false, lastReadTime: null, unreadCount: 0 };

    const readMessages = sentMessages.filter((m) => m.isRead);
    const unreadCount = sentMessages.length - readMessages.length;

    const lastReadMessage = readMessages.reduce((latest, msg) => {
      const msgTime = new Date(msg.sentAt || msg.timestamp).getTime();
      const latestTime = latest ? new Date(latest.sentAt || latest.timestamp).getTime() : 0;
      return msgTime > latestTime ? msg : latest;
    }, null);

    return {
      allRead: unreadCount === 0,
      lastReadTime: lastReadMessage ? formatTime(lastReadMessage.sentAt || lastReadMessage.timestamp) : null,
      unreadCount,
    };
  }, [messages]);

  const readReceiptInfo = getReadReceiptInfo();

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: '100%', borderRadius: isMobile ? 0 : '0 24px 24px 0',
        border: isMobile ? 'none' : '1px solid',
        borderColor: 'divider',
        boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        bgcolor: isDark ? darkBg2 : '#ffffff',
      }}>
        <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9' }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box>
            <Skeleton width={120} height={22} sx={{ mb: 0.5 }} />
            <Skeleton width={70} height={16} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} sx={{
              display: 'flex',
              flexDirection: i % 3 === 0 ? 'row' : 'row-reverse',
              alignItems: 'flex-end',
              gap: 0.75,
            }}>
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton
                variant="rounded"
                width={i % 2 === 0 ? '55%' : '40%'}
                height={40 + (i % 3) * 14}
                sx={{ borderRadius: i % 3 === 0 ? '18px 18px 18px 6px' : '18px 18px 6px 18px' }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ px: 3, py: 1.5, borderTop: '1px solid', borderColor: isDark ? '#1e293b' : '#f1f5f9', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Skeleton variant="rounded" width="100%" height={52} sx={{ borderRadius: '16px' }} />
          <Skeleton variant="rounded" width={44} height={44} sx={{ borderRadius: '12px' }} />
        </Box>
      </Paper>
    );
  }

  // ===== NO CHAT SELECTED =====
  if (!selectedChat) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', borderRadius: isMobile ? 0 : '0 24px 24px 0',
        border: isMobile ? 'none' : '1px solid',
        borderColor: 'divider',
        boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
        px: 4,
        bgcolor: isDark ? darkBg2 : '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <Box sx={{ position: 'absolute', top: '-20%', right: '-10%', width: 300, height: 300, borderRadius: '50%', bgcolor: isDark ? 'rgba(139,92,246,0.03)' : 'rgba(139,92,246,0.04)', filter: 'blur(60px)' }} />
        <Box sx={{ position: 'absolute', bottom: '-15%', left: '-5%', width: 250, height: 250, borderRadius: '50%', bgcolor: isDark ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.04)', filter: 'blur(50px)' }} />

        <Box sx={{
          width: 88, height: 88, borderRadius: '24px',
          background: isDark ? 'linear-gradient(135deg, #2D1B69 0%, #1e293b 100%)' : 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)',
          display: 'flex',
          alignItems: 'center', justifyContent: 'center', mb: 3,
          boxShadow: isDark ? '0 8px 32px rgba(139,92,246,0.15)' : '0 8px 32px rgba(139,92,246,0.12)',
          position: 'relative', zIndex: 1,
        }}>
          <Forum sx={{ color: primaryColor, fontSize: 40 }} />
        </Box>
        <Typography sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '1.3rem', mb: 1, letterSpacing: '-0.02em' }}>
          {isAdmin ? 'Select a conversation' : 'Start a conversation'}
        </Typography>
        <Typography variant="body2" sx={{ color: isDark ? '#64748b' : '#94a3b8', textAlign: 'center', maxWidth: 300, lineHeight: 1.7, fontSize: '0.9rem' }}>
          {isAdmin ? 'Choose a conversation from the sidebar to view and respond to messages' : 'Select an admin from the sidebar to get started with support'}
        </Typography>
      </Paper>
    );
  }

  // ===== MAIN CHAT VIEW =====
  return (
    <Paper elevation={0} sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', borderRadius: isMobile ? 0 : '0 24px 24px 0',
      overflow: 'hidden',
      border: isMobile ? 'none' : '1px solid',
      borderColor: 'divider',
      boxShadow: isMobile ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
      position: 'relative',
      touchAction: 'manipulation',
      bgcolor: isDark ? darkBg2 : '#ffffff',
    }}>
      {/* ===== HEADER ===== */}
      <Box sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: isDark ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`,
        minHeight: { xs: 64, sm: 72 },
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          {isMobile && (
            <IconButton onClick={goBackToList}
              sx={{ color: iconClr, p: 0.75, borderRadius: '12px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
              <ArrowBack sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: selectedChat.isOnline ? '#10b981' : isDark ? '#4B5563' : '#cbd5e1',
                width: 10, height: 10, borderRadius: '50%',
                border: isDark ? '2.5px solid #0f172a' : '2.5px solid #fff',
                boxShadow: selectedChat.isOnline ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none',
              },
            }}
          >
            <Avatar
              src={selectedChat.avatar}
              sx={{
                width: 44, height: 44,
                bgcolor: primaryColor,
                border: `2.5px solid ${primaryColor}`,
                color: '#fff',
                fontWeight: 700, fontSize: '1rem',
                boxShadow: `0 4px 12px ${primaryColor}30`,
              }}
            >
              {(selectedChat.userName || 'U')[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '0.95rem', lineHeight: 1.2 }}>
              {selectedChat.userName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{
              color: selectedChat.isOnline ? '#10b981' : isDark ? '#64748b' : '#94a3b8',
              fontSize: '0.72rem', fontWeight: 600,
            }}>
              {isOtherTyping ? (
                <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>typing</span>
                  <Box component="span" sx={{ display: 'inline-flex', gap: 0.3 }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        component="span"
                        sx={{
                          width: 5, height: 5, borderRadius: '50%',
                          bgcolor: '#10b981',
                          animation: 'typingDot 1.4s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ) : selectedChat.isOnline ? 'Active now' : 'Offline'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexShrink: 0 }}>
          {showSearch ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              bgcolor: isDark ? '#1e293b' : '#f8fafc', borderRadius: '12px', px: 1.2, py: 0.5,
              border: '1.5px solid', borderColor: primaryColor,
              boxShadow: `0 0 0 3px ${primaryColor}15`,
            }}>
              <SearchOutlined sx={{ fontSize: 16, color: primaryColor }} />
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
                  fontSize: '0.82rem', width: 130, color: isDark ? '#f1f5f9' : '#0f172a',
                  fontWeight: 500,
                }}
              />
              {searchTerm && (
                <Typography variant="caption" sx={{ color: primaryColor, fontSize: '0.65rem', whiteSpace: 'nowrap', fontWeight: 700 }}>
                  {searchedIndices.length > 0 ? `${searchIndex + 1}/${searchedIndices.length}` : '0/0'}
                </Typography>
              )}
              <IconButton size="small" onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                sx={{ color: iconClr, p: 0.4, borderRadius: '8px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
                <Close sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Tooltip title="Search">
                <IconButton size="small" onClick={() => setShowSearch(true)}
                  sx={{ color: iconClr, p: 0.75, borderRadius: '12px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
                  <SearchOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Audio call">
                <IconButton size="small"
                  sx={{ color: iconClr, p: 0.75, borderRadius: '12px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
                  <CallOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video call">
                <IconButton size="small"
                  sx={{ color: iconClr, p: 0.75, borderRadius: '12px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
                  <VideocamOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Info">
                <IconButton size="small"
                  sx={{ color: iconClr, p: 0.75, borderRadius: '12px', '&:hover': { bgcolor: primLight, color: primaryColor } }}>
                  <InfoOutlined sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      {/* ===== MESSAGES AREA ===== */}
      <Box
        ref={messagesContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2.5 }, py: 1.5,
          bgcolor: isDark ? '#0f172a' : '#fafbfc',
          position: 'relative',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? '#374151' : '#e2e8f0', borderRadius: '3px', '&:hover': { bgcolor: isDark ? '#4B5563' : '#cbd5e1' } },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 8, px: 3,
          }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '20px',
              background: isDark ? 'linear-gradient(135deg, #2D1B69 0%, #1e293b 100%)' : 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)',
              display: 'flex',
              alignItems: 'center', justifyContent: 'center', mb: 2.5,
              boxShadow: isDark ? '0 6px 24px rgba(139,92,246,0.12)' : '0 6px 24px rgba(139,92,246,0.1)',
            }}>
              <Forum sx={{ color: primaryColor, fontSize: 28 }} />
            </Box>
            <Typography sx={{ color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography sx={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: '0.85rem', textAlign: 'center', maxWidth: 240, lineHeight: 1.6 }}>
              Send the first message to start the conversation
            </Typography>
          </Box>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Box key={msg.id || msg.tempId || idx} data-msg-id={idx}>
                {shouldShowDateSeparator(msg, messages[idx - 1]) && (
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                    gap: 1.5,
                  }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? '#1e293b' : '#e2e8f0' }} />
                    <Typography variant="caption" sx={{
                      color: isDark ? '#64748b' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      bgcolor: isDark ? '#0f172a' : '#fafbfc',
                      px: 1.5,
                      py: 0.4,
                      borderRadius: '8px',
                      border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
                    }}>
                      {formatDateLabel(msg.sentAt || msg.timestamp)}
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? '#1e293b' : '#e2e8f0' }} />
                  </Box>
                )}
                <MessageBubble
                  message={msg}
                  isAdmin={isAdmin}
                  onReply={handleReplyMessage}
                  onDelete={handleDeleteMessage}
                  onToggleReaction={toggleReaction}
                  isHighlighted={searchedIndices.includes(idx) && searchedIndices[searchIndex] === idx}
                />
              </Box>
            ))}

            {readReceiptInfo.lastReadTime && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                my: 1.5,
                gap: 0.5,
              }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? '#1e293b' : '#e2e8f0' }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: '10px',
                  bgcolor: isDark ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)',
                  border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.12)'}`,
                }}>
                  <DoneAll sx={{ fontSize: 13, color: '#10b981' }} />
                  <Typography variant="caption" sx={{
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '0.68rem',
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.02em',
                  }}>
                    All read · {readReceiptInfo.lastReadTime}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, height: '1px', bgcolor: isDark ? '#1e293b' : '#e2e8f0' }} />
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* ===== INPUT AREA ===== */}
      <Box sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 1.25, sm: 1.5 },
        bgcolor: isDark ? '#0f172a' : '#ffffff',
        borderTop: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`,
      }}>
        {replyTo && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            mb: 1, px: 1.5, py: 1,
            bgcolor: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.05)',
            borderRadius: '14px',
            borderLeft: `3px solid ${primaryColor}`,
            border: `1px solid ${isDark ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)'}`,
            borderLeftWidth: '3px',
          }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Replying to {replyTo.senderName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{
                color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.8rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 0.15,
              }}>
                {(replyTo.content || replyTo.text || '').substring(0, 80)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearReply} sx={{ color: 'text.secondary', p: 0.5, borderRadius: '8px', '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' } }}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}

        <Box sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: { xs: 0.75, sm: 1 },
        }}>
          {/* Attachment buttons - desktop only */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            pb: { xs: 0.5, sm: 0.75 },
            display: { xs: 'none', sm: 'flex' },
          }}>
            <Tooltip title="Attach file">
              <IconButton size="small" sx={{
                color: isDark ? '#64748b' : '#94a3b8',
                width: 40, height: 40,
                borderRadius: '12px',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: primLight, color: primaryColor },
              }}>
                <AttachFileOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send photo">
              <IconButton size="small" sx={{
                color: isDark ? '#64748b' : '#94a3b8',
                width: 40, height: 40,
                borderRadius: '12px',
                transition: 'all 0.2s',
                '&:hover': { bgcolor: primLight, color: primaryColor },
              }}>
                <AddPhotoAlternateOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Input container */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 0.5,
            bgcolor: isDark ? '#1e293b' : '#f8fafc',
            borderRadius: '18px',
            border: `1.5px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.5, sm: 0.75 },
            transition: 'all 0.2s',
            '&:focus-within': {
              borderColor: primaryColor,
              boxShadow: `0 0 0 3px ${primaryColor}15`,
              bgcolor: isDark ? '#1e293b' : '#ffffff',
            },
          }}>
            {/* Emoji button */}
            <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)} size="small" sx={{
              color: isDark ? '#64748b' : '#94a3b8',
              p: 0.5,
              flexShrink: 0,
              borderRadius: '10px',
              '&:hover': { bgcolor: primLight, color: primaryColor },
            }}>
              <EmojiEmotionsOutlined sx={{ fontSize: 22 }} />
            </IconButton>

            {/* Text input */}
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  fontSize: '0.9rem',
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                  py: 0.25,
                  px: 0.5,
                },
                '& .MuiInputBase-input': {
                  color: isDark ? '#f1f5f9' : '#0f172a',
                  lineHeight: 1.5,
                  fontWeight: 400,
                  '&::placeholder': { color: isDark ? '#475569' : '#94a3b8', fontWeight: 400 },
                },
              }}
            />
          </Box>

          {/* Send button */}
          <Box sx={{ pb: { xs: 0, sm: 0 }, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Mic button - desktop only, hidden when text entered */}
            {!message.trim() && (
              <IconButton size="small" sx={{
                color: isDark ? '#64748b' : '#94a3b8',
                width: 40, height: 40,
                borderRadius: '12px',
                transition: 'all 0.2s',
                display: { xs: 'none', sm: 'flex' },
                '&:hover': { bgcolor: primLight, color: primaryColor },
              }}>
                <MicOutlined sx={{ fontSize: 20 }} />
              </IconButton>
            )}

            <IconButton
              onClick={handleSend}
              disabled={!isConnected || !message.trim()}
              size="small"
              sx={{
                background: message.trim() ? `linear-gradient(135deg, ${primaryColor} 0%, ${primaryHover} 100%)` : (isDark ? '#1e293b' : '#f1f5f9'),
                color: message.trim() ? '#fff' : (isDark ? '#475569' : '#cbd5e1'),
                width: 44, height: 44,
                borderRadius: '14px',
                transition: 'all 0.25s ease',
                '&:hover': message.trim() ? {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${primaryColor}40`,
                } : { bgcolor: isDark ? '#334155' : '#e2e8f0' },
                '&:disabled': {
                  background: isDark ? '#1e293b !important' : '#f1f5f9 !important',
                  color: isDark ? '#475569 !important' : '#cbd5e1 !important',
                },
                flexShrink: 0,
              }}
            >
              <SendRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* ===== SCROLL TO BOTTOM BUTTON ===== */}
      <Fade in={showScrollBtn}>
        <IconButton
          onClick={scrollToBottom}
          size="small"
          sx={{
            position: 'absolute',
            bottom: { xs: 90, sm: 100 },
            right: { xs: 16, sm: 32 },
            bgcolor: isDark ? '#1e293b' : '#fff',
            border: '1px solid', borderColor: isDark ? '#374151' : '#e2e8f0',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            width: 36, height: 36,
            borderRadius: '10px',
            '&:hover': { bgcolor: primLight, color: primaryColor, boxShadow: `0 4px 16px ${primaryColor}20` },
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
        >
          <KeyboardArrowDown sx={{ fontSize: 20 }} />
        </IconButton>
      </Fade>

      <EmojiPicker anchorEl={emojiAnchor} onClose={() => setEmojiAnchor(null)} onEmojiSelect={handleEmojiSelect} />

      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Paper>
  );
};

export default ChatWindow;
