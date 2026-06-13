import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton, Dialog, DialogContent, TextField, Button, alpha, Tooltip } from '@mui/material';
import { Close, CloudUpload, CalendarToday, AccessTime } from '@mui/icons-material';
import { PLATFORMS } from '../constants';

// Estilos globales unificados para inputs
const sharedInputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#F9FAFB',
    transition: 'all 0.2s ease',
    '& fieldset': { borderColor: '#E5E7EB' },
    '&:hover fieldset': { borderColor: '#D1D5DB' },
    '&.Mui-focused fieldset': { borderColor: '#5E35B1', borderWidth: '2px' }
  }
};

// Truco profesional para ocultar el feo icono nativo del navegador en Date/Time
const dateTimeInputStyle = {
  ...sharedInputStyle,
  position: 'relative',
  '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="time"]::-webkit-calendar-picker-indicator': {
    opacity: 0, // Oculta el icono feo del navegador
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer' // Hace que todo el input sea clickeable
  }
};

export default function ScheduleDialog({ open, onClose, onSave }) {
  const [selPlats, setSelPlats] = useState([]);
  const fileInputRef = useRef(null);

  const togglePlatform = (id) => setSelPlats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '90vh', // Evita que crezca más allá de la pantalla
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' // Bloquea el scroll general
        }
      }}
    >
      {/* HEADER COMPACTO */}
      <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
          Schedule Post
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#F3F4F6', '&:hover': { bgcolor: '#E5E7EB' } }}>
          <Close fontSize="small" sx={{ color: '#4B5563' }} />
        </IconButton>
      </Box>

      {/* CUERPO DEL MODAL (Sin Scroll forzado) */}
      <DialogContent sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', gap: 2.5, overflow: 'hidden' }}>
        {/* DROPZONE INTACTO (Tu versión) */}
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            height: '140px',
            border: '2px dashed #D1D5DB',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#FAFAFA',
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { borderColor: '#5E35B1', bgcolor: '#F5F3FF' }
          }}
        >
          <input type="file" ref={fileInputRef} hidden accept="video/*" />
          <CloudUpload sx={{ fontSize: 40, color: '#9CA3AF', mb: 1 }} />
          <Typography sx={{ fontWeight: 600, color: '#4B5563', fontSize: '0.85rem' }}>Upload Video</Typography>
          <Typography sx={{ color: '#9CA3AF', fontSize: '0.7rem' }}>MP4, MOV up to 50MB</Typography>
        </Box>

        {/* REDES SOCIALES */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#374151' }}>
            Platforms
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {PLATFORMS.map((p) => {
              const isSelected = selPlats.includes(p.id);
              return (
                <Tooltip key={p.id} title={p.name} arrow placement="top">
                  <Box
                    onClick={() => togglePlatform(p.id)}
                    sx={{
                      p: 1.2,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? p.color : '#E5E7EB',
                      bgcolor: isSelected ? alpha(p.color, 0.1) : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: p.color }
                    }}
                  >
                    <p.icon size={22} style={{ color: isSelected ? p.color : '#9CA3AF' }} />
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* FORMULARIO */}
        <TextField fullWidth label="Title" size="small" sx={sharedInputStyle} />
        <TextField fullWidth multiline rows={3} label="Caption" size="small" sx={sharedInputStyle} />

        {/* DATE & TIME (Arreglados y sin iconos nativos feos) */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarToday sx={{ fontSize: 18, mr: 1, color: '#6B7280', pointerEvents: 'none' }} /> }}
            sx={dateTimeInputStyle}
          />
          <TextField
            fullWidth
            type="time"
            label="Time"
            size="small"
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <AccessTime sx={{ fontSize: 18, mr: 1, color: '#6B7280', pointerEvents: 'none' }} /> }}
            sx={dateTimeInputStyle}
          />
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, borderTop: '1px solid #F3F4F6' }}>
        <Button onClick={onClose} sx={{ color: '#4B5563', textTransform: 'none', fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          disableElevation
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            fontWeight: 600,
            bgcolor: '#5E35B1',
            '&:hover': { bgcolor: '#4C2A8E' }
          }}
        >
          Schedule Post
        </Button>
      </Box>
    </Dialog>
  );
}
