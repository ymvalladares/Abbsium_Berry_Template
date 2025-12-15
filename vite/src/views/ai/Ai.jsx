import React, { useState, useRef, useEffect } from 'react';
import { Box, Toolbar, TextField, InputAdornment, IconButton, Paper, Typography, Button, Popover } from '@mui/material';

import { IconSend2, IconPlus, IconChevronDown } from '@tabler/icons-react';
import MicIcon from '@mui/icons-material/Mic';

import ChatMessage from './message-view/MessageView';
import TextMotion from '../../utils/textMotion';
import api from '../../services/AxiosService';

/* -------------------------------
   MODEL OPTIONS (NO UI BREAK)
-------------------------------- */
const MODELS = [
  {
    id: 'gpt-4o-mini',
    label: 'GPT-4o-mMini',
    subtitle: 'Basic',
    description: 'Affordable small model'
  },

  {
    id: 'gpt-4.1',
    label: 'GPT-4.1',
    subtitle: 'Smarter',
    description: 'Better reasoning and coding'
  },
  {
    id: 'gpt-5.1',
    label: 'GPT-5.1',
    subtitle: 'Faster',
    description: 'Fast responses for daily tasks'
  }
];

export default function Ai() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);

  /* MODEL STATE */
  const [model, setModel] = useState(MODELS[1]);
  const [anchorEl, setAnchorEl] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    if (!firstMessageSent) setFirstMessageSent(true);

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('Ai/Chat-Ai', {
        message: input,
        model: model.id,
        messages
      });

      console.log(model.id);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.response || 'No response received'
        }
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Something went wrong. Please try again.' }]);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        mt: firstMessageSent ? -2 : { xs: 20, md: 8 }
      }}
    >
      <Toolbar />

      {/* CHAT */}
      <Box
        sx={{
          flexGrow: firstMessageSent ? 1 : 0,
          width: '100%',
          maxWidth: { xs: '100%', md: '80%' },
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          pb: 5
        }}
      >
        {/* HERO */}
        {!firstMessageSent && (
          <Box sx={{ position: 'relative', textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 420,
                height: 120,
                background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18), transparent 70%)',
                filter: 'blur(30px)',
                zIndex: 0
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#6B7280',
                  mb: 1
                }}
              >
                AI Assistant
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: 28, sm: 36 },
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#4C1D95',
                  lineHeight: 1.2
                }}
              >
                What would you like to work on?
              </Typography>

              <Typography sx={{ mt: 2, fontSize: 15, color: '#6B7280' }}>
                Learn, explore examples, or improve your code with AI assistance.
              </Typography>
            </Box>
          </Box>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <Typography sx={{ mt: 2, color: '#6B7280' }}>
            <TextMotion text="Thinking..." />
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* INPUT */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#FFF',
          width: '100%',
          maxWidth: { xs: '100%', sm: '90%', md: '65%' },
          borderRadius: '30px',
          p: 2.5,
          mb: firstMessageSent ? 0 : 4,
          transition: '0.4s ease',
          mt: -5
        }}
      >
        {/* QUICK PROMPTS */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            mb: 2,
            overflowX: 'auto',
            flexWrap: { xs: 'nowrap', sm: 'wrap' }
          }}
        >
          {['Help me learn this', 'Explain step by step', 'Improve my code', 'Give me an example', 'Fix this issue', 'Bugs'].map((text) => (
            <Button
              key={text}
              variant="outlined"
              size="small"
              onClick={() => setInput(text)}
              sx={{
                borderRadius: '20px',
                px: 1.5,
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'none',
                color: '#5E35B1',
                borderColor: '#E0D7F8',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                '&:hover': { bgcolor: '#EDE7F6' }
              }}
            >
              {text}
            </Button>
          ))}
        </Box>

        {/* TEXT INPUT */}
        <Box sx={{ position: 'relative' }}>
          {!input && (
            <Box
              sx={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#9CA3AF'
              }}
            >
              Ask something…
            </Box>
          )}

          <TextField
            fullWidth
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            multiline
            maxRows={4}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: 14, color: '#111827', pr: 6 },
              endAdornment: (
                <InputAdornment position="end" sx={{ mr: -6 }}>
                  <IconButton disabled={!input.trim() || loading} onClick={handleSend} sx={{ color: '#5E35B1' }}>
                    <IconSend2 />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>

        {/* ACTION BAR (UNCHANGED STYLE) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <IconButton sx={{ color: '#5E35B1' }}>
            <IconPlus />
          </IconButton>

          {/* MODEL SELECTOR (REPLACES TOOLS) */}
          <Button
            onClick={(e) => setAnchorEl(e.currentTarget)}
            endIcon={<IconChevronDown size={16} />}
            sx={{
              color: '#5E35B1',
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {model.label} · {model.subtitle}
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <MicIcon sx={{ color: '#9CA3AF' }} />
        </Box>
      </Paper>

      {/* MODEL POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 260 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1 }}>Choose model</Typography>

          {MODELS.map((m) => (
            <Box
              key={m.id}
              onClick={() => {
                setModel(m);
                setAnchorEl(null);
              }}
              sx={{
                p: 1.5,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: model.id === m.id ? '#EEF2FF' : 'transparent',
                '&:hover': { bgcolor: '#F3F4F6' }
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                {m.label} · {m.subtitle}
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{m.description}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
