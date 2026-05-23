import { useState, useCallback } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { IconCopy, IconCheck } from '@tabler/icons-react';
import OpenAIResponseDisplay from './OpenAIResponseDisplay';

const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(typeof content === 'string' ? content : '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [content]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        width: '100%',
        mb: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1.5,
          maxWidth: isUser ? { xs: '85%', sm: '70%', md: '60%' } : '100%'
        }}
      >
        {/* AVATAR */}
        {!isUser && (
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.5,
              fontSize: 14,
              fontWeight: 700,
              color: '#FFF'
            }}
          >
            AI
          </Box>
        )}

        <Box sx={{ width: '100%' }}>
          {/* USER BUBBLE */}
          {isUser ? (
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.5,
                borderRadius: 3,
                bgcolor: '#7C3AED',
                color: '#FFF',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                fontSize: 14,
                lineHeight: 1.6,
                borderBottomRightRadius: 4
              }}
            >
              {content}
            </Paper>
          ) : (
            /* ASSISTANT BUBBLE */
            <Box
              sx={{
                bgcolor: '#F9FAFB',
                borderRadius: 3,
                border: '1px solid #f3f4f6',
                px: { xs: 2, md: 4 },
                py: 2.5,
                position: 'relative',
                borderBottomLeftRadius: 4,
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              <OpenAIResponseDisplay markdownContent={content} />

              {/* COPY BUTTON */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5, pt: 1, borderTop: '1px solid #f3f4f6' }}>
                <Tooltip title={copied ? 'Copied!' : 'Copy'} arrow>
                  <IconButton
                    size="small"
                    onClick={handleCopy}
                    sx={{
                      color: copied ? '#7C3AED' : '#9CA3AF',
                      width: 28,
                      height: 28,
                      '&:hover': { color: '#5E35B1', bgcolor: '#F5F3FF' }
                    }}
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatMessage;
