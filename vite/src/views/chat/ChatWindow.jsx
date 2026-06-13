import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Avatar, Typography, IconButton, TextField,
  CircularProgress, Badge, Paper, Fade,
  Tooltip, Skeleton,
} from '@mui/material';
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

const primaryColor = '#8B5CF6';
const primaryHover = '#7C3AED';
const primaryLight = '#F3E8FF';
const iconColor = '#475569';

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
  const {
    isAdmin, selectedChat, messages, isConnected,
    isLoading, sendMessage, deleteMessage, goBackToList,
    isOtherTyping, sendTypingIndicator, toggleReaction,
    saveDraft, getDraft, clearDraft, updateUnreadBadge,
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
    }
  }, [updateUnreadBadge]);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !isConnected || !selectedChat) return;
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
      typingDebounceRef.current = setTimeout(() => {
        sendTypingIndicator();
      }, 500);
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

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        height: '100%', borderRadius: isMobile ? 0 : '0 12px 12px 0',
        border: isMobile ? 'none' : '1px solid #e2e8f0',
        boxShadow: isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}>
        <Box sx={{ px: 2.25, py: 0.8, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="circular" width={38} height={38} />
          <Box>
            <Skeleton width={100} height={14} sx={{ mb: 0.5 }} />
            <Skeleton width={60} height={10} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, px: 1.25, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i} sx={{
              display: 'flex',
              flexDirection: i % 3 === 0 ? 'row' : 'row-reverse',
              alignItems: 'flex-end',
              gap: 0.5,
            }}>
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton
                variant="rounded"
                width={i % 2 === 0 ? '60%' : '45%'}
                height={36 + (i % 3) * 12}
                sx={{ borderRadius: i % 3 === 0 ? '14px 14px 14px 4px' : '14px 14px 4px 14px' }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ px: 2.25, py: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton width="100%" height={36} sx={{ borderRadius: 2 }} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Paper>
    );
  }

  if (!selectedChat) {
    return (
      <Paper elevation={0} sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        height: '100%', borderRadius: isMobile ? 0 : '0 12px 12px 0',
        border: isMobile ? 'none' : '1px solid #e2e8f0',
        boxShadow: isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
        px: 4,
        background: 'linear-gradient(135deg, #fff 0%, #faf5ff 100%)',
      }}>
        <Box sx={{
          width: 72, height: 72, borderRadius: '50%',
          bgcolor: primaryLight, display: 'flex',
          alignItems: 'center', justifyContent: 'center', mb: 3,
          boxShadow: `0 4px 16px ${primaryColor}25`,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.05)' },
        }}>
          <Forum sx={{ color: primaryColor, fontSize: 32 }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '1.05rem', mb: 1 }}>
          {isAdmin ? 'Select a conversation' : 'Start a conversation'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          {isAdmin ? 'Choose a conversation from the sidebar to view messages' : 'Select an admin to get started with support'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{
      flex: 1, display: 'flex', flexDirection: 'column',
      height: '100%', borderRadius: isMobile ? 0 : '0 12px 12px 0',
      overflow: 'hidden',
      border: isMobile ? 'none' : '1px solid #e2e8f0',
      boxShadow: isMobile ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
      position: 'relative',
      touchAction: 'manipulation',
    }}>
      <Box sx={{
        px: 2.25, py: 0.8,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #fff 0%, #faf5ff 100%)',
        minHeight: 52,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
          {isMobile && (
            <IconButton onClick={goBackToList}
              sx={{ color: iconColor, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
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
                width: 9, height: 9, borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: selectedChat.isOnline ? '0 0 0 2px rgba(16,185,129,0.2)' : 'none',
              },
            }}
          >
            <Avatar
              src={selectedChat.avatar}
              sx={{
                width: 38, height: 38,
                bgcolor: primaryColor,
                border: `2px solid ${primaryColor}`,
                color: '#fff',
                fontWeight: 600, fontSize: '0.9rem',
              }}
            >
              {(selectedChat.userName || 'U')[0]?.toUpperCase()}
            </Avatar>
          </Badge>

          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem', lineHeight: 1.2 }}>
              {selectedChat.userName || 'User'}
            </Typography>
            <Typography variant="caption" sx={{
              color: selectedChat.isOnline ? '#10b981' : '#64748b',
              fontSize: '0.65rem', fontWeight: 500,
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
                          width: 4, height: 4, borderRadius: '50%',
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

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
          {showSearch ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.5,
              bgcolor: '#f8fafc', borderRadius: '8px', px: 1, py: 0.3,
              border: '1.5px solid #e2e8f0',
            }}>
              <SearchOutlined sx={{ fontSize: 16, color: iconColor }} />
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
                <Typography variant="caption" sx={{ color: iconColor, fontSize: '0.65rem', whiteSpace: 'nowrap', fontWeight: 600 }}>
                  {searchedIndices.length > 0 ? `${searchIndex + 1}/${searchedIndices.length}` : '0/0'}
                </Typography>
              )}
              <IconButton size="small" onClick={() => { setShowSearch(false); setSearchTerm(''); }}
                sx={{ color: iconColor, p: 0.3, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ) : (
            <>
              <Tooltip title="Search in conversation">
                <IconButton size="small" onClick={() => setShowSearch(true)}
                  sx={{ color: iconColor, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
                  <SearchOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Audio call">
                <IconButton size="small"
                  sx={{ color: iconColor, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
                  <CallOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Video call">
                <IconButton size="small"
                  sx={{ color: iconColor, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
                  <VideocamOutlined sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Conversation info">
                <IconButton size="small"
                  sx={{ color: iconColor, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
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
          flex: 1, overflowY: 'auto', px: 1.25, py: 1,
          background: 'linear-gradient(180deg, #fafbfc 0%, #f8f9ff 100%)',
          position: 'relative',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: '3px', '&:hover': { bgcolor: '#cbd5e1' } },
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 6, px: 3,
          }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              bgcolor: primaryLight, display: 'flex',
              alignItems: 'center', justifyContent: 'center', mb: 2,
              boxShadow: `0 3px 12px ${primaryColor}20`,
            }}>
              <Forum sx={{ color: primaryColor, fontSize: 24 }} />
            </Box>
            <Typography sx={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
              No messages yet
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', maxWidth: 220, lineHeight: 1.5 }}>
              Send a message to start the conversation
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
                    my: 1.5,
                    gap: 1,
                  }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                    <Typography variant="caption" sx={{
                      color: '#64748b',
                      fontWeight: 600,
                      fontSize: '0.68rem',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.02em',
                    }}>
                      {formatDateLabel(msg.sentAt || msg.timestamp)}
                    </Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
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
                my: 1,
                gap: 0.5,
              }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1.5,
                  py: 0.3,
                  borderRadius: '12px',
                  bgcolor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                }}>
                  <DoneAll sx={{ fontSize: 12, color: '#10b981' }} />
                  <Typography variant="caption" sx={{
                    color: '#10b981',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    whiteSpace: 'nowrap',
                  }}>
                    All messages read · {readReceiptInfo.lastReadTime}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, height: '1px', bgcolor: '#e2e8f0' }} />
              </Box>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{
        px: 2.25, py: 1,
        background: 'linear-gradient(135deg, #fff 0%, #faf5ff 100%)',
        position: 'relative',
      }}>
        {replyTo && (
          <Box sx={{
            display: 'flex', alignItems: 'flex-start', gap: 0.8,
            mb: 0.6, px: 1.2, py: 0.8,
            bgcolor: primaryLight, borderRadius: '8px',
            borderLeft: `3px solid ${primaryColor}`,
          }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Replying to {replyTo.senderName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{
                color: '#475569', fontSize: '0.8rem',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', mt: 0.2,
              }}>
                {(replyTo.content || replyTo.text || '').substring(0, 80)}
              </Typography>
            </Box>
            <IconButton size="small" onClick={clearReply}
              sx={{ color: iconColor, p: 0.3, mt: 0.2, '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
              <Close sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}

          <Box sx={{ display: 'flex', gap: 0.2, alignItems: 'center' }}>
            <IconButton onClick={(e) => setEmojiAnchor(e.currentTarget)} sx={{ color: iconColor, width: 32, height: 32, borderRadius: '10px', '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
              <EmojiEmotionsOutlined sx={{ fontSize: 17 }} />
            </IconButton>

            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder=""
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'transparent',
                  borderRadius: '12px',
                  fontSize: '16px',
                  '& fieldset': { borderColor: 'transparent', borderWidth: '0' },
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                    boxShadow: 'none',
                  },
                  py: 0.5,
                  px: 0.5,
                },
                '& .MuiInputBase-input': {
                  color: '#0f172a',
                  '&::placeholder': { color: 'transparent' },
                  touchAction: 'manipulation',
                },
              }}
            />

            <IconButton
              onClick={handleSend}
              disabled={!isConnected || !message.trim()}
              sx={{
                bgcolor: message.trim() ? primaryColor : 'transparent',
                color: message.trim() ? '#fff' : iconColor,
                width: 32, height: 32,
                borderRadius: '10px',
                '&:hover': message.trim() ? { bgcolor: primaryHover, transform: 'translateY(-1px)', boxShadow: `0 4px 12px ${primaryColor}40` } : { bgcolor: primaryLight, color: primaryColor },
                '&:disabled': { bgcolor: 'transparent !important', color: '#cbd5e1 !important' },
                transition: 'all 0.2s ease',
              }}
            >
              <SendRounded sx={{ fontSize: 17 }} />
            </IconButton>

            <IconButton sx={{ color: iconColor, width: 32, height: 32, borderRadius: '10px', '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
              <AddPhotoAlternateOutlined sx={{ fontSize: 17 }} />
            </IconButton>

            <IconButton sx={{ color: iconColor, width: 32, height: 32, borderRadius: '10px', '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
              <AttachFileOutlined sx={{ fontSize: 17 }} />
            </IconButton>

            <IconButton sx={{ color: iconColor, width: 32, height: 32, borderRadius: '10px', '&:hover': { bgcolor: primaryLight, color: primaryColor } }}>
              <MicOutlined sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.5 }}>
          <Typography variant="caption" sx={{
            color: '#64748b', fontSize: '0.6rem',
            letterSpacing: '0.02em', fontWeight: 500,
          }}>
            End-to-end encrypted · Abbsium Chat
          </Typography>
        </Box>
      </Box>

      <EmojiPicker anchorEl={emojiAnchor} onClose={() => setEmojiAnchor(null)} onEmojiSelect={handleEmojiSelect} />

      <Fade in={showScrollBtn}>
        <IconButton
          onClick={scrollToBottom}
          size="small"
          sx={{
            position: 'absolute',
            bottom: { xs: 110, sm: 120 },
            right: { xs: 24, sm: 40 },
            bgcolor: '#fff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(139,92,246,0.15)',
            width: 34, height: 34,
            '&:hover': { bgcolor: primaryLight, color: primaryColor, boxShadow: '0 4px 12px rgba(139,92,246,0.2)' },
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
        >
          <KeyboardArrowDown sx={{ fontSize: 18 }} />
        </IconButton>
      </Fade>

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
