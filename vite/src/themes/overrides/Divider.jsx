// ==============================|| OVERRIDES - DIVIDER ||============================== //

export default function Divider(theme) {
  const dividerColor = theme?.vars?.palette?.divider || theme?.palette?.divider || 'rgba(0, 0, 0, 0.12)';
  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: dividerColor
        }
      }
    }
  };
}
