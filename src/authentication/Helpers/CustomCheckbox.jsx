import { Checkbox, FormControlLabel } from '@mui/material';
import { useField } from 'formik';

const CustomCheckbox = ({ label, ...props }) => {
  const [field] = useField(props);

  return (
    <FormControlLabel
      control={<Checkbox {...field} checked={field.value} size="small" sx={{ color: '#64748b', '&.Mui-checked': { color: '#0399DF' } }} />}
      label="Remember Me"
      sx={{
        ml: 0,
        '& .MuiFormControlLabel-label': { fontSize: '13px', color: '#64748b', fontWeight: 500, userSelect: 'none' }
      }}
    />
  );
};
export default CustomCheckbox;
