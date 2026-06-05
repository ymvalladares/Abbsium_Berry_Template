import { useState } from 'react';
import { Box, IconButton, Popover, Typography } from '@mui/material';

const categories = [
  {
    label: 'Faces',
    emojis: ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😋', '😛', '😜', '🤔', '🤗', '🙃', '😏', '😒', '😔', '😢', '😭', '😤', '😡', '🥺', '😎', '🤩'],
  },
  {
    label: 'Gestures',
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '✋', '👏', '🙌', '🤲', '🤝', '🙏', '💪', '🖕'],
  },
  {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '💖', '💗', '💝', '💘', '❤️‍🔥'],
  },
  {
    label: 'Symbols',
    emojis: ['🎉', '🎊', '🎈', '🔥', '⭐', '✨', '💯', '✅', '❌', '❓', '❗', '🚀', '💀', '☠️', '👀', '🗿'],
  },
];

const EmojiPicker = ({ anchorEl, onClose, onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', bottom: 'bottom' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2.5,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            width: 280,
          },
        },
      }}
    >
      <Box sx={{ p: 1, borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 0.5, overflowX: 'auto' }}>
        {categories.map((cat, idx) => (
          <Box
            key={cat.label}
            onClick={() => setActiveCategory(idx)}
            sx={{
              px: 1, py: 0.5, borderRadius: '6px', cursor: 'pointer',
              bgcolor: activeCategory === idx ? '#F3E8FF' : 'transparent',
              fontSize: '0.75rem', whiteSpace: 'nowrap',
              color: activeCategory === idx ? '#8B5CF6' : '#475569',
              fontWeight: activeCategory === idx ? 600 : 500,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#F3E8FF' },
            }}
          >
            {cat.label}
          </Box>
        ))}
      </Box>
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 0.3, p: 1.5,
        maxHeight: 180, overflowY: 'auto',
      }}>
        {categories[activeCategory].emojis.map((emoji) => (
          <Box
            key={emoji}
            onClick={() => {
              onEmojiSelect(emoji);
              onClose();
            }}
            sx={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '8px', cursor: 'pointer', fontSize: '1.25rem',
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: '#F3E8FF', transform: 'scale(1.2)' },
            }}
          >
            {emoji}
          </Box>
        ))}
      </Box>
    </Popover>
  );
};

export default EmojiPicker;
