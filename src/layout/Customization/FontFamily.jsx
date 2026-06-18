import { useColorScheme } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

export default function FontFamilyPage() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const {
    state: { fontFamily },
    setField
  } = useConfig();

  const handleFontChange = (event) => {
    setField('fontFamily', event.target.value);
  };

  const fonts = [
    {
      id: 'inter',
      value: `'Inter', sans-serif`,
      label: 'Inter'
    },
    {
      id: 'poppins',
      value: `'Poppins', sans-serif`,
      label: 'Poppins'
    },
    {
      id: 'roboto',
      value: `'Roboto', sans-serif`,
      label: 'Roboto'
    }
  ];

  return (
    <Stack sx={{ p: 2, gap: 2.5 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>FONT STYLE</Typography>
      <RadioGroup aria-label="payment-card" name="payment-card" value={fontFamily} onChange={handleFontChange}>
        <Grid container spacing={1.25}>
          {fonts.map((item, index) => {
            const selected = fontFamily === item.value;
            return (
              <Grid key={index} size={12}>
                <MainCard
                  content={false}
                  sx={{
                    p: 0.75,
                    bgcolor: selected ? (isDark ? 'rgba(139,92,246,0.15)' : 'primary.light') : (isDark ? '#1e293b' : 'grey.50')
                  }}
                >
                  <MainCard
                    content={false}
                    border
                    sx={{
                      p: 1.75,
                      borderWidth: 1,
                      borderColor: selected ? (isDark ? '#8b5cf6' : 'primary.main') : (isDark ? '#334155' : undefined)
                    }}
                  >
                    <FormControlLabel
                      sx={{ width: 1 }}
                      control={<Radio value={item.value} sx={{ display: 'none' }} />}
                      label={
                        <Typography variant="h5" sx={{ pl: 2, fontFamily: item.value, color: isDark ? '#e2e8f0' : undefined }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </MainCard>
                </MainCard>
              </Grid>
            );
          })}
        </Grid>
      </RadioGroup>
    </Stack>
  );
}
