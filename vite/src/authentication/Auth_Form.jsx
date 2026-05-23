import React, { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Schema_Login_Validation, Schema_ForgetPassword_Validation } from './Helpers/SchemaValidation';
import Input_Fields from './Helpers/Input_Fields';
import CustomCheckbox from './Helpers/CustomCheckbox';
import { Box, Button, Chip, Divider, Stack, Typography, Alert } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import api from '../services/AxiosService';

const FORM_FIELDS = [
  { name: 'email', label: 'E-mail', type: 'email', action: ['login', 'register', 'forgetPassword'] },
  { name: 'username', label: 'Username', type: 'text', action: ['register'] },
  { name: 'password', label: 'Password', type: 'password', action: ['login', 'register'] }
];

const V = {
  login: { title: 'Sign In Abbsium', submit: 'Log In', altText: "Don't have an account?", altAction: 'Sign Up', altMode: 'register' },
  register: { title: 'Sign Up Abbsium', submit: 'Create Account', altText: 'Already have an account?', altAction: 'Sign In', altMode: 'login' },
  forgetPassword: { title: 'Reset Password', submit: 'Send Reset Email', altText: '', altAction: 'Back to Sign In', altMode: 'login' }
};

const INITIAL_VALUES = {
  email: 'demo@gmail.com',
  password: 'Demo.2020',
  username: '',
  remember_me: false
};

const Auth_Form = ({ onSuccess }) => {
  const [userAction, setUserAction] = useState('login');
  const [authError, setAuthError] = useState(null);
  const [authMessage, setAuthMessage] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { authenticate, authLoading, googleLogin } = useAuth();

  const isLoading = authLoading || googleLoading;
  const ui = V[userAction];

  const filteredInputs = useMemo(() => FORM_FIELDS.filter((f) => f.action.includes(userAction)), [userAction]);

  const validationSchema = useMemo(
    () => (userAction === 'forgetPassword' ? Schema_ForgetPassword_Validation : Schema_Login_Validation),
    [userAction]
  );

  const handleSubmit = async (values) => {
    const result = await authenticate(userAction, values);

    if (result?.success) {
      setAuthError(null);
      if (userAction === 'login') {
        onSuccess?.(values.email);
      } else if (userAction === 'register') {
        setAuthMessage(result?.message || 'Registration successful! Please check your email to confirm your account.');
      } else if (userAction === 'forgetPassword') {
        setAuthMessage('Password reset link sent! Check your inbox.');
      }
    } else {
      setAuthMessage(null);
      setAuthError(result?.message || 'An error occurred. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      const res = await api.post('/account/google-login', JSON.stringify(credentialResponse.credential));
      googleLogin(res.data);
      onSuccess?.(res.data.email);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  useGoogleOneTapLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setAuthError('Google sign-in failed. Please try again.')
  });

  const switchMode = (mode) => {
    setAuthError(null);
    setAuthMessage(null);
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
            {ui.title}
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

        {(userAction === 'login' || userAction === 'register') && (
          <Box sx={{ width: '100%', mt: 2, mb: 1, overflow: 'hidden' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setAuthError('Google sign-in failed. Please try again.')}
              width="100%"
              theme="outline"
              size="large"
              text={userAction === 'login' ? 'signin_with' : 'signup_with'}
              shape="rectangular"
            />
          </Box>
        )}

        {userAction !== 'forgetPassword' && (
          <>
            <Divider sx={{ my: 2 }}>
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
              key={userAction}
              initialValues={INITIAL_VALUES}
              validationSchema={validationSchema}
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
                        '& .MuiAlert-icon': { fontSize: '20px' }
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
                        '& .MuiAlert-icon': { fontSize: '20px' }
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
                    disabled={isLoading}
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
                    <Box sx={{ visibility: isLoading ? 'hidden' : 'visible' }}>{ui.submit}</Box>

                    {isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
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
          </>
        )}

        {userAction === 'forgetPassword' && (
          <Formik
            key="forgetPassword"
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
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
                      '& .MuiAlert-icon': { fontSize: '20px' }
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
                      '& .MuiAlert-icon': { fontSize: '20px' }
                    }}
                  >
                    {authMessage}
                  </Alert>
                )}

                <Input_Fields key="email" name="email" label="E-mail" type="email" />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    mt: 3,
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
                  <Box sx={{ visibility: isLoading ? 'hidden' : 'visible' }}>{ui.submit}</Box>

                  {isLoading && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
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
        )}

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

        {userAction !== 'login' && (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%" sx={{ mt: 2 }}>
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
              onClick={() => switchMode('login')}
            >
              Back to Sign In
            </Typography>
          </Box>
        )}

        {userAction === 'login' && (
          <>
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
                {ui.altText}
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
                onClick={() => switchMode(ui.altMode)}
              >
                {ui.altAction}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Auth_Form;