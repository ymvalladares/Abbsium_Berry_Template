import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Container, Chip } from '@mui/material';
import { Lock, Security, Shield, CheckCircle } from '@mui/icons-material';
import Auth_Form from './Auth_Form';

const Authentication = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
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
          animation: 'gridMove 20s linear infinite'
        },
        '@keyframes gridMove': {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(50px, 50px)' }
        }
      }}
    >
      {/* Floating Bubbles - Only on left side */}
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
            display: { xs: 'none', lg: 'block' },
            ...(bubble.top && { top: bubble.top }),
            ...(bubble.bottom && { bottom: bubble.bottom }),
            ...(bubble.left && { left: bubble.left }),
            [`@keyframes float${index}`]: {
              '0%, 100%': {
                transform: 'translateY(0) translateX(0) scale(1)'
              },
              '25%': {
                transform: 'translateY(-20px) translateX(10px) scale(1.05)'
              },
              '50%': {
                transform: 'translateY(-10px) translateX(-10px) scale(0.95)'
              },
              '75%': {
                transform: 'translateY(-30px) translateX(5px) scale(1.02)'
              }
            }
          }}
        />
      ))}

      {/* Left Content - Original Design Centered More to Right */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'absolute',
          left: '15%',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          maxWidth: '450px',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            animation: 'fadeInLeft 0.8s ease-out',
            '@keyframes fadeInLeft': {
              from: {
                opacity: 0,
                transform: 'translateX(-30px)'
              },
              to: {
                opacity: 1,
                transform: 'translateX(0)'
              }
            }
          }}
        >
          {/* Illustration Circle */}
          <Box
            sx={{
              width: 200,
              height: 200,
              margin: '0 auto 3rem',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 3s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 0 0 0 rgba(255,255,255,0.4)'
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 0 20px rgba(255,255,255,0)'
                  }
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
                <Lock sx={{ fontSize: 60, color: 'white' }} />
              </Box>
            </Box>
          </Box>

          <Typography
            variant="h3"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              textShadow: '0 2px 20px rgba(0,0,0,0.2)',
              fontSize: '2.5rem'
            }}
          >
            Secure Access
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              fontWeight: 300,
              mb: 4,
              fontSize: '1.1rem'
            }}
          >
            Enterprise-grade security with seamless authentication for your business
          </Typography>

          {/* Features */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              mb: 3
            }}
          >
            {['256-bit encryption', 'Two-factor authentication', '24/7 security monitoring'].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  color: 'white'
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle sx={{ fontSize: 16 }} />
                </Box>
                <Typography variant="body1">{feature}</Typography>
              </Box>
            ))}
          </Box>

          {/* Security Badges */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              mt: 4
            }}
          >
            <Chip
              icon={<Shield sx={{ color: 'white !important' }} />}
              label="SSL Secured"
              sx={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 500,
                px: 1
              }}
            />
            <Chip
              icon={<Security sx={{ color: 'white !important' }} />}
              label="GDPR Compliant"
              sx={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                fontWeight: 500,
                px: 1
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', lg: 'flex-end' },
          width: '100%',
          px: { xs: 0, lg: '6%' }
        }}
      >
        <Auth_Form />
      </Box>
    </Box>
  );
};

export default Authentication;
