import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Check } from 'lucide-react';

export const HorizontalStepper = React.memo(({ sections, activeSection, onSectionChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        overflowX: 'auto',
        py: 1,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        const isCompleted = index < activeIndex;

        return (
          <React.Fragment key={section.id}>
            {/* Item del Paso */}
            <Box
              onClick={() => onSectionChange(section.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                userSelect: 'none',
                opacity: isActive || isCompleted ? 1 : 0.6,
                transition: 'all 0.2s ease',
                '&:hover': { opacity: 1 },
              }}
            >
              {/* Círculo Indicador */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  bgcolor: isCompleted ? 'success.light' : isActive ? 'primary.main' : 'background.paper',
                  color: isCompleted ? 'success.main' : isActive ? 'background.paper' : 'text.secondary',
                  border: '1px solid',
                  borderColor: isCompleted ? 'success.main' : isActive ? 'primary.main' : 'divider',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.12)' : 'none',
                }}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <Icon sx={{ fontSize: 16 }} />
                )}
              </Box>

              {/* Textos del Paso (Ocultos en móviles pequeños) */}
              {!isMobile && (
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={isActive ? 600 : 500}
                    color={isActive ? 'text.primary' : 'text.secondary'}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {section.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', whiteSpace: 'nowrap', fontSize: '0.75rem', opacity: 0.8 }}
                  >
                    {section.desc}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Línea Conectora entre Pasos */}
            {index < sections.length - 1 && (
              <Box
                sx={{
                  flexGrow: 1,
                  height: '2px',
                  mx: { xs: 1.5, sm: 3 },
                  minWidth: { xs: '20px', sm: '40px' },
                  bgcolor: index < activeIndex ? 'success.main' : 'divider',
                  transition: 'background-color 0.4s ease',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
});

HorizontalStepper.displayName = 'HorizontalStepper';
