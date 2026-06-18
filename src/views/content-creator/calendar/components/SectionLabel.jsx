import { Typography } from '@mui/material';

export default function SectionLabel({ children }) {
  return (
    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: 'text.secondary', mb: 1 }}>{children}</Typography>
  );
}
