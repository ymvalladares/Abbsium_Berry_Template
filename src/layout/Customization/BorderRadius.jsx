import { useColorScheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useConfig from 'hooks/useConfig';

function valueText(value) {
  return `${value}px`;
}

export default function BorderRadius() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const {
    state: { borderRadius },
    setField
  } = useConfig();

  const handleChange = (_event, newValue) => {
    setField('borderRadius', newValue);
  };

  return (
    <Stack sx={{ pl: 2, pb: 2, pr: 4, gap: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>BORDER RADIUS</Typography>
      <Grid container spacing={1.25} sx={{ pt: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Grid>
          <Typography variant="subtitle2" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>4px</Typography>
        </Grid>
        <Grid size="grow">
          <Slider
            size="small"
            value={borderRadius}
            onChange={handleChange}
            getAriaValueText={valueText}
            valueLabelDisplay="on"
            aria-labelledby="discrete-slider-small-steps"
            min={4}
            max={24}
            color="primary"
            sx={{
              '& .MuiSlider-valueLabel': { color: isDark ? '#8b5cf6' : 'primary.light' }
            }}
          />
        </Grid>
        <Grid>
          <Typography variant="subtitle2" sx={{ color: isDark ? '#94a3b8' : 'text.secondary' }}>24px</Typography>
        </Grid>
      </Grid>
    </Stack>
  );
}
