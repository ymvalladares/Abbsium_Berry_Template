import React, { useState } from 'react';
import { Box, Button, Typography, Divider, Paper, Grid, Stack, Avatar } from '@mui/material';
import DevicesIcon from '@mui/icons-material/Devices';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import PlatformSelector from './PlatformSelector';
import ContentTypeStep from './ContentTypeStep';
import PromptFields from './PromptFields';
import ConfirmPostDialog from './ConfirmPostDialog';

export default function PostComposer() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [postData, setPostData] = useState({
    platforms: [],
    contentType: null,
    mode: 'manual',
    files: [],
    title: '',
    description: '',
    aiPrompt: ''
  });

  const updatePostData = (key, value) => {
    setPostData((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = postData.platforms.length > 0 && postData.contentType && (postData.mode === 'ai' || postData.files.length > 0);

  return (
    <Box sx={{ width: '100%', maxWidth: { sx: '100%', md: '75%' }, mx: 'auto', mb: 3 }}>
      <Box
        sx={{
          mt: 3,
          mb: 5
        }}
      >
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography sx={{ fontSize: 20, fontWeight: 900, color: '#111' }}>
            Distribute on YouTube, Instagram, Facebook, and TikTok from a single platform.{' '}
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 720 }}>
            Publish on multiple platforms with an optimized workflow — AI generation, one-click upload, and scheduling.
          </Typography>
        </Stack>
      </Box>

      <PlatformSelector value={postData.platforms} onChange={(v) => updatePostData('platforms', v)} />

      <ContentTypeStep value={postData.contentType} onChange={(v) => updatePostData('contentType', v)} />

      <PromptFields data={postData} onChange={updatePostData} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          sx={{
            border: canSubmit ? '1px solid #5E35B1' : '',
            backgroundColor: '#FFF',
            color: '#5E35B1',
            borderRadius: 3,
            fontWeight: 'bold',
            px: 5,
            cursor: 'pointer',
            fontSize: 14
          }}
          size="large"
          disabled={!canSubmit}
          onClick={() => setConfirmOpen(true)}
        >
          Create View
        </Button>
      </Box>

      <ConfirmPostDialog open={confirmOpen} data={postData} onClose={() => setConfirmOpen(false)} />
    </Box>
  );
}
