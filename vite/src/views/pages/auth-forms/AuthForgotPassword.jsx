import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';

import { useAuth } from '../../../contexts/AuthContext';

export default function AuthForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await forgotPassword(email);
      console.log(res);
      setSuccess(res.message || 'Email sent successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
    }

    setLoading(false);
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <CustomFormControl fullWidth>
        <InputLabel>Email Address</InputLabel>
        <OutlinedInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" />
      </CustomFormControl>

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading} // ⬅️ bloquea botón
          >
            {loading ? <CircularProgress size={20} color="white" /> : 'Reset password'}
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
