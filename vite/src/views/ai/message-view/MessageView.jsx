import { Box, Paper, IconButton, Typography } from '@mui/material';
import OpenAIResponseDisplay from './OpenAIResponseDisplay ';

const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        my: 1,
        width: '100%'
      }}
    >
      <Paper
        sx={{
          px: isUser ? 2 : { xs: 2, md: 6 },
          py: isUser ? 0 : 2.5,
          borderRadius: 4,
          maxWidth: isUser ? '75%' : '100%', // 🔥 Cambia aquí
          bgcolor: isUser ? '#5E35B1' : 'transparent',
          color: isUser ? 'white' : 'text.primary'
        }}
      >
        {typeof content === 'string' ? <OpenAIResponseDisplay markdownContent={content} /> : content}
      </Paper>
    </Box>
  );
};

export default ChatMessage;
