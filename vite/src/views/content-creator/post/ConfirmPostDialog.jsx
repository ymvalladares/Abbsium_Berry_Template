import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  useMediaQuery,
  LinearProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { socialAPI } from '../../../services/AxiosService'; // tu API de social
import { showSnackbar } from '../../../utils/snackbarNotif';

export default function ConfirmPostDialog({ open, data, onClose }) {
  const file = data.files?.[0];
  const previewUrl = file ? URL.createObjectURL(file) : null;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const MEDIA_HEIGHT = 280;

  const [isPosting, setIsPosting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  const handlePublish = async () => {
    if (isPosting) return;
    setIsPosting(true);
    setProgress(0);
    setStatusText('Publishing...');

    try {
      const caption = `${data.title}${data.description ? '\n' + data.description : ''}`;

      const payload = {
        message: caption,
        photoUrl: file ? await toBase64(file) : '',
        caption
      };

      console.log('Calling postFacebook with payload:', payload);

      // Simular progreso mientras llega respuesta
      const fakeProgress = setInterval(() => {
        setProgress((old) => (old < 90 ? old + 5 : old));
      }, 200);

      const response = await socialAPI.postFacebook(payload);

      clearInterval(fakeProgress);
      setProgress(100);
      setStatusText('Published');
      console.log('Facebook response:', response);

      showSnackbar('Post published successfully on Facebook!', 'success');
    } catch (err) {
      console.error('Error posting:', err);
      setStatusText('Failed');
      showSnackbar('Failed to publish post', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  // Helper para convertir file a base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Confirm post
        <Typography variant="body2" color="text.secondary">
          Preview how your post will appear to your audience
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          sx={{
            borderRadius: 4,
            border: '2px dashed',
            borderColor: '#D1C4E9',
            background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(236,224,255,0.35))',
            overflow: 'hidden',
            mb: 3,
            p: 2
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 3
            }}
          >
            {file && (
              <Box
                sx={{
                  width: '100%',
                  height: isMobile ? 240 : MEDIA_HEIGHT,
                  borderRadius: 3,
                  overflow: 'hidden'
                }}
              >
                {file.type.startsWith('image') ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }}
                  />
                ) : (
                  <Box
                    component="video"
                    src={previewUrl}
                    controls
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3 }}
                  />
                )}
              </Box>
            )}

            <Box
              sx={{
                height: isMobile ? 'auto' : MEDIA_HEIGHT,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Chip label="Ready to use" size="small" color="success" sx={{ fontWeight: 'bold', p: 1 }} />
                  {file && (
                    <Chip
                      label={file.type.startsWith('image') ? 'Image' : 'Video'}
                      size="small"
                      color="primary"
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    />
                  )}
                </Stack>
              </Box>

              <Box
                sx={{
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  p: 2,
                  mb: 2,
                  backgroundColor: '#FFF',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography fontWeight={600}>Media is optimized and ready for publication</Typography>
                </Box>

                <Box mt={2}>
                  <Typography variant="caption" color="text.secondary">
                    Preparation status
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 2,
                      mt: 0.5,
                      backgroundColor: 'rgba(124,58,237,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                        backgroundColor: '#7C3AED'
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {statusText}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={3} mt={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Content type
                    </Typography>
                    <Typography fontWeight={600}>{data.contentType}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      File
                    </Typography>
                    <Typography fontWeight={600}>{file?.name}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {data.platforms?.map((p) => (
                    <Chip key={p} label={p} size="small" />
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isPosting}>
          Back
        </Button>
        <Button variant="contained" size="large" disabled={isPosting} onClick={handlePublish}>
          {isPosting ? 'Publishing...' : 'Publish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
