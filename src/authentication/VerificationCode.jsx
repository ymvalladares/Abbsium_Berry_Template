import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Alert, Stack, Divider, Chip } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MarkEmailRead, Key } from '@mui/icons-material';

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
        setTimeout(() => {
          navigate('/platform/dashboard');
          setLoading(false);
        }, 1500);
      } else {
        setError('Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        setLoading(false);
      }
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: '100%', lg: '460px' },
        maxWidth: '100%',
          px: { xs: 0, sm: 3 }
        }}
    >
      {/* Mobile: Icon above card */}
      <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5
          }}
        >
          <MarkEmailRead sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 600, letterSpacing: '0.5px' }}>Smart Guide</Typography>
      </Box>

      {/* Card */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: { xs: '24px 18px', sm: '36px 32px' },
          boxShadow: { xs: '0 -4px 30px rgba(0,0,0,0.15)', sm: '0px 10px 40px rgba(0, 0, 0, 0.2)' },
          borderRadius: { xs: '24px 24px 0 0', sm: '24px' },
          width: { xs: '100%', sm: '420px', md: '440px' },
          maxWidth: '100%',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        <Stack alignItems="center" width="100%" mb={2}>
          <Typography sx={{ color: '#1e293b', fontSize: { xs: '22px', sm: '26px' }, fontWeight: 700, mb: 1 }}>Verify Your Email</Typography>

          <Typography sx={{ color: '#94a3b8', fontSize: '14px', fontWeight: 400, textAlign: 'center', lineHeight: 1.6, mb: 1.5 }}>
            We've sent a 6-digit verification code to{' '}
            <Box component="span" sx={{ color: '#7c3aed', fontWeight: 600 }}>
              {email}
            </Box>
            . Please enter it below to continue.
          </Typography>

          <Box
            sx={{
              background: 'linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%)',
              border: '1.5px solid #c4b5fd',
              borderRadius: '12px',
              padding: '10px 20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)',
              transition: 'all 0.3s ease',
              '&:hover': { boxShadow: '0 4px 12px rgba(124, 58, 237, 0.15)', transform: 'translateY(-1px)' }
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Key sx={{ fontSize: 18, color: 'white' }} />
            </Box>
            <Typography sx={{ fontSize: '13px', color: '#6d28d9', fontWeight: 600, letterSpacing: '0.2px' }}>
              Demo Code:{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#7c3aed', fontSize: '14px' }}>
                123456
              </Box>
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2.5 }}>
          <Chip
            label="ENTER CODE"
            sx={{ color: '#7c3aed', backgroundColor: '#fff', px: 2, fontSize: '12px', fontWeight: 600, border: '1.5px solid #7c3aed', borderRadius: '20px' }}
          />
        </Divider>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
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
                width: { xs: '46px', sm: '54px' },
                height: { xs: '54px', sm: '62px' },
                fontSize: '22px',
                fontWeight: 700,
                textAlign: 'center',
                border: '2px solid',
                borderColor: error ? '#d32f2f' : digit ? '#7c3aed' : '#e2e8f0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: loading ? '#f8fafc' : '#fff',
                color: '#1e293b',
                '&:focus': { borderColor: '#7c3aed', boxShadow: '0 0 0 3px rgba(124, 58, 237, 0.1)' },
                '&:disabled': { cursor: 'not-allowed', opacity: 0.6 }
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
            backgroundColor: '#7c3aed',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': { backgroundColor: '#6d28d9', boxShadow: '0 6px 18px rgba(124, 58, 237, 0.45)', transform: 'translateY(-1px)' },
            '&.Mui-disabled': { backgroundColor: '#7c3aed', color: '#fff', opacity: 0.7 }
          }}
        >
          <Box sx={{ visibility: loading ? 'hidden' : 'visible' }}>Confirm</Box>

          {loading && (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BeatLoader size={10} color="#fff" />
            </Box>
          )}
        </Button>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, flexDirection: 'column' }}>
          <Typography sx={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Didn't receive the code?</Typography>

          {canResend ? (
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              sx={{
                fontSize: '14px',
                color: '#7c3aed',
                fontWeight: 600,
                textTransform: 'none',
                padding: 0,
                minWidth: 'auto',
                transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: 'transparent', color: '#6d28d9', textDecoration: 'underline' },
                '&.Mui-disabled': { color: '#94a3b8' }
              }}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>
          ) : (
            <Typography sx={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Resend code in {countdown}s</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default VerificationCode;
