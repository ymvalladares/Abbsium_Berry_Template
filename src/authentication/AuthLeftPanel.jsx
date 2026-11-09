import React from 'react';
import { Box } from '@mui/material';
import { Lock } from '@mui/icons-material';

const AuthLeftPanel = () => {
  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 350,
          height: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'rotate 20s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            animation: 'rotateReverse 25s linear infinite',
            '@keyframes rotateReverse': {
              '0%': { transform: 'rotate(360deg)' },
              '100%': { transform: 'rotate(0deg)' }
            }
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 250,
            height: 250,
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            animation: 'rotate 30s linear infinite',
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />

        <Box
          sx={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'pulse 3s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(255,255,255,0.4)' },
              '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 25px rgba(255,255,255,0)' }
            }
          }}
        >
          <Box
            sx={{
              width: '85%',
              height: '85%',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Lock sx={{ fontSize: 70, color: 'white' }} />
          </Box>
        </Box>

        {[
          { size: 12, orbit: 175, delay: 0 },
          { size: 10, orbit: 175, delay: 5 },
          { size: 8, orbit: 150, delay: 2 },
          { size: 10, orbit: 150, delay: 7 }
        ].map((dot, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.4)',
              animation: `orbit${index} ${20 + index * 5}s linear infinite`,
              animationDelay: `${dot.delay}s`,
              [`@keyframes orbit${index}`]: {
                '0%': { transform: `rotate(0deg) translateX(${dot.orbit}px) rotate(0deg)` },
                '100%': { transform: `rotate(360deg) translateX(${dot.orbit}px) rotate(-360deg)` }
              }
            }}
          />
        ))}
      </Box>

      {[
        { size: 80, top: '15%', left: '20%', delay: 0 },
        { size: 60, top: '25%', left: '70%', delay: 1 },
        { size: 100, top: '60%', left: '15%', delay: 2 },
        { size: 70, top: '70%', left: '75%', delay: 1.5 },
        { size: 50, top: '40%', left: '85%', delay: 2.5 },
        { size: 90, top: '80%', left: '45%', delay: 3 },
        { size: 55, top: '10%', left: '50%', delay: 0.5 },
        { size: 65, top: '45%', left: '25%', delay: 1.8 },
        { size: 45, top: '85%', left: '80%', delay: 2.2 },
        { size: 75, top: '5%', left: '85%', delay: 1.2 }
      ].map((bubble, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            animation: `float${index} 6s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            top: bubble.top,
            left: bubble.left,
            [`@keyframes float${index}`]: {
              '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
              '25%': { transform: 'translateY(-15px) translateX(8px) scale(1.03)' },
              '50%': { transform: 'translateY(-8px) translateX(-8px) scale(0.97)' },
              '75%': { transform: 'translateY(-20px) translateX(5px) scale(1.02)' }
            }
          }}
        />
      ))}
    </Box>
  );
};

export default AuthLeftPanel;
