import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Formik, Form } from 'formik';
import { Schema_Login_Validation, Schema_ForgetPassword_Validation } from './Helpers/SchemaValidation';
import Input_Fields from './Helpers/Input_Fields';
import CustomCheckbox from './Helpers/CustomCheckbox';
import { Box, Button, Chip, Divider, Stack, Typography, Alert, createTheme, ThemeProvider } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/AxiosService';
import { Lock } from '@mui/icons-material';

const FORM_FIELDS = [
  { name: 'email', label: 'E-mail', type: 'email', action: ['login', 'register', 'forgetPassword'] },
  { name: 'username', label: 'Username', type: 'text', action: ['register'] },
  { name: 'password', label: 'Password', type: 'password', action: ['login', 'register'] }
];

const V = {
  login: { title: 'Welcome back', subtitle: "Let's pick up where you spark left off", submit: 'Log In', altText: "Don't have an account?", altAction: 'Sign Up', altMode: 'register' },
  register: {
    title: 'Welcome back',
    subtitle: 'Create your account to get started',
    submit: 'Sign Up',
    altText: 'Already have an account?',
    altAction: 'Sign In',
    altMode: 'login'
  },
  forgetPassword: { title: 'Reset Password', subtitle: 'Enter your email to receive a reset link', submit: 'Send Reset Email', altText: '', altAction: 'Back to Sign In', altMode: 'login' }
};

const INITIAL_VALUES = {
  email: 'demo@gmail.com',
  password: 'Demo.2020',
  username: '',
  remember_me: false
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30000;

const Auth_Form = ({ onSuccess }) => {
  const [userAction, setUserAction] = useState('login');
  const [authError, setAuthError] = useState(null);
  const [authMessage, setAuthMessage] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);

  const { authenticate, authLoading, googleLogin } = useAuth();
  const googleTimeoutRef = useRef(null);

  React.useEffect(() => {
    return () => {
      if (googleTimeoutRef.current) clearTimeout(googleTimeoutRef.current);
    };
  }, []);

  const handleGoogleCredential = useCallback(
    async (credentialResponse) => {
      setGoogleLoading(true);
      setAuthError(null);
      try {
        const res = await api.post('/account/google-login', JSON.stringify(credentialResponse.credential), {
          headers: { 'Content-Type': 'application/json' }
        });
        googleLogin(res.data);
        onSuccess?.(res.data.email);
      } catch (err) {
        setAuthError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
        if (googleTimeoutRef.current) clearTimeout(googleTimeoutRef.current);
      }
    },
    [googleLogin, onSuccess]
  );

  const triggerGoogleSignIn = useCallback(() => {
    if (typeof window.google === 'undefined') {
      setAuthError('Google Sign-In is not available. Please refresh the page.');
      return;
    }
    setAuthError(null);
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false
    });

    window.google.accounts.id.renderButton(document.getElementById('google-btn-hidden'), { theme: 'outline', size: 'large', width: 1 });
    setTimeout(() => {
      const btn = document.getElementById('google-btn-hidden')?.querySelector('div[role=button]');
      if (btn) {
        btn.click();
      } else {
        setAuthError('Could not open Google sign-in. Please try again.');
      }
    }, 100);

    googleTimeoutRef.current = setTimeout(() => {
      setGoogleLoading(false);
      setAuthError('Google sign-in timed out. Please try again.');
    }, 30000);
  }, [handleGoogleCredential]);

  const isRateLimited = useCallback(() => {
    if (Date.now() < lockedUntil) return true;
    if (attemptCount >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_MS);
      setAttemptCount(0);
      return true;
    }
    return false;
  }, [attemptCount, lockedUntil]);

  const handleSubmit = async (values) => {
    if (isRateLimited()) {
      setAuthError('Too many attempts. Please wait a moment before trying again.');
      return;
    }

    const result = await authenticate(userAction, values);

    if (result?.success) {
      setAuthError(null);
      setAttemptCount(0);
      if (userAction === 'login') {
        onSuccess?.(values.email);
      } else if (userAction === 'register') {
        setAuthMessage('Registration successful! Please check your email to confirm your account.');
      } else if (userAction === 'forgetPassword') {
        setAuthMessage('If an account exists with that email, a reset link has been sent.');
      }
    } else {
      setAuthMessage(null);

      if (result?.data?.IsLockedOut && result?.data?.LockoutEnd) {
        const lockoutEnd = new Date(result.data.LockoutEnd).getTime();
        setLockedUntil(lockoutEnd);
        setAttemptCount(0);
      } else {
        setAttemptCount((prev) => prev + 1);
      }

      setAuthError(result?.message || 'Invalid credentials. Please try again.');
    }
  };

  const switchMode = useCallback((mode) => {
    setAuthError(null);
    setAuthMessage(null);
    setAttemptCount(0);
    setLockedUntil(0);
    setUserAction(mode);
  }, []);

  const isLoading = authLoading || googleLoading;
  const ui = V[userAction];

  const filteredInputs = useMemo(() => FORM_FIELDS.filter((f) => f.action.includes(userAction)), [userAction]);

  const validationSchema = useMemo(
    () => (userAction === 'forgetPassword' ? Schema_ForgetPassword_Validation : Schema_Login_Validation),
    [userAction]
  );

  const remainingLockout = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));

  const lightTheme = useMemo(
    () =>
      createTheme({
        colorSchemes: {
          light: {
            palette: {
              primary: { main: '#7c3aed' },
              background: { default: '#ffffff', paper: '#ffffff' },
              text: { primary: '#1e293b', secondary: '#64748b' }
            }
          }
        }
      }),
    []
  );

  return (
    <ThemeProvider theme={lightTheme}>
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
        {/* Mobile: Logo icon + title above card */}
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
            <Lock sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 600, letterSpacing: '0.5px' }}>Smart Guide</Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '24px 18px', sm: '36px 32px' },
            boxShadow: { xs: '0 -4px 30px rgba(0,0,0,0.15)', sm: '0px 10px 40px rgba(0,0,0,0.2)' },
            borderRadius: { xs: '24px 24px 0 0', sm: '24px' },
            width: { xs: '100%', sm: '420px', md: '440px' },
            maxWidth: '100%',
            backgroundColor: '#ffffff',
            position: 'relative',
            borderTop: { xs: 'none', sm: '1px solid rgba(255,255,255,0.1)' }
          }}
        >
          {/* Title */}
          <Stack alignItems="center" width="100%" mb={0.5}>
            <Typography sx={{ color: '#1e293b', fontSize: { xs: '22px', sm: '26px' }, fontWeight: 700, mb: 0.5 }}>{ui.title}</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '14px', fontWeight: 400, textAlign: 'center' }}>{ui.subtitle}</Typography>
          </Stack>

          {/* Google button */}
          {(userAction === 'login' || userAction === 'register') && (
            <Box sx={{ width: '100%', mt: 2.5, mb: 1 }}>
              <Box id="google-btn-hidden" sx={{ display: 'none' }} />
              <Button
                fullWidth
                onClick={triggerGoogleSignIn}
                disabled={isLoading}
                sx={{
                  height: 48,
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0',
                  background: '#fff',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  gap: 1.5,
                  px: 2,
                  justifyContent: 'center',
                  transition: 'all 0.25s ease',
                  '&:hover': { background: '#f8fafc', borderColor: '#cbd5e1', transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' },
                  '&:active': { transform: 'translateY(0)' },
                  '&.Mui-disabled': { background: '#f1f5f9', color: '#94a3b8', borderColor: '#e2e8f0' }
                }}
              >
                {googleLoading ? (
                  <BeatLoader size={8} color="#94a3b8" />
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    {userAction === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                  </>
                )}
              </Button>
            </Box>
          )}

          {userAction !== 'forgetPassword' && (
            <>
              <Divider sx={{ my: 2 }}>
                <Chip
                  label="OR"
                  sx={{ color: '#7c3aed', backgroundColor: '#fff', px: 2, fontSize: '12px', fontWeight: 600, border: '1.5px solid #7c3aed', borderRadius: '20px' }}
                />
              </Divider>

              <Formik key={userAction} initialValues={INITIAL_VALUES} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {({ resetForm }) => (
                  <Form style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

                    {authError && (
                      <Alert severity="error" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
                        {authError}
                        {remainingLockout > 0 && ` (${remainingLockout}s remaining)`}
                      </Alert>
                    )}
                    {authMessage && (
                      <Alert severity="success" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
                        {authMessage}
                      </Alert>
                    )}

                    {filteredInputs.map((f) => (
                      <Input_Fields key={f.name} {...f} />
                    ))}

                    {userAction === 'login' && (
                      <Box sx={{ mt: 0.5, mb: 1.5 }}>
                        <CustomCheckbox name="remember_me" type="checkbox" />
                      </Box>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading || remainingLockout > 0}
                      sx={{
                        mt: 1,
                        mb: 2,
                        height: 48,
                        fontSize: '15px',
                        fontWeight: 600,
                        textTransform: 'none',
                        backgroundColor: '#7c3aed',
                        borderRadius: '12px',
                        boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': { backgroundColor: '#6d28d9', boxShadow: '0 6px 18px rgba(124,58,237,0.45)', transform: 'translateY(-1px)' },
                        '&.Mui-disabled': { backgroundColor: '#7c3aed', color: '#fff', opacity: 0.7 }
                      }}
                    >
                      <Box sx={{ visibility: isLoading ? 'hidden' : 'visible' }}>{ui.submit}</Box>
                      {isLoading && (
                        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <Formik key="forgetPassword" initialValues={{ email: '' }} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {() => (
                <Form style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

                  {authError && (
                    <Alert severity="error" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
                      {authError}
                    </Alert>
                  )}
                  {authMessage && (
                    <Alert severity="success" sx={{ mb: 2, fontSize: 13, borderRadius: '10px', '& .MuiAlert-icon': { fontSize: '18px' } }}>
                      {authMessage}
                    </Alert>
                  )}

                  <Input_Fields key="email" name="email" label="E-mail" type="email" />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading || remainingLockout > 0}
                    sx={{
                      mt: 3,
                      mb: 2,
                      height: 48,
                      fontSize: '15px',
                      fontWeight: 600,
                      textTransform: 'none',
                      backgroundColor: '#7c3aed',
                      borderRadius: '12px',
                      boxShadow: '0 4px 14px rgba(124,58,237,0.35)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': { backgroundColor: '#6d28d9', boxShadow: '0 6px 18px rgba(124,58,237,0.45)', transform: 'translateY(-1px)' },
                      '&.Mui-disabled': { backgroundColor: '#7c3aed', color: '#fff', opacity: 0.7 }
                    }}
                  >
                    <Box sx={{ visibility: isLoading ? 'hidden' : 'visible' }}>{ui.submit}</Box>
                    {isLoading && (
                      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BeatLoader size={10} color="#fff" />
                      </Box>
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {userAction === 'login' && (
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: '13px', color: '#94a3b8', fontWeight: 500 }}>Forgot password?</Typography>
              <Typography
                sx={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease', '&:hover': { color: '#6d28d9', textDecoration: 'underline' } }}
                onClick={() => switchMode('forgetPassword')}
              >
                Reset Password
              </Typography>
            </Box>
          )}

          {userAction !== 'login' && (
            <Box display="flex" justifyContent="center" alignItems="center" width="100%" sx={{ mt: 1.5 }}>
              <Typography
                sx={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s ease', '&:hover': { color: '#6d28d9', textDecoration: 'underline' } }}
                onClick={() => switchMode('login')}
              >
                Back to Sign In
              </Typography>
            </Box>
          )}

          {userAction === 'login' && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>{ui.altText}</Typography>
                <Typography
                  sx={{ fontSize: '14px', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', '&:hover': { color: '#6d28d9', textDecoration: 'underline' } }}
                  onClick={() => switchMode(ui.altMode)}
                >
                  {ui.altAction}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Auth_Form;
