import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Formik, Form } from 'formik';
import { Schema_Login_Validation, Schema_ForgetPassword_Validation } from './Helpers/SchemaValidation';
import Input_Fields from './Helpers/Input_Fields';
import CustomCheckbox from './Helpers/CustomCheckbox';
import { Box, Button, Chip, Divider, Stack, Typography, Alert } from '@mui/material';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/AxiosService';

const FORM_FIELDS = [
  { name: 'email', label: 'E-mail', type: 'email', action: ['login', 'register', 'forgetPassword'] },
  { name: 'username', label: 'Username', type: 'text', action: ['register'] },
  { name: 'password', label: 'Password', type: 'password', action: ['login', 'register'] }
];

const V = {
  login: { title: 'Sign In Abbsium', submit: 'Log In', altText: "Don't have an account?", altAction: 'Sign Up', altMode: 'register' },
  register: {
    title: 'Sign Up Abbsium',
    submit: 'Create Account',
    altText: 'Already have an account?',
    altAction: 'Sign In',
    altMode: 'login'
  },
  forgetPassword: { title: 'Reset Password', submit: 'Send Reset Email', altText: '', altAction: 'Back to Sign In', altMode: 'login' }
};

const INITIAL_VALUES = {
  email: 'demo@gmail.com',
  password: 'Demo.2020',
  username: '',
  remember_me: false
};

// Rate limiting config
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

  // Clear Google timeout on unmount
  React.useEffect(() => {
    return () => {
      if (googleTimeoutRef.current) clearTimeout(googleTimeoutRef.current);
    };
  }, []);

  // ── Google Sign-In (GIS credential flow) ────────────────────────────────────
  const handleGoogleCredential = useCallback(async (credentialResponse) => {
    setGoogleLoading(true);
    setAuthError(null);
    try {
      const res = await api.post(
        '/account/google-login',
        JSON.stringify(credentialResponse.credential),
        { headers: { 'Content-Type': 'application/json' } }
      );
      googleLogin(res.data);
      onSuccess?.(res.data.email);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
      if (googleTimeoutRef.current) clearTimeout(googleTimeoutRef.current);
    }
  }, [googleLogin, onSuccess]);

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

    // Timeout fallback — if Google doesn't respond within 30s, reset loading
    googleTimeoutRef.current = setTimeout(() => {
      setGoogleLoading(false);
      setAuthError('Google sign-in timed out. Please try again.');
    }, 30000);
  }, [handleGoogleCredential]);

  // ── Rate limiting check ─────────────────────────────────────────────────────
  const isRateLimited = useCallback(() => {
    if (Date.now() < lockedUntil) return true;
    if (attemptCount >= MAX_ATTEMPTS) {
      setLockedUntil(Date.now() + LOCKOUT_MS);
      setAttemptCount(0);
      return true;
    }
    return false;
  }, [attemptCount, lockedUntil]);

  // ── Form submit ─────────────────────────────────────────────────────────────
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
      setAttemptCount((prev) => prev + 1);
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

  // Remaining lockout time
  const remainingLockout = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));

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
          boxShadow: { xs: 'none', sm: '0px 10px 40px rgba(0,0,0,0.2)' },
          borderRadius: 6,
          width: { xs: '400px', sm: '440px', md: '460px' },
          maxWidth: '100%',
          backgroundColor: '#ffffff',
          position: 'relative'
        }}
      >
        <Stack alignItems="center" width="100%" mb={1}>
          <Typography sx={{ color: '#0399DF', fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700, mb: 1 }}>{ui.title}</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '15px', fontWeight: 400 }}>Enter your credentials to continue</Typography>
        </Stack>

        {/* ── Google button ── */}
        {(userAction === 'login' || userAction === 'register') && (
          <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
            <Box id="google-btn-hidden" sx={{ display: 'none' }} />

            <Button
              fullWidth
              onClick={triggerGoogleSignIn}
              disabled={isLoading}
              sx={{
                height: 48,
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                background: '#fff',
                color: '#64748b',
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'none',
                gap: 1.5,
                px: 2,
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: '#f8fafc',
                  borderColor: '#cbd5e1',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                },
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

            <Formik key={userAction} initialValues={INITIAL_VALUES} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ resetForm }) => (
                <Form style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Honeypot — hidden field to catch bots */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

                  {authError && (
                    <Alert severity="error" sx={{ mb: 2.5, fontSize: 13, borderRadius: '8px', '& .MuiAlert-icon': { fontSize: '20px' } }}>
                      {authError}
                      {remainingLockout > 0 && ` (${remainingLockout}s remaining)`}
                    </Alert>
                  )}
                  {authMessage && (
                    <Alert severity="success" sx={{ mb: 2.5, fontSize: 13, borderRadius: '8px', '& .MuiAlert-icon': { fontSize: '20px' } }}>
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
                    disabled={isLoading || remainingLockout > 0}
                    sx={{
                      mt: 1,
                      mb: 2,
                      height: 48,
                      fontSize: '15px',
                      fontWeight: 600,
                      textTransform: 'none',
                      backgroundColor: '#0399DF',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(3,153,223,0.3)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      '&:hover': { backgroundColor: '#0288cc', boxShadow: '0 6px 16px rgba(3,153,223,0.4)', transform: 'translateY(-1px)' },
                      '&.Mui-disabled': { backgroundColor: '#0399DF', color: '#fff', opacity: 0.7 }
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
                {/* Honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />

                {authError && (
                  <Alert severity="error" sx={{ mb: 2.5, fontSize: 13, borderRadius: '8px', '& .MuiAlert-icon': { fontSize: '20px' } }}>
                    {authError}
                  </Alert>
                )}
                {authMessage && (
                  <Alert severity="success" sx={{ mb: 2.5, fontSize: 13, borderRadius: '8px', '& .MuiAlert-icon': { fontSize: '20px' } }}>
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
                    backgroundColor: '#0399DF',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(3,153,223,0.3)',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': { backgroundColor: '#0288cc', boxShadow: '0 6px 16px rgba(3,153,223,0.4)', transform: 'translateY(-1px)' },
                    '&.Mui-disabled': { backgroundColor: '#0399DF', color: '#fff', opacity: 0.7 }
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
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Forget your password?</Typography>
            <Typography
              sx={{
                color: '#0399DF',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                '&:hover': { color: '#0288cc', textDecoration: 'underline' }
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
                '&:hover': { color: '#0288cc', textDecoration: 'underline' }
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
            <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>{ui.altText}</Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#0399DF',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: '#0288cc', textDecoration: 'underline' }
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
