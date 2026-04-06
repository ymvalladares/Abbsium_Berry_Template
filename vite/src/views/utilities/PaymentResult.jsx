import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { keyframes } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/AxiosService';

const scaleIn = keyframes`
  0%   { transform: scale(0.85); opacity: 0; }
  100% { transform: scale(1);    opacity: 1; }
`;

const checkDraw = keyframes`
  0%   { stroke-dashoffset: 100; }
  100% { stroke-dashoffset: 0;   }
`;

const floatUp = keyframes`
  0%, 100% { transform: translateY(0);   }
  50%       { transform: translateY(-6px);}
`;

const ripple = keyframes`
  0%   { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0;   }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0);   }
  20%       { transform: translateX(-6px);}
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px);}
  80%       { transform: translateX(4px); }
`;

const SuccessIllustration = () => (
  <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto', mb: 3 }}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '1.5px solid #6366f1',
          opacity: 0,
          animation: `${ripple} 2.4s ease-out ${i * 0.6}s infinite`
        }}
      />
    ))}
    <Box
      sx={{
        position: 'absolute',
        inset: 12,
        borderRadius: '50%',
        bgcolor: '#eef2ff',
        animation: `${floatUp} 3s ease-in-out infinite`
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        inset: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${floatUp} 3s ease-in-out infinite`
      }}
    >
      <CheckCircleOutlineIcon
        sx={{
          fontSize: '52px',
          color: '#6366f1',
          '& path': {
            strokeDasharray: 100,
            animation: `${checkDraw} .8s ease forwards .2s`
          }
        }}
      />
    </Box>
  </Box>
);

const FailedIllustration = () => (
  <Box sx={{ position: 'relative', width: 110, height: 110, mx: 'auto', mb: 3 }}>
    <Box
      sx={{
        position: 'absolute',
        inset: 12,
        borderRadius: '50%',
        bgcolor: '#fff1f2'
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        inset: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: `${shake} .6s ease .3s both`
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: '52px', color: '#f43f5e' }} />
    </Box>
  </Box>
);

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('failed');
      return;
    }

    api
      .post('order/verify', { sessionId })
      .then(({ data }) => {
        setOrder(data);
        setStatus('success');
      })
      .catch(() => setStatus('failed'));
  }, []);

  const isSuccess = status === 'success';
  const isLoading = status === 'loading';

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(15, 15, 25, 0.55)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1400,
        p: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: '#fff',
          borderRadius: '20px',
          p: '40px 36px 32px',
          textAlign: 'center',
          animation: `${scaleIn} .35s cubic-bezier(.34,1.56,.64,1) both`,
          border: isSuccess ? '1px solid rgba(99,102,241,.15)' : '1px solid rgba(244,63,94,.12)'
        }}
      >
        {isLoading ? (
          <Box sx={{ py: 4 }}>
            <Typography sx={{ fontSize: '14px', color: '#a0aec0' }}>Verifying payment...</Typography>
          </Box>
        ) : (
          <>
            {isSuccess ? <SuccessIllustration /> : <FailedIllustration />}

            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: isSuccess ? '#1a202c' : '#f43f5e',
                letterSpacing: '-.03em',
                mb: '8px'
              }}
            >
              {isSuccess ? 'Payment successful!' : 'Payment not processed'}
            </Typography>

            <Typography
              sx={{
                fontSize: '13.5px',
                color: '#718096',
                lineHeight: 1.6,
                mb: '28px',
                px: 1
              }}
            >
              {isSuccess
                ? `Your ${order?.serviceType ?? ''} plan is now active. You'll receive a confirmation email shortly.`
                : 'Something went wrong while processing your payment. You have not been charged. Please try again.'}
            </Typography>

            <Box sx={{ height: '1px', bgcolor: '#f1f5f9', mb: '24px' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isSuccess ? (
                <>
                  <Button
                    fullWidth
                    onClick={() => navigate('/platform/dashboard')}
                    sx={{
                      py: '11px',
                      bgcolor: '#6366f1',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '13.5px',
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#4f46e5' }
                    }}
                  >
                    Go to dashboard
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => navigate('/platform/pricing')}
                    sx={{
                      py: '11px',
                      color: '#a0aec0',
                      fontWeight: 500,
                      fontSize: '13px',
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { color: '#718096', bgcolor: '#f8fafc' }
                    }}
                  >
                    Back to pricing
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    fullWidth
                    onClick={() => navigate('/platform/pricing')}
                    sx={{
                      py: '11px',
                      bgcolor: '#f43f5e',
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '13.5px',
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#e11d48' }
                    }}
                  >
                    Try again
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => navigate('/platform/dashboard')}
                    sx={{
                      py: '11px',
                      color: '#a0aec0',
                      fontWeight: 500,
                      fontSize: '13px',
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { color: '#718096', bgcolor: '#f8fafc' }
                    }}
                  >
                    Back to home
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PaymentResult;
