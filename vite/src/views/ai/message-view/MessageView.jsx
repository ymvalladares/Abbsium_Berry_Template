import { Box, Paper, IconButton, Typography } from '@mui/material';
import OpenAIResponseDisplay from './OpenAIResponseDisplay ';

const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        width: '100%'
      }}
    >
      <Paper
        sx={{
          px: isUser ? 2 : { xs: 2, md: 6 },
          py: isUser ? 0 : 2.5, // agrega un padding mínimo para usuarios también
          borderRadius: 4,
          maxWidth: isUser ? '50%' : '90%', // 98% puede romper en móvil
          bgcolor: isUser ? '#5E35B1' : 'transparent',
          color: isUser ? 'white' : 'text.primary',
          wordBreak: 'break-word', // importante para links o textos largos
          overflowWrap: 'break-word' // soporte extra para enlaces largos
        }}
      >
        {typeof content === 'string' ? <OpenAIResponseDisplay markdownContent={content} /> : content}
      </Paper>
    </Box>
  );
};

export default ChatMessage;
