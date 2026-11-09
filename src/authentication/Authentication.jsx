import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Auth_Form from './Auth_Form';
import VerificationCode from './VerificationCode';
import AuthLeftPanel from './AuthLeftPanel';
import { useAuth } from '../contexts/AuthContext';

const Authentication = () => {
  const navigate = useNavigate();
  const { isAuthenticated, resendLoginCode } = useAuth();
  const [step, setStep] = useState('login');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/platform/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = (userEmail) => {
    setEmail(userEmail);
    setStep('verify');
  };

  const handleResendCode = async () => {
    return await resendLoginCode(email);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 35%, #6d28d9 60%, #4c1d95 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: { xs: 'center', lg: 'stretch' },
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          display: { xs: 'none', lg: 'block' }
        },
        '@keyframes gridMove': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' }
        }
      }}
    >
      {/* Floating Bubbles */}
      {[
        { size: 100, top: '5%', left: '8%', delay: 0 },
        { size: 140, top: '12%', left: '28%', delay: 2 },
        { size: 75, top: '22%', left: '45%', delay: 1.5 },
        { size: 85, top: '35%', left: '12%', delay: 3 },
        { size: 120, top: '48%', left: '38%', delay: 0.5 },
        { size: 95, top: '62%', left: '18%', delay: 2.5 },
        { size: 110, top: '75%', left: '35%', delay: 4 },
        { size: 70, top: '88%', left: '25%', delay: 1.8 },
        { size: 90, bottom: '15%', left: '8%', delay: 3.5 },
        { size: 80, bottom: '30%', left: '42%', delay: 4.5 },
        { size: 105, bottom: '45%', left: '15%', delay: 2.2 },
        { size: 65, bottom: '8%', left: '38%', delay: 1 }
      ].map((bubble, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: `float${index} 6s ease-in-out infinite`,
            animationDelay: `${bubble.delay}s`,
            display: 'block',
            ...(bubble.top && { top: bubble.top }),
            ...(bubble.bottom && { bottom: bubble.bottom }),
            ...(bubble.left && { left: bubble.left }),
            [`@keyframes float${index}`]: {
              '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
              '25%': { transform: 'translateY(-20px) translateX(10px) scale(1.05)' },
              '50%': { transform: 'translateY(-10px) translateX(-10px) scale(0.95)' },
              '75%': { transform: 'translateY(-30px) translateX(5px) scale(1.02)' }
            }
          }}
        />
      ))}

      <AuthLeftPanel />

      {/* Mobile: Full screen centered layout / Desktop: Right side form */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: 'center',
          justifyContent: { xs: 'flex-end', lg: 'flex-start' },
          width: { xs: '100%', lg: 'auto' },
          minHeight: { xs: '100dvh', lg: 'auto' },
          px: { xs: 0, lg: '6%' },
          py: { lg: 4 }
        }}
      >
        {step === 'login' && <Auth_Form onSuccess={handleLoginSuccess} />}
        {step === 'verify' && <VerificationCode email={email} onResendCode={handleResendCode} />}
      </Box>
    </Box>
  );
};

export default Authentication;
