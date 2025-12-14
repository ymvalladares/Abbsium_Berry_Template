import React, { useState, useRef, useEffect } from 'react';
import { Box, Toolbar, TextField, InputAdornment, IconButton, Paper, Typography, Button, Stack } from '@mui/material';
import { IconSend2, IconPlus } from '@tabler/icons-react';
import TuneIcon from '@mui/icons-material/Tune';
import MicIcon from '@mui/icons-material/Mic';
import ChatMessage from './message-view/MessageView';
import TextMotion from '../../utils/textMotion';
import TopTextMotion from '../../utils/topTextMotion';

import api from '../../services/AxiosService';

export default function Ai() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [loading, setLoading] = useState(false);

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
        model: 'gpt-4o-mini',
        messages: messages // <- envia el historial completo
      });

      const aiMessage = {
        role: 'assistant',
        content: res.data.response || 'No response received'
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'assistant', content: '❌ Error al generar la respuesta' }]);
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
        mt: firstMessageSent ? -2 : { xs: 25, md: 8 }
      }}
    >
      <Toolbar />

      {/* Chat */}
      <Box
        sx={{
          flexGrow: firstMessageSent ? 1 : 0, // ⭐ SOLO se activa después del primer mensaje
          width: '100%',
          maxWidth: { xs: '100%', md: '80%' },
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          pb: 5
        }}
      >
        {!firstMessageSent && (
          <>
            <Typography variant="h4" sx={{ textAlign: 'center', width: '100%', color: 'black' }}>
              <span style={{ fontSize: 28 }}>✨</span> Hello, Welcome to your AI
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 200,
                fontSize: { xs: 28, sm: 32 },
                textAlign: 'center',
                width: '100%',
                mt: 1
              }}
            >
              <TopTextMotion text="How can I help you today?" />
            </Typography>
          </>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <Typography variant="h5" color="text.secondary">
            <TextMotion text="Thinking ..." />
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
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
          position: 'relative' // ⭐ Needed for absolute placeholder
        }}
      >
        {!input && (
          <Box
            sx={{
              position: 'absolute',
              left: 35,
              top: '25%', // ⭐ Centrado verticalmente
              transform: 'translateY(-25%)', // ⭐ Ajuste perfecto
              pointerEvents: 'none',
              color: 'rgba(120,120,120,0.7)',
              zIndex: 3
            }}
          >
            <TextMotion text="Ask something ..." />
          </Box>
        )}
        <TextField
          fullWidth
          //placeholder={<TextMotion text="Ask something ..." />}
          variant="standard"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            e.target.style.height = `${e.target.scrollHeight}px`; // Set new height
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          InputProps={{
            disableUnderline: true,
            sx: { color: '#fff', fontSize: 14, overflow: 'hidden', resize: 'none' }, // Hide scrollbar
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: 'flex-end' }}>
                <IconButton disabled={!input.trim() || loading} sx={{ color: '#5E35B1', cursor: 'pointer' }} onClick={handleSend}>
                  <IconSend2 />
                </IconButton>
              </InputAdornment>
            )
          }}
          multiline
          maxRows={4}
          sx={{ height: 'auto', overflow: 'hidden' }} // Allow dynamic height
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 2,
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <IconButton sx={{ color: '#5E35B1', fontWeight: 'bold' }}>
            <IconPlus />
          </IconButton>
          <Button
            startIcon={<TuneIcon />}
            sx={{
              color: '#5E35B1',
              textTransform: 'none',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }}
          >
            Tools
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 1 }}>
            <MicIcon sx={{ color: '#ccc', mt: 1 }} />
          </Box>
        </Box>
      </Paper>

      {!firstMessageSent && (
        <Stack
          direction="row"
          flexWrap="wrap"
          justifyContent="center"
          spacing={2}
          sx={{ width: '100%', maxWidth: '90%', mt: 4, display: { xs: 'none', md: 'flex' } }}
        >
          <Suggestion label="🍌 Crear imagen" />
          <Suggestion label="Crear un video" />
          <Suggestion label="Escribir cualquier cosa" />
          <Suggestion label="Ayúdame a aprender" />
          <Suggestion label="Dale un impulso a mi día" />
        </Stack>
      )}
    </Box>
  );
}

function Suggestion({ label }) {
  return (
    <Paper
      sx={{
        bgcolor: '#fff',
        color: '#5E35B1',
        px: 3,
        py: 1.5,
        borderRadius: '30px',
        fontWeight: 'bold',
        fontSize: 14,
        cursor: 'pointer',
        ':hover': { bgcolor: '#5E35B1', color: '#fff' }
      }}
    >
      {label}
    </Paper>
  );
}
