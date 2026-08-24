import { InputAdornment, TextField, Typography } from '@mui/material';
import { useField } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React from 'react';

const Input_Fields = ({ label, animate = false, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = React.useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <TextField
        {...field}
        autoComplete={props.autoComplete || 'off'}
        type={props.type == 'password' && showPassword ? 'password' : 'text'}
        id={props.key}
        size="small"
        focused
        required
        error={meta.touched && meta.error ? true : false}
        label={label}
        sx={{
          padding: '4px',
          mt: 1,
          '& input': {
            fontSize: '16px' // ✅ CLAVE: evita zoom en mobile
          },
          ...(animate && {
            animation: 'inputGlow 1.4s ease-out',
            '@keyframes inputGlow': {
              '0%': { boxShadow: '0 0 0 5px rgba(124,58,237,0.22)' },
              '100%': { boxShadow: '0 0 0 5px rgba(124,58,237,0)' }
            }
          })
        }}
        InputProps={
          props.type == 'password'
            ? {
                endAdornment: (
                  <InputAdornment
                    sx={{
                      cursor: 'pointer'
                    }}
                    position="end"
                    onClick={handleClickShowPassword}
                  >
                    {!showPassword ? <Visibility /> : <VisibilityOff />}
                  </InputAdornment>
                )
              }
            : {}
        }
      />
      {meta.touched && meta.error && (
        <Typography variant="caption" fontWeight="bold" sx={{ textAlign: 'center', color: 'red' }}>
          {meta.error}
        </Typography>
      )}
    </>
  );
};
export default Input_Fields;
