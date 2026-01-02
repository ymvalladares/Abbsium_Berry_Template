import { useState, useMemo } from 'react';
import { Box, Button, TextField, Typography, Chip, useMediaQuery, Divider, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function PromptFields({ data, onChange }) {
  const [mode, setMode] = useState('manual');
  const { files, title, description, aiPrompt } = data;
  const file = files?.[0];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const MEDIA_HEIGHT = 280;

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { 'image/*': [], 'video/*': [] },
    onDrop: (accepted) => onChange('files', accepted)
  });

  const handleRemoveFile = () => {
    onChange('files', []);
  };

  return (
    <>
      {/* MODE SWITCH */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          p: 0.8,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          width: 'fit-content',
          background: '#FFF'
        }}
      >
        <Button
          variant={mode === 'manual' ? 'contained' : 'text'}
          startIcon={<CloudUploadOutlinedIcon />}
          onClick={() => setMode('manual')}
          size="small"
          sx={{ borderRadius: 3 }}
        >
          Manual upload
        </Button>

        <Button
          variant={mode === 'ai' ? 'contained' : 'text'}
          startIcon={<AutoAwesomeOutlinedIcon />}
          onClick={() => setMode('ai')}
          size="small"
          sx={{ borderRadius: 3 }}
        >
          AI generator
        </Button>
      </Box>

      {mode === 'manual' && (
        <>
          {/* DROPZONE */}
          <Box
            {...getRootProps()}
            sx={{
              mb: 3,
              borderRadius: 4,
              border: '2px dashed',
              borderColor: isDragActive ? '#7C3AED' : '#D1C4E9',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,224,255,0.35))',
              cursor: 'pointer',
              transition: '0.25s ease',
              p: 3
            }}
          >
            <input {...getInputProps()} />

            {!file && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: '#EDE4FF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CloudUploadOutlinedIcon sx={{ fontSize: 32, color: '#7C3AED' }} />
                </Box>

                <Typography fontWeight={600}>Drag & drop media here</Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse
                </Typography>
                <Typography variant="body2" sx={{ color: '#7C3AED' }}>
                  Images & Videos supported
                </Typography>
              </Box>
            )}

            {file && (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: 3
                }}
              >
                {/* MEDIA */}
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  {file.type.startsWith('image') ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="preview"
                      sx={{
                        width: '100%',
                        height: isMobile ? 240 : MEDIA_HEIGHT,
                        objectFit: 'cover',
                        borderRadius: 3
                      }}
                    />
                  ) : (
                    <Box
                      component="video"
                      src={previewUrl}
                      controls
                      sx={{
                        width: '100%',
                        height: isMobile ? 240 : MEDIA_HEIGHT,
                        objectFit: 'cover',
                        borderRadius: 3
                      }}
                    />
                  )}
                </Box>

                {/* INFO BOX – DESKTOP */}
                {!isMobile && (
                  <Box
                    sx={{
                      height: MEDIA_HEIGHT,
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: '#FFF',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    {/* HEADER */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip
                        sx={{ p: 1, fontWeight: 'bold' }}
                        icon={<CheckCircleOutlineIcon />}
                        label="Ready to use"
                        color="success"
                        size="small"
                      />

                      <Chip
                        label="Remove"
                        size="small"
                        onClick={handleRemoveFile}
                        sx={{
                          fontWeight: 'bold',
                          backgroundColor: '#E53E3E',
                          color: '#fff',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#C53030'
                          }
                        }}
                      />
                    </Box>

                    <Typography fontWeight={600} mt={2}>
                      Media overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Optimized preview & compatible format
                    </Typography>

                    {/* STATS */}
                    <Box>
                      <Divider sx={{ my: 2 }} />

                      <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography fontWeight={600}>{(file.size / 1024 / 1024).toFixed(1)} MB</Typography>
                          <Typography variant="body2" color="text.secondary">
                            File size
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center' }}>
                          <Typography fontWeight={600}>{file.type.startsWith('image') ? 'High' : 'HD'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Quality
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', maxWidth: 120, overflow: 'hidden' }}>
                          <Typography
                            fontWeight={600}
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={file.name} // tooltip con nombre completo
                          >
                            {file.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Name
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    {/* FOOTER */}
                    <Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        ✨ Tip: Clean visuals and vertical formats usually get higher engagement.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* MOBILE INFO */}
                {isMobile && (
                  <Box>
                    <Typography fontWeight={600} noWrap>
                      {file.name}
                    </Typography>
                    <Chip
                      label={file.type.startsWith('image') ? 'Image ready for use' : 'Video ready for use'}
                      size="small"
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* INPUTS */}
          <TextField
            fullWidth
            label="Post title"
            value={title}
            onChange={(e) => onChange('title', e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                fontSize: '16px',
                borderRadius: 3,
                background: '#FFF'
              }
            }}
          />

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Post description"
            value={description}
            onChange={(e) => onChange('description', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '16px',
                borderRadius: 3,
                background: '#FFF'
              }
            }}
          />
        </>
      )}

      {mode === 'ai' && (
        <Box>
          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Describe what you want to generate"
            value={aiPrompt}
            onChange={(e) => onChange('aiPrompt', e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '16px',
                borderRadius: 3,
                background: '#FFF'
              }
            }}
          />
          <Button variant="contained">Generate</Button>
        </Box>
      )}
    </>
  );
}
