import { createTheme } from '@mui/material/styles';

export const stepperTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
      light: '#f1f5f9',
    },
    success: {
      main: '#10b981',
      light: '#ecfdf5',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: [
      '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'
    ].join(','),
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0f172a',
            borderWidth: '1.5px',
          },
        },
      },
    },
  },
});
