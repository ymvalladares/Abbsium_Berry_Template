import React, { useState } from 'react';
import { IconButton, Popover, Box, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const languages = [
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/us.svg' },
  { code: 'es', label: 'Spanish', flag: 'https://flagcdn.com/es.svg' },
  { code: 'fr', label: 'French', flag: 'https://flagcdn.com/fr.svg' },
  { code: 'de', label: 'German', flag: 'https://flagcdn.com/de.svg' }
];

export default function LanguageSelector() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLang, setSelectedLang] = useState(languages[0]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (lang) => {
    setSelectedLang(lang);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick} size="large" sx={{ p: 0, mr: 1 }}>
        <Box component="img" src={selectedLang.flag} alt={selectedLang.label} sx={{ width: 28, height: 20, objectFit: 'cover' }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            p: 1,
            backgroundColor: '#fff', // Fondo blanco
            boxShadow: 3,
            borderRadius: 1,
            mt: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {languages.map((lang) => (
            <Box
              key={lang.code}
              onClick={() => handleSelect(lang)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } // hover muy sutil
              }}
            >
              <Box component="img" src={lang.flag} alt={lang.label} sx={{ width: 28, height: 20, objectFit: 'cover' }} />
              <Typography variant="body2">{lang.label}</Typography>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}
