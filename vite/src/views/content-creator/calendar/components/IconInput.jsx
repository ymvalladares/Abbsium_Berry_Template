import { Box, TextField } from '@mui/material';

export default function IconInput({ icon, sx, ...props }) {
  return (
    <Box sx={{ position: 'relative', flex: 1, ...sx }}>
      <Box sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5E35B1', display: 'flex', zIndex: 1 }}>{icon}</Box>
      <TextField size="small" fullWidth InputLabelProps={{ shrink: true }} {...props}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', pl: '36px', '& fieldset': { borderWidth: '1.5px' }, '&:hover fieldset': { borderColor: '#9C72F8' }, '&.Mui-focused fieldset': { borderColor: '#5E35B1' } } }}
      />
    </Box>
  );
}
