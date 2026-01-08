// material-ui
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import logo from 'assets/images/abbsium192.png';

export default function Logo() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 0.5
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Abbsium Logo"
          sx={{
            height: 25,
            width: 25,
            mr: 1.5
          }}
        />

        <Typography
          variant="h6"
          sx={{
            lineHeight: 1,
            fontSize: '1.0rem'
          }}
        >
          Abbsium
        </Typography>
      </Box>
    </>
  );
}
