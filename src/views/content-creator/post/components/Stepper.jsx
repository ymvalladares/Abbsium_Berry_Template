import React from 'react';
import { Box, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { IconCheck } from '@tabler/icons-react';

const STEP_LABELS = ['Platforms', 'Content', 'Review'];

export default function Stepper({ step }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
      {STEP_LABELS.map((label, i) => {
        const isActive = i === step;
        const isCompleted = i < step;
        const isLast = i === STEP_LABELS.length - 1;
        return (
          <React.Fragment key={label}>
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: isActive ? '#3b82f6' : isCompleted ? '#4CAF50' : isDark ? '#374151' : '#e5e7eb',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                {isCompleted ? <IconCheck size={12} /> : i + 1}
              </Box>
              <Typography
                sx={{
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.75rem',
                  color: isActive ? 'text.primary' : isCompleted ? 'text.primary' : 'text.secondary',
                  whiteSpace: 'nowrap'
                }}
              >
                {label}
              </Typography>
            </Box>
            {!isLast && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  mx: 1,
                  borderRadius: 1,
                  bgcolor: i < step ? '#4CAF50' : isDark ? '#374151' : '#e5e7eb',
                  transition: 'all 0.3s ease',
                  maxWidth: 60
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
}
