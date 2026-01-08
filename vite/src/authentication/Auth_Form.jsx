import React, { useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import { Schema_Login_Validation } from './Helpers/SchemaValidation';
import Input_Fields from './Helpers/Input_Fields';
import CustomCheckbox from './Helpers/CustomCheckbox';
import { Box, Button, Chip, Divider, Stack, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { BeatLoader } from 'react-spinners';
import { useAuth } from '../contexts/AuthContext';

const FORM_FIELDS = [
  { name: 'email', label: 'E-mail', type: 'email', action: ['login', 'register', 'forgetPassword'] },
  { name: 'username', label: 'Username', type: 'text', action: ['register'] },
  { name: 'password', label: 'Password', type: 'password', action: ['login', 'register'] }
];

const Auth_Form = () => {
  const [userAction, setUserAction] = useState('login');
  const navigate = useNavigate();

  const { authenticate, authLoading, authError, authMessage, clearAuthFeedback, isAuthenticated } = useAuth();

  const filteredInputs = useMemo(() => FORM_FIELDS.filter((f) => f.action.includes(userAction)), [userAction]);

  const handleSubmit = async (values) => {
    const result = await authenticate(userAction, values);

    if (userAction === 'login' && result?.success) {
      navigate('/platform/dashboard');
    }
  };

  const switchMode = (mode) => {
    clearAuthFeedback();
    setUserAction(mode);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      sx={{ minHeight: { xs: '80vh', md: '90vh' } }}
      px={2}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: { xs: 3, sm: 4 },
          boxShadow: '0px 0px 5px 5px #0399DF',
          borderRadius: '12px',
          width: {
            xs: '100%',
            sm: '400px',
            md: '420px',
            lg: '450px'
          },
          backgroundColor: '#fff'
        }}
      >
        <Stack alignItems="center" width="100%">
          <Typography color="#0399DF" variant="h5" fontWeight="bold">
            {
              {
                login: 'Sign In Abbsium',
                register: 'Sign Up Abbsium',
                forgetPassword: 'Reset Password'
              }[userAction]
            }
          </Typography>

          <Typography variant="caption" fontSize="16px" mb={3}>
            Enter your credentials to continue
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Chip
            label="OR"
            variant="outlined"
            sx={{
              color: '#0399DF',
              px: 2,
              fontWeight: 'bold',
              border: '1px solid  #0399DF'
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
            <Form>
              {/* 🔔 FEEDBACK ARRIBA DEL EMAIL */}
              {authError && (
                <Alert severity="error" sx={{ mb: 2, fontSize: 13 }}>
                  {authError}
                </Alert>
              )}

              {authMessage && (
                <Alert severity="success" sx={{ mb: 2, fontSize: 13 }}>
                  {authMessage}
                </Alert>
              )}

              {filteredInputs.map((f) => (
                <Input_Fields key={f.name} {...f} />
              ))}

              {userAction === 'login' && <CustomCheckbox name="remember_me" type="checkbox" />}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={authLoading}
                sx={{
                  mt: 2,
                  mb: 1,
                  height: 40,
                  fontWeight: 600,
                  textTransform: 'none',
                  backgroundColor: '#0399DF !important',
                  border: '1px solid #0399DF',
                  position: 'relative',
                  '&.Mui-disabled': {
                    backgroundColor: '#0399DF !important',
                    opacity: 0.7
                  }
                }}
              >
                <Box sx={{ visibility: authLoading ? 'hidden' : 'visible' }}>
                  {
                    {
                      login: 'Log In',
                      register: 'Create',
                      forgetPassword: 'Send Email'
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
                    <BeatLoader size={6} color="#fff" />
                  </Box>
                )}
              </Button>
            </Form>
          )}
        </Formik>

        {userAction === 'login' && (
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="caption" fontWeight="bold">
              Forget your password?
            </Typography>
            <Typography
              sx={{ color: '#0399DF', fontWeight: 'bold', cursor: 'pointer', fontSize: 13 }}
              onClick={() => switchMode('forgetPassword')}
            >
              Reset Password
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="caption"
          sx={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => switchMode(userAction === 'login' ? 'register' : 'login')}
        >
          {userAction === 'login' ? "Don't have an account?" : 'Already have an account?'}
        </Typography>
      </Box>
    </Box>
  );
};

export default Auth_Form;
