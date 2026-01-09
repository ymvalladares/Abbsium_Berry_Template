import React, { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Schema_Login_Validation } from './Helpers/SchemaValidation';
import Input_Fields from './Helpers/Input_Fields';
import CustomCheckbox from './Helpers/CustomCheckbox';
import { Box, Button, Chip, Divider, Stack, Typography, Alert } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../contexts/AuthContext';

const FORM_FIELDS = [
  { name: 'email', label: 'E-mail', type: 'email', action: ['login', 'register', 'forgetPassword'] },
  { name: 'username', label: 'Username', type: 'text', action: ['register'] },
  { name: 'password', label: 'Password', type: 'password', action: ['login', 'register'] }
];

const Auth_Form = ({ onSuccess }) => {
  const [userAction, setUserAction] = useState('login');

  const { authenticate, authLoading, authError, authMessage } = useAuth();

  const filteredInputs = useMemo(() => FORM_FIELDS.filter((f) => f.action.includes(userAction)), [userAction]);

  const handleSubmit = async (values) => {
    const result = await authenticate(userAction, values);

    console.log('🔍 Authentication result:', result); // Debug

    // ✅ Cambiado: Si es login exitoso, pasar al código de verificación
    if (userAction === 'login' && result?.success) {
      console.log('✅ Login exitoso, mostrando verificación para:', values.email);
      onSuccess?.(values.email);
    }
  };

  const switchMode = (mode) => {
    setUserAction(mode);
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
        <Stack alignItems="center" width="100%" mb={1}>
          <Typography
            sx={{
              color: '#0399DF',
              fontSize: { xs: '24px', sm: '28px' },
              fontWeight: 700,
              mb: 1
            }}
          >
            {
              {
                login: 'Sign In Abbsium',
                register: 'Sign Up Abbsium',
                forgetPassword: 'Reset Password'
              }[userAction]
            }
          </Typography>

          <Typography
            sx={{
              color: '#64748b',
              fontSize: '15px',
              fontWeight: 400
            }}
          >
            Enter your credentials to continue
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Chip
            label="OR"
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

        <Formik
          initialValues={{
            email: 'demo@gmail.com',
            password: 'Demo.2020',
            username: ''
          }}
          validationSchema={Schema_Login_Validation}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {authError && (
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
                  {authError}
                </Alert>
              )}

              {authMessage && (
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
                  {authMessage}
                </Alert>
              )}

              {filteredInputs.map((f) => (
                <Input_Fields key={f.name} {...f} />
              ))}

              {userAction === 'login' && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <CustomCheckbox name="remember_me" type="checkbox" />
                </Box>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={authLoading}
                sx={{
                  mt: 1,
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
                <Box sx={{ visibility: authLoading ? 'hidden' : 'visible' }}>
                  {
                    {
                      login: 'Log In',
                      register: 'Create Account',
                      forgetPassword: 'Send Reset Email'
                    }[userAction]
                  }
                </Box>

                {authLoading && (
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
            </Form>
          )}
        </Formik>

        {userAction === 'login' && (
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: 500
              }}
            >
              Forget your password?
            </Typography>
            <Typography
              sx={{
                color: '#0399DF',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#0288cc',
                  textDecoration: 'underline'
                }
              }}
              onClick={() => switchMode('forgetPassword')}
            >
              Reset Password
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              color: '#64748b',
              fontWeight: 500
            }}
          >
            {userAction === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#0399DF',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#0288cc',
                textDecoration: 'underline'
              }
            }}
            onClick={() => switchMode(userAction === 'login' ? 'register' : 'login')}
          >
            {userAction === 'login' ? 'Sign Up' : 'Sign In'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Auth_Form;
