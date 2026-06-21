export default function CssBaseline() {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--app-content-width': '80%'
        }
      }
    }
  };
}
