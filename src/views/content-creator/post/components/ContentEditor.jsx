import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import {
  IconUpload,
  IconX,
  IconPhoto,
  IconVideo,
  IconFileText,
  IconSparkles,
  IconAlertCircle
} from '@tabler/icons-react';

const TYPES = [
  { id: 'post', label: 'Post', icon: IconPhoto },
  { id: 'reel', label: 'Reel', icon: IconVideo },
  { id: 'video', label: 'Video', icon: IconFileText }
];

const ACCEPTED = { 'image/*': [], 'video/*': [] };

export default function ContentEditor({
  type,
  onTypeChange,
  file,
  onFileDrop,
  onFileRemove,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  prompt,
  onPromptChange,
  fileError,
  onFileErrorClear
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const handleFileDrop = (acceptedFiles) => {
    const f = acceptedFiles[0];
    if (f) {
      onFileDrop(f);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED,
    multiple: false,
    onDrop: handleFileDrop,
    noClick: false,
    onDragEnter: onFileErrorClear
  });

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1}>
        {TYPES.map((t) => {
          const a = type === t.id;
          const Icon = t.icon;
          return (
            <Box
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                p: 1.5,
                borderRadius: 2.5,
                border: '2px solid',
                borderColor: a ? '#3b82f6' : 'divider',
                bgcolor: a ? alpha('#3b82f6', 0.06) : isDark ? '#1e293b' : 'white',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: a ? '#3b82f6' : alpha('#3b82f6', 0.2) }
              }}
            >
              <Icon size={20} style={{ color: a ? '#3b82f6' : isDark ? '#64748b' : '#999' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: a ? '#3b82f6' : 'text.secondary' }}>{t.label}</Typography>
            </Box>
          );
        })}
      </Stack>

      <Stack spacing={2}>
        {!file ? (
          <Box
            {...getRootProps()}
            sx={{
              borderRadius: 2.5,
              border: '2px dashed',
              borderColor: isDragActive ? '#3b82f6' : fileError ? '#f44336' : 'divider',
              bgcolor: isDragActive ? alpha('#3b82f6', 0.08) : fileError ? alpha('#f44336', 0.06) : isDark ? '#1e293b' : 'white',
              cursor: 'pointer',
              p: 3,
              textAlign: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <input {...getInputProps()} />
            <IconUpload size={24} style={{ color: fileError ? '#f44336' : isDark ? '#64748b' : '#bbb', margin: '0 auto 8px' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.25 }}>Drop media here or click to browse</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>MP4 video or images</Typography>
            {fileError && (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} sx={{ mt: 1.5, p: 1, borderRadius: 1.5, bgcolor: alpha('#f44336', 0.08), border: '1px solid', borderColor: alpha('#f44336', 0.2), display: 'inline-flex' }}>
                <IconAlertCircle size={14} style={{ color: '#f44336' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#f44336', fontWeight: 600 }}>{fileError}</Typography>
              </Stack>
            )}
          </Box>
        ) : (
          <Box>
            <Stack direction="row" spacing={2}>
              <Box
                sx={{
                  width: 100,
                  height: 70,
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  bgcolor: isDark ? '#1e293b' : 'grey.100',
                  flexShrink: 0
                }}
              >
                {file.type.startsWith('image') ? (
                  <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Box component="video" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                <IconButton
                  size="small"
                  onClick={onFileRemove}
                  sx={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    width: 18,
                    height: 18,
                    minWidth: 0
                  }}
                >
                  <IconX size={10} />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{file.name}</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type.startsWith('video') ? 'Video' : 'Image'}
                </Typography>
              </Box>
            </Stack>
            {fileError && (
              <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1, p: 1, borderRadius: 1.5, bgcolor: alpha('#f44336', 0.04), border: '1px solid', borderColor: alpha('#f44336', 0.12) }}>
                <IconAlertCircle size={14} style={{ color: '#f44336' }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#f44336' }}>{fileError}</Typography>
              </Stack>
            )}
          </Box>
        )}
        <TextField
          size="small"
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          label="Caption"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Stack>
    </Stack>
  );
}
