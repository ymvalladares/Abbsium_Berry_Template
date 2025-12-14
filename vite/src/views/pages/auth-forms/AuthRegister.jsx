import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomFormControl from 'ui-component/extended/Form/CustomFormControl';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import api from '../../../services/AxiosService';

export default function AuthRegister() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(true);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState(null);

  const handlePasswordChange = (value) => {
    setPassword(value);
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await api.post('account/register', {
        username,
        email,
        password
      });
      console.log(res);
      setSuccess(res.message || 'User registered successfully');
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

      <Stack sx={{ mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle1">Sign up with Email</Typography>
      </Stack>

      <CustomFormControl fullWidth>
        <InputLabel>Username</InputLabel>
        <OutlinedInput type="text" value={username} onChange={(e) => setUsername(e.target.value)} label="Username" />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel>Email Address</InputLabel>
        <OutlinedInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" />
      </CustomFormControl>

      <CustomFormControl fullWidth>
        <InputLabel>Password</InputLabel>
        <OutlinedInput
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="large">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </CustomFormControl>

      {strength !== 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ width: 85, height: 8, borderRadius: '7px', bgcolor: level?.color }} />
            <Typography variant="subtitle1" sx={{ fontSize: '0.75rem' }}>
              {level?.label}
            </Typography>
          </Stack>
        </Box>
      )}

      <FormControlLabel
        control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
        label={
          <Typography variant="subtitle1">
            Agree with{' '}
            <Typography variant="subtitle1" component={Link} to="#">
              Terms & Conditions
            </Typography>
          </Typography>
        }
      />

      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" variant="contained" color="secondary" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Sign up'}
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
