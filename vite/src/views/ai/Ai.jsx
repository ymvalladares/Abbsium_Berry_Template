import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Box, TextField, IconButton, Paper, Typography, Button, Popover, Tooltip } from '@mui/material';
import {
  IconSend2,
  IconPlus,
  IconChevronDown,
  IconX,
  IconCode,
  IconBulb,
  IconPencil,
  IconBug,
  IconBook,
  IconWand,
  IconRefresh,
  IconPlayerStop,
  IconCopy,
  IconRotate2
} from '@tabler/icons-react';

import ChatMessage from './message-view/MessageView';
import api from '../../services/AxiosService';

const STORAGE_KEY = 'ai_chat_messages';
const STORAGE_MODEL_KEY = 'ai_chat_model';

const MAX_CHARS = 4000;

const QUICK_PROMPTS = [
  { icon: IconWand, label: 'Explain', text: 'Explain this in simple terms' },
  { icon: IconCode, label: 'Code', text: 'Write code for' },
  { icon: IconBulb, label: 'Ideas', text: 'Give me ideas for' },
  { icon: IconPencil, label: 'Improve', text: 'Improve this for me' },
  { icon: IconBug, label: 'Debug', text: 'Help me debug this' },
  { icon: IconBook, label: 'Summarize', text: 'Summarize this for me' }
];

const MODELS = [
  { id: 'gpt-4o-mini', label: 'GPT-4o-Mini', description: 'Affordable small model' },
  { id: 'gpt-4.1', label: 'GPT-4.1', subtitle: 'Smarter', description: 'Better reasoning and coding' },
  { id: 'gpt-5.1', label: 'GPT-5.1', subtitle: 'Faster', description: 'Fast responses for daily tasks' }
];

const loadMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadModel = () => {
  try {
    const saved = localStorage.getItem(STORAGE_MODEL_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return MODELS.find((m) => m.id === parsed.id) || MODELS[0];
    }
  } catch {}
  return MODELS[0];
};

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === now.toDateString()) return time;
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${time}`;
};

const getMessageCount = (msgs) => {
  const count = msgs.filter((m) => m.role === 'user').length;
  return count === 1 ? '1 message' : `${count} messages`;
};

export default function Ai() {
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [firstMessageSent, setFirstMessageSent] = useState(() => loadMessages().length > 0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [model, setModel] = useState(loadModel);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MODEL_KEY, JSON.stringify(model));
  }, [model]);

  const canSend = useMemo(() => input.trim() && !loading, [input, loading]);

  const sendRequest = useCallback(
    async (content, history, onSuccess, onError) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);

      try {
        const res = await api.post('Ai/Chat-Ai', { message: content, model: model.id, messages: history }, { signal: controller.signal });
        if (!controller.signal.aborted) {
          onSuccess(res.data.content || 'No response received');
        }
      } catch {
        if (controller.signal.aborted) return;
        onError();
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          abortRef.current = null;
        }
      }
    },
    [model.id]
  );

  const handleSend = useCallback(() => {
    if (!canSend) return;

    if (!firstMessageSent) setFirstMessageSent(true);

    const userMsg = { role: 'user', content: input, timestamp: Date.now() };
    const prevMessages = [...messages, userMsg];

    setMessages(prevMessages);
    setInput('');

    sendRequest(
      input,
      prevMessages,
      (content) => {
        setMessages((prev) => [...prev, { role: 'assistant', content, timestamp: Date.now() }]);
      },
      () => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: Date.now() }]);
      }
    );
  }, [canSend, firstMessageSent, input, messages, sendRequest]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
    abortRef.current = null;
  }, []);

  const handleRegenerate = useCallback(() => {
    if (loading || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg.role !== 'assistant') return;

    let userIdx = messages.length - 2;
    while (userIdx >= 0 && messages[userIdx].role !== 'user') {
      userIdx--;
    }
    if (userIdx < 0) return;

    const userContent = messages[userIdx].content;
    const history = messages.slice(0, messages.length - 1);

    setMessages(history);

    sendRequest(
      userContent,
      history,
      (content) => {
        setMessages((prev) => [...prev, { role: 'assistant', content, timestamp: Date.now() }]);
      },
      () => {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.', timestamp: Date.now() }]);
      }
    );
  }, [loading, messages, sendRequest]);

  const handleCopyConversation = useCallback(async () => {
    const text = messages
      .map((m) => {
        const label = m.role === 'user' ? 'You' : 'Assistant';
        return `${label}: ${m.content}`;
      })
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [messages]);

  const handleInputKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handlePromptClick = useCallback((prompt) => setInput(prompt.text || prompt), []);

  const handleModelOpen = useCallback((e) => setAnchorEl(e.currentTarget), []);
  const handleModelClose = useCallback(() => setAnchorEl(null), []);
  const handleModelSelect = useCallback((selected) => {
    setModel(selected);
    setAnchorEl(null);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setFirstMessageSent(false);
    setInput('');
  }, []);

  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charProgress = Math.min(charCount / MAX_CHARS, 1);
  const isNearLimit = charCount > MAX_CHARS * 0.9;
  const lastMsgIsError =
    messages.length > 0 &&
    messages[messages.length - 1].role === 'assistant' &&
    messages[messages.length - 1].content.includes('Something went wrong');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        maxWidth: 960,
        mx: 'auto',
        width: '100%',
        px: { xs: 2, md: 4 },
        pt: 2
      }}
    >
      {/* CHAT AREA */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: firstMessageSent ? 'auto' : 'hidden',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e5e7eb', borderRadius: 3 }
        }}
      >
        {/* HERO */}
        {!firstMessageSent && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 500,
                height: 160,
                background: 'radial-gradient(ellipse at center, rgba(94,53,177,0.12), transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none'
              }}
            />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: 26, sm: 34, md: 40 },
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                  mb: 1.5
                }}
              >
                What would you like to work on?
              </Typography>
              <Typography sx={{ fontSize: 15, color: '#6B7280', maxWidth: 480, mx: 'auto' }}>
                Learn, explore examples, or improve your code with AI assistance.
              </Typography>
            </Box>
          </Box>
        )}

        {/* MESSAGES */}
        {messages.length > 0 && (
          <Box sx={{ py: 2 }}>
            {/* HEADER BAR */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2.5,
                px: { xs: 2, md: 6 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED', flexShrink: 0 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF' }}>{getMessageCount(messages)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title={copied ? 'Copied!' : 'Copy conversation'} arrow>
                  <IconButton
                    onClick={handleCopyConversation}
                    size="small"
                    sx={{
                      color: copied ? '#7C3AED' : '#9CA3AF',
                      '&:hover': { color: '#5E35B1', bgcolor: '#F5F3FF' },
                      transition: 'color 0.2s'
                    }}
                  >
                    <IconCopy size={16} />
                  </IconButton>
                </Tooltip>
                <Button
                  onClick={handleNewChat}
                  startIcon={<IconRefresh size={15} />}
                  size="small"
                  sx={{
                    color: '#9CA3AF',
                    textTransform: 'none',
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: '8px',
                    px: 1.2,
                    minHeight: 30,
                    '&:hover': { color: '#5E35B1', bgcolor: '#F5F3FF' }
                  }}
                >
                  New chat
                </Button>
              </Box>
            </Box>

            {messages.map((msg, idx) => {
              const isLastAssistant = idx === messages.length - 1 && msg.role === 'assistant';

              return (
                <Box key={`${msg.role}-${idx}-${msg.content?.slice(0, 8)}`} sx={{ mb: 1.5 }}>
                  {msg.timestamp && (
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: '#D1D5DB',
                        fontWeight: 500,
                        px: { xs: 2, md: 6 },
                        mb: 0.5,
                        ...(msg.role === 'user' && { textAlign: 'right' })
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                  )}
                  <ChatMessage role={msg.role} content={msg.content} />

                  {isLastAssistant && !loading && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 0.5,
                        px: { xs: 2, md: 6 }
                      }}
                    >
                      <Tooltip title="Regenerate" arrow>
                        <IconButton
                          onClick={handleRegenerate}
                          size="small"
                          sx={{
                            width: 26,
                            height: 26,
                            color: '#9CA3AF',
                            '&:hover': { color: '#5E35B1', bgcolor: '#F5F3FF' }
                          }}
                        >
                          <IconRotate2 size={14} />
                        </IconButton>
                      </Tooltip>
                      {lastMsgIsError && (
                        <Button
                          onClick={handleRegenerate}
                          size="small"
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: 'none',
                            color: '#dc2626',
                            minWidth: 0,
                            p: '2px 8px',
                            borderRadius: '6px',
                            '&:hover': { bgcolor: '#FEF2F2' }
                          }}
                        >
                          Retry
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        {/* LOADING */}
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: { xs: 2, md: 6 }, py: 2.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 11,
                fontWeight: 800,
                color: '#FFF',
                letterSpacing: '-0.02em'
              }}
            >
              AI
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#7C3AED',
                    animation: 'aiBounce 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT AREA */}
      <Box
        sx={{
          position: 'relative',
          padding: '1.5px',
          borderRadius: '20px',
          background: isFocused
            ? 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #7C3AED 100%)'
            : 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
          backgroundSize: '200% 200%',
          mb: { xs: 2, md: 4 },
          flexShrink: 0,
          transition: 'box-shadow 0.3s ease',
          boxShadow: isFocused ? '0 0 24px rgba(124,58,237,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
          animation: isFocused ? 'shimmer 3s ease infinite' : 'none'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#FFF',
            borderRadius: '19px',
            p: 2.5
          }}
        >
          {/* TEXT INPUT ROW */}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Tooltip title="Attach files" arrow>
              <IconButton sx={{ color: '#9CA3AF', '&:hover': { color: '#5E35B1', bgcolor: '#F5F3FF' } }} size="small" disabled={loading}>
                <IconPlus size={20} />
              </IconButton>
            </Tooltip>

            <TextField
              fullWidth
              variant="standard"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline
              maxRows={6}
              placeholder="Ask anything..."
              disabled={loading}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: { xs: 16, sm: 15 },
                  color: '#111827',
                  py: 0.5,
                  lineHeight: 1.6
                }
              }}
              sx={{
                '& .MuiInputBase-root': { bgcolor: 'transparent' }
              }}
            />

            {input && !loading && (
              <Tooltip title="Clear" arrow>
                <IconButton
                  onClick={() => setInput('')}
                  size="small"
                  sx={{ color: '#9CA3AF', '&:hover': { color: '#6B7280' }, width: 28, height: 28 }}
                >
                  <IconX size={16} />
                </IconButton>
              </Tooltip>
            )}

            {loading ? (
              <Tooltip title="Stop generating" arrow>
                <IconButton
                  onClick={handleStop}
                  sx={{
                    color: '#FFF',
                    bgcolor: '#dc2626',
                    borderRadius: '12px',
                    width: 40,
                    height: 40,
                    '&:hover': { bgcolor: '#b91c1c' },
                    transition: 'all 0.2s'
                  }}
                >
                  <IconPlayerStop size={20} />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton
                disabled={!canSend}
                onClick={handleSend}
                sx={{
                  color: canSend ? '#FFF' : '#D1D5DB',
                  bgcolor: canSend ? '#7C3AED' : 'transparent',
                  borderRadius: '12px',
                  width: 40,
                  height: 40,
                  '&:hover': canSend ? { bgcolor: '#6D28D9' } : {},
                  transition: 'all 0.2s',
                  ...(canSend && {
                    boxShadow: '0 2px 8px rgba(124,58,237,0.3)'
                  })
                }}
              >
                <IconSend2 size={20} />
              </IconButton>
            )}
          </Box>

          {/* CHARACTER COUNT + WORD COUNT + ENTER HINT */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5, minHeight: 20, gap: 1.5 }}>
            {input && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    bgcolor: '#f3f4f6',
                    overflow: 'hidden',
                    maxWidth: 100
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${Math.min(charProgress * 100, 100)}%`,
                      borderRadius: 2,
                      bgcolor: isNearLimit ? '#dc2626' : '#A78BFA',
                      transition: 'width 0.2s ease, background-color 0.2s ease'
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: '#9CA3AF',
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {wordCount} words
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: isNearLimit ? '#dc2626' : '#9CA3AF',
                    fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {charCount.toLocaleString()}
                </Typography>
              </Box>
            )}
            {!input && (
              <Typography sx={{ fontSize: 11, color: '#D1D5DB', ml: 'auto' }}>
                Press{' '}
                <Box component="span" sx={{ bgcolor: '#f3f4f6', px: 0.5, py: 0.1, borderRadius: 0.5, fontSize: 10 }}>
                  Enter
                </Box>{' '}
                to send ·{' '}
                <Box component="span" sx={{ bgcolor: '#f3f4f6', px: 0.5, py: 0.1, borderRadius: 0.5, fontSize: 10 }}>
                  Shift+Enter
                </Box>{' '}
                new line
              </Typography>
            )}
          </Box>

          {/* QUICK PROMPTS + BOTTOM BAR */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, pt: 1.5, borderTop: '1px solid #f3f4f6' }}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                flexWrap: 'nowrap',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' }
              }}
            >
              {QUICK_PROMPTS.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="outlined"
                    size="small"
                    startIcon={<Icon size={14} />}
                    onClick={() => handlePromptClick(item)}
                    disabled={loading}
                    sx={{
                      borderRadius: '20px',
                      px: 1.6,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'none',
                      color: '#5E35B1',
                      border: '1.5px solid',
                      borderColor: '#D0C5F0',
                      bgcolor: '#FAF8FF',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      minHeight: 32,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#7C3AED',
                        bgcolor: '#F5F3FF',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 3px 10px rgba(124,58,237,0.1)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              onClick={handleModelOpen}
              endIcon={<IconChevronDown size={15} />}
              disabled={loading}
              size="small"
              sx={{
                color: '#9CA3AF',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 12,
                flexShrink: 0,
                '&:hover': { color: '#5E35B1', bgcolor: 'transparent' }
              }}
            >
              {model.label} {model.subtitle && `· ${model.subtitle}`}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* MODEL POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleModelClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } }}
      >
        <Box sx={{ p: 2, width: 260 }}>
          <Typography
            sx={{ fontSize: 12, fontWeight: 700, mb: 1.5, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Choose model
          </Typography>

          {MODELS.map((m) => (
            <Box
              key={m.id}
              onClick={() => handleModelSelect(m)}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: model.id === m.id ? '#F5F3FF' : 'transparent',
                border: '1px solid',
                borderColor: model.id === m.id ? '#E0D7F8' : 'transparent',
                mb: 0.5,
                '&:hover': { bgcolor: '#F9FAFB' }
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                {m.label}
                {m.subtitle && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#FFF',
                      bgcolor: '#7C3AED',
                      px: 1,
                      py: 0.3,
                      borderRadius: 1
                    }}
                  >
                    {m.subtitle}
                  </Box>
                )}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7280', mt: 0.3 }}>{m.description}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes aiBounce {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-6px); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Box>
  );
}
