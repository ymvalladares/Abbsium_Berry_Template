import React, { useMemo } from 'react';
import { Box } from '@mui/material';

const CONFETTI_COLORS = ['#3b82f6', '#E4405F', '#1877F2', '#FF9800', '#4CAF50', '#FF0000', '#2563eb', '#FCAF45'];

const CONFETTI_STYLES = `
  @keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes gradientSlide {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes bounceIn {
    0% { transform: scale(0); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;

const PIECE_DATA = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 2,
  duration: 2 + Math.random() * 2,
  color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
  size: 4 + Math.random() * 6,
  rotation: Math.random() * 360
}));

export default function Confetti() {
  const pieces = useMemo(() => PIECE_DATA, []);

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -10,
            width: p.size,
            height: p.size * 1.5,
            bgcolor: p.color,
            borderRadius: 1,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{CONFETTI_STYLES}</style>
    </Box>
  );
}

export { CONFETTI_STYLES };
