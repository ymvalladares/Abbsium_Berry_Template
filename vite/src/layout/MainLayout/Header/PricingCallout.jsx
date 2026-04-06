import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';

const sparkle = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg);   opacity: 1;   }
  25%       { transform: scale(1.2) rotate(15deg); opacity: 0.8; }
  50%       { transform: scale(0.9) rotate(-10deg); opacity: 1;  }
  75%       { transform: scale(1.15) rotate(8deg);  opacity: 0.9;}
`;

const borderRun = keyframes`
  0%   { background-position: 0% 50%;   }
  100% { background-position: 200% 50%; }
`;

const PricingCallout = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    navigate('/platform/pricing');
  };

  return (
    <Box
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        ml: 1,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '7px',
        px: '14px',
        py: '9px',
        borderRadius: '10px',
        cursor: 'pointer',
        overflow: 'hidden',
        isolation: 'isolate',
        bgcolor: hovered ? '#6366f1' : '#f5f3ff',
        transition: 'background .25s ease',

        // animated gradient border via outline trick
        outline: '2.5px solid transparent',
        outlineOffset: '-1.5px',

        // pseudo border glow
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '10px',
          padding: '1.5px',
          background: hovered
            ? 'linear-gradient(90deg,#818cf8,#6366f1,#4f46e5,#818cf8)'
            : 'linear-gradient(90deg,#c7d2fe,#a5b4fc,#818cf8,#c7d2fe)',
          backgroundSize: '200% 100%',
          animation: `${borderRun} 2.5s linear infinite`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }
      }}
    >
      {/* Icon */}
      <AutoAwesomeIcon
        sx={{
          fontSize: '15px',
          color: hovered ? '#fff' : '#6366f1',
          transition: 'color .25s',
          animation: `${sparkle} 2.2s ease-in-out infinite`,
          flexShrink: 0
        }}
      />

      {/* Label */}
      <Typography
        sx={{
          fontSize: '12.5px',
          fontWeight: 600,
          letterSpacing: '.01em',
          color: hovered ? '#fff' : '#4f46e5',
          userSelect: 'none',
          transition: 'color .25s',
          lineHeight: 1,
          whiteSpace: 'nowrap'
        }}
      >
        View Plans
      </Typography>
    </Box>
  );
};

export default PricingCallout;
