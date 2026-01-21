import React from 'react';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import { Bolt } from '@mui/icons-material';

export default function AbbsiumHero() {
  const login = () => {
    window.location.href = '/authenticate';
  };
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: '100vh', md: 'auto' },
        background:
          'radial-gradient(800px circle at 20% -10%, rgba(102,126,234,0.14), transparent 45%), radial-gradient(700px circle at 90% 10%, rgba(118,75,162,0.14), transparent 45%), linear-gradient(180deg, #FCFCFF 0%, #ffffff 75%)'
      }}
    >
      {/* SHAPE 1 */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '60%', md: 140 },
          right: { xs: '50%', md: -180 },
          transform: {
            xs: 'translateX(50%) rotate(8deg)',
            md: 'rotate(10deg)'
          },
          width: { xs: 260, md: 420 },
          height: { xs: 260, md: 420 },
          borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(102,126,234,0.14), rgba(118,75,162,0.14))',
          filter: { xs: 'blur(20px)', md: 'blur(2px)' },
          zIndex: 0
        }}
      />

      {/* SHAPE 2 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '-120px', md: -200 },
          left: { xs: '50%', md: -160 },
          transform: {
            xs: 'translateX(-50%) rotate(-6deg)',
            md: 'rotate(-8deg)'
          },
          width: { xs: 300, md: 520 },
          height: { xs: 200, md: 520 },
          borderRadius: '40px',
          background: 'linear-gradient(135deg, rgba(245,87,108,0.08), rgba(102,126,234,0.12))',
          filter: { xs: 'blur(30px)', md: 'blur(4px)' },
          zIndex: 0
        }}
      />

      <Container maxWidth="lg" sx={{ height: { xs: '100%', md: 'auto' } }}>
        <Box
          sx={{
            minHeight: { xs: '90vh', md: '76vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: { xs: 'center', md: 'flex-start' },
            gap: { xs: 6, md: 9 },
            py: { xs: 8, md: 14 },
            px: { xs: 3, md: 0 },
            position: 'relative',
            zIndex: 1,
            mt: { xs: 0, md: 5 }
          }}
        >
          {/* TEXT */}
          <Box
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              maxWidth: { xs: '100%', md: '50%' }
            }}
          >
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#7c83ff',
                mb: 1.5
              }}
            >
              CREATOR-FIRST PLATFORM
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '2.1rem', sm: '2.4rem', md: 'clamp(2.5rem, 4.8vw, 3.8rem)' },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#0f172a',
                mb: 2,
                ml: { xs: 0, md: 2 }
              }}
            >
              A calmer way to
              <br />
              build and share content
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
                lineHeight: 1.8,
                color: '#5b6b85',
                maxWidth: { xs: '100%', md: 520 },
                mx: { xs: 'auto', md: 0 },
                mb: 4,
                ml: { xs: 0, md: 2 }
              }}
            >
              Abbsium brings planning, creation and publishing into one focused workspace — helping you move faster without feeling
              overwhelmed.
            </Typography>

            <Stack
              direction="column"
              spacing={2}
              sx={{
                alignItems: 'stretch',
                mx: { xs: 'auto', md: 0 },
                maxWidth: { xs: '100%', md: 'none' }
              }}
            >
              <Button
                startIcon={<Bolt />}
                onClick={login}
                sx={{
                  width: { xs: '100%', md: 'auto' },
                  px: 4,
                  py: 1.6,
                  borderRadius: '999px',
                  fontWeight: 700,
                  textTransform: 'none',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 14px 36px rgba(102,126,234,0.35)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Get started
              </Button>
            </Stack>
          </Box>

          {/* VISUAL — hidden on very small screens */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: { md: 'absolute' },
              right: { md: 0 },
              top: { md: '50%' },
              transform: { md: 'translateY(-50%)' },
              width: { md: '45%' },
              height: 360,
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(102,126,234,0.14), rgba(118,75,162,0.14))',
              boxShadow: '0 30px 80px rgba(102,126,234,0.22)'
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
