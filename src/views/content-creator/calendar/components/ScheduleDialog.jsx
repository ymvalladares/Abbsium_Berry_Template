import React, { useState, useRef } from 'react';
import { Box, Typography, IconButton, Dialog, DialogContent, TextField, Button, alpha, Tooltip, CircularProgress } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Close, CloudUpload, CalendarToday, AccessTime, CheckCircle } from '@mui/icons-material';
import { PLATFORMS } from '../constants';
import { socialAPI } from '../../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';

export default function ScheduleDialog({ open, onClose, onSave }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();
  const fileInputRef = useRef(null);

  const [selPlats, setSelPlats] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const togglePlatform = (id) => setSelPlats((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelPlats([]);
    setTitle('');
    setCaption('');
    setDate('');
    setTime('');
    setUploading(false);
    setUploadProgress(0);
    if (onClose) onClose();
  };

  const handleSave = async () => {
    if (selPlats.length === 0) {
      notify.warning('Select at least one platform', 'No Platform');
      return;
    }
    if (!date || !time) {
      notify.warning('Please select date and time', 'Missing Schedule');
      return;
    }
    if (!title.trim() && !caption.trim()) {
      notify.warning('Add a title or caption', 'Missing Content');
      return;
    }

    const scheduledDate = new Date(`${date}T${time}`);
    const now = new Date();
    if (scheduledDate <= now) {
      notify.warning('Please select a future date and time', 'Invalid Schedule');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let s3Url = null;

      if (selectedFile) {
        const presignedResponse = await socialAPI.getPresignedUrl(selectedFile.name, selectedFile.type);
        const data = presignedResponse.data;
        const uploadUrl = data.url || data.Url;
        const key = data.key || data.Key;
        const contentType = data.contentType || data.ContentType || selectedFile.type;

        await socialAPI.uploadToS3(uploadUrl, selectedFile, contentType, (percent) => {
          setUploadProgress(percent);
        });

        s3Url = data.publicUrl || data.PublicUrl;
        if (!s3Url) {
          const baseUrl = import.meta.env.VITE_S3_PUBLIC_URL || 'https://s3.amazonaws.com/abbsiumapp/';
          s3Url = `${baseUrl}${key}`;
        }
      }

      const platformNames = selPlats
        .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
        .filter(Boolean);

      const payload = {
        videoUrl: s3Url,
        title: title.trim(),
        caption: caption.trim(),
        platforms: platformNames,
        isShort: false,
        scheduleType: 'scheduled',
        scheduledFor: scheduledDate.toISOString()
      };

      const response = await socialAPI.publishAsync(payload);

      if (response.data.status === 'scheduled') {
        notify.success(`Post scheduled for ${new Date(response.data.scheduledFor).toLocaleString()}`, 'Post Scheduled');
        window.dispatchEvent(new Event('refresh-scheduled-posts'));
        if (onSave) onSave({ title, caption, platforms: selPlats, date, time });
        handleClose();
      } else {
        notify.error('Failed to schedule post', 'Schedule Error');
      }
    } catch (err) {
      console.error('Schedule error:', err);
      notify.error(err.response?.data?.message || 'Failed to schedule post', 'Schedule Error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const sharedInputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: isDark ? '#1e293b' : '#F9FAFB',
      transition: 'all 0.2s ease',
      '& fieldset': { borderColor: isDark ? '#475569' : '#E5E7EB' },
      '&:hover fieldset': { borderColor: isDark ? '#64748b' : '#D1D5DB' },
      '&.Mui-focused fieldset': { borderColor: '#5E35B1', borderWidth: '2px' }
    }
  };

  const dateTimeInputStyle = {
    ...sharedInputStyle,
    position: 'relative',
    '& input[type="date"]::-webkit-calendar-picker-indicator, & input[type="time"]::-webkit-calendar-picker-indicator': {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer'
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: isDark ? '#111827' : undefined
        }
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#111827' }}>
          Schedule Post
        </Typography>
        <IconButton onClick={handleClose} size="small" sx={{ bgcolor: isDark ? '#334155' : '#F3F4F6', '&:hover': { bgcolor: isDark ? '#475569' : '#E5E7EB' } }}>
          <Close fontSize="small" sx={{ color: isDark ? '#94a3b8' : '#4B5563' }} />
        </IconButton>
      </Box>

      {/* BODY */}
      <DialogContent sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', gap: 2.5, overflow: 'hidden' }}>
        {/* DROPZONE */}
        <Box
          onClick={() => fileInputRef.current?.click()}
          sx={{
            height: '140px',
            border: '2px dashed',
            borderColor: selectedFile ? '#10b981' : (isDark ? '#475569' : '#D1D5DB'),
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: selectedFile ? (isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.05)') : (isDark ? '#1e293b' : '#FAFAFA'),
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': { borderColor: selectedFile ? '#10b981' : '#5E35B1', bgcolor: selectedFile ? (isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)') : (isDark ? 'rgba(94,53,177,0.1)' : '#F5F3FF') }
          }}
        >
          <input type="file" ref={fileInputRef} hidden accept="video/*,image/*" onChange={handleFileChange} />
          {selectedFile ? (
            <>
              <CloudUpload sx={{ fontSize: 32, color: '#10b981', mb: 0.5 }} />
              <Typography sx={{ fontWeight: 600, color: '#10b981', fontSize: '0.85rem', textAlign: 'center', px: 1 }}>{selectedFile.name}</Typography>
              <Typography sx={{ color: isDark ? '#64748b' : '#9CA3AF', fontSize: '0.65rem'}}>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</Typography>
            </>
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 40, color: isDark ? '#64748b' : '#9CA3AF', mb: 1 }} />
              <Typography sx={{ fontWeight: 600, color: isDark ? '#cbd5e1' : '#4B5563', fontSize: '0.85rem' }}>Upload Video</Typography>
              <Typography sx={{ color: isDark ? '#64748b' : '#9CA3AF', fontSize: '0.7rem' }}>MP4, MOV, JPG, PNG up to 50MB</Typography>
            </>
          )}
        </Box>

        {/* PLATFORMS */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: isDark ? '#e2e8f0' : '#374151' }}>
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
                      borderColor: isSelected ? '#5E35B1' : (isDark ? '#475569' : '#E5E7EB'),
                      bgcolor: isSelected ? (isDark ? 'rgba(94,53,177,0.2)' : 'rgba(94,53,177,0.08)') : 'transparent',
                      transition: 'all 0.2s',
                      position: 'relative',
                      boxShadow: isSelected ? (isDark ? '0 0 0 1px #5E35B1' : '0 0 0 1px #5E35B1') : 'none',
                      '&:hover': { borderColor: isSelected ? '#5E35B1' : (isDark ? '#94a3b8' : '#9CA3AF') }
                    }}
                  >
                    <p.icon size={22} style={{ color: isSelected ? '#5E35B1' : (isDark ? '#64748b' : '#9CA3AF') }} />
                    {isSelected && (
                      <CheckCircle sx={{ fontSize: 12, color: '#5E35B1', position: 'absolute', top: -3, right: -3, bgcolor: isDark ? '#111827' : '#fff', borderRadius: '50%' }} />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>

        {/* FORM */}
        <TextField fullWidth label="Title" size="small" value={title} onChange={(e) => setTitle(e.target.value)} sx={sharedInputStyle} />
        <TextField fullWidth multiline rows={3} label="Caption" size="small" value={caption} onChange={(e) => setCaption(e.target.value)} sx={sharedInputStyle} />

        {/* DATE & TIME */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="date"
            label="Date"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <CalendarToday sx={{ fontSize: 18, mr: 1, color: isDark ? '#94a3b8' : '#6B7280', pointerEvents: 'none' }} /> }}
            inputProps={{ min: new Date().toISOString().split('T')[0] }}
            sx={dateTimeInputStyle}
          />
          <TextField
            fullWidth
            type="time"
            label="Time"
            size="small"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <AccessTime sx={{ fontSize: 18, mr: 1, color: isDark ? '#94a3b8' : '#6B7280', pointerEvents: 'none' }} /> }}
            sx={dateTimeInputStyle}
          />
        </Box>

        {/* UPLOAD PROGRESS */}
        {uploading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CircularProgress size={20} sx={{ color: '#5E35B1' }} />
            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
              Uploading... {uploadProgress}%
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* FOOTER */}
      <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2, borderTop: '1px solid', borderColor: isDark ? '#334155' : '#F3F4F6' }}>
        <Button onClick={handleClose} sx={{ color: isDark ? '#94a3b8' : '#4B5563', textTransform: 'none', fontWeight: 600 }} disabled={uploading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disableElevation
          disabled={uploading}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            fontWeight: 600,
            bgcolor: '#5E35B1',
            '&:hover': { bgcolor: '#4C2A8E' }
          }}
        >
          {uploading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Schedule Post'}
        </Button>
      </Box>
    </Dialog>
  );
}
