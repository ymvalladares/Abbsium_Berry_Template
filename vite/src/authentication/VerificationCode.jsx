import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Alert, Stack, Divider, Chip } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerificationCode = ({ email, onResendCode }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verificar cuando se complete el código
    if (index === 5 && value) {
      const fullCode = [...newCode.slice(0, 5), value].join('');
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newCode = [...code];
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);

        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();

        if (digits.length === 6) {
          handleVerify(digits.join(''));
        }
      });
    }
  };

  const handleVerify = async (verificationCode) => {
    const codeToVerify = verificationCode || code.join('');

    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      if (codeToVerify === '123456') {
        setSuccess('Verification successful! Redirecting...');
        setTimeout(() => {
          navigate('/platform/dashboard');
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
      setLoading(false);
    }, 1000);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      await onResendCode?.();
      setSuccess('A new verification code has been sent to your email');
      setCountdown(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 0, sm: 2 },
        py: { xs: 0, sm: 3 }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: { xs: 4, sm: 5 },
          boxShadow: { xs: 'none', sm: '0px 10px 40px rgba(0, 0, 0, 0.2)' },
          borderRadius: 6,
          width: {
            xs: '400px',
            sm: '440px',
            md: '460px'
          },
          maxWidth: '100%',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        <Stack alignItems="center" width="100%" mb={2}>
          <Typography
            sx={{
              color: '#0399DF',
              fontSize: { xs: '24px', sm: '28px' },
              fontWeight: 700,
              mb: 1
            }}
          >
            Verify Your Email
          </Typography>

          <Typography
            sx={{
              color: '#64748b',
              fontSize: '14px',
              fontWeight: 400,
              textAlign: 'center',
              lineHeight: 1.6,
              mb: 1.5
            }}
          >
            We've sent a 6-digit verification code to{' '}
            <Box component="span" sx={{ color: '#0399DF', fontWeight: 600 }}>
              {email}
            </Box>
            . Please enter it below to continue.
          </Typography>

          <Box
            sx={{
              background: 'linear-gradient(135deg, #E3F2FD 0%, #F0F9FF 100%)',
              border: '2px solid #0399DF',
              borderRadius: '12px',
              padding: '10px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0 2px 8px rgba(3, 153, 223, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(3, 153, 223, 0.25)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: '#0399DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Typography sx={{ fontSize: '16px' }}>💡</Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#0288cc',
                fontWeight: 600,
                letterSpacing: '0.2px'
              }}
            >
              Demo Code:{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#0399DF', fontSize: '14px' }}>
                123456
              </Box>
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2.5 }}>
          <Chip
            label="ENTER CODE"
            sx={{
              color: '#0399DF',
              backgroundColor: '#fff',
              px: 2,
              fontSize: '13px',
              fontWeight: 600,
              border: '2px solid #0399DF',
              borderRadius: '20px'
            }}
          />
        </Divider>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              fontSize: 13,
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                fontSize: '20px'
              }
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2.5,
              fontSize: 13,
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                fontSize: '20px'
              }
            }}
          >
            {success}
          </Alert>
        )}

        <Stack direction="row" spacing={1.5} justifyContent="center" mb={3}>
          {code.map((digit, index) => (
            <Box
              key={index}
              component="input"
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              sx={{
                width: { xs: '48px', sm: '56px' },
                height: { xs: '56px', sm: '64px' },
                fontSize: '24px',
                fontWeight: 700,
                textAlign: 'center',
                border: '2px solid',
                borderColor: error ? '#d32f2f' : digit ? '#0399DF' : '#e2e8f0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: loading ? '#f8fafc' : '#fff',
                color: '#1e293b',
                '&:focus': {
                  borderColor: '#0399DF',
                  boxShadow: '0 0 0 3px rgba(3, 153, 223, 0.1)'
                },
                '&:disabled': {
                  cursor: 'not-allowed',
                  opacity: 0.6
                }
              }}
            />
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          onClick={() => handleVerify()}
          disabled={loading || code.join('').length !== 6}
          sx={{
            mb: 2,
            height: 48,
            fontSize: '15px',
            fontWeight: 600,
            textTransform: 'none',
            backgroundColor: '#0399DF',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(3, 153, 223, 0.3)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#0288cc',
              boxShadow: '0 6px 16px rgba(3, 153, 223, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&.Mui-disabled': {
              backgroundColor: '#0399DF',
              color: '#fff',
              opacity: 0.7
            }
          }}
        >
          <Box sx={{ visibility: loading ? 'hidden' : 'visible' }}>Verify Code</Box>

          {loading && (
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BeatLoader size={10} color="#fff" />
            </Box>
          )}
        </Button>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            flexDirection: 'column'
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 500
            }}
          >
            Didn't receive the code?
          </Typography>

          {canResend ? (
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              sx={{
                fontSize: '14px',
                color: '#0399DF',
                fontWeight: 600,
                textTransform: 'none',
                padding: 0,
                minWidth: 'auto',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#0288cc',
                  textDecoration: 'underline'
                },
                '&.Mui-disabled': {
                  color: '#94a3b8'
                }
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>
          ) : (
            <Typography
              sx={{
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: 500
              }}
            >
              Resend code in {countdown}s
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VerificationCode;
