import React, { useState } from 'react';
import { Box, Button } from '@mui/material';

import PlatformSelector from './PlatformSelector';
import ContentTypeStep from './ContentTypeStep';
import PromptFields from './PromptFields';
import ConfirmPostDialog from './ConfirmPostDialog';

export default function PostComposer() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [postData, setPostData] = useState({
    platforms: [],
    contentType: null, // post | reel | video
    mode: 'manual', // manual | ai
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
    <Box sx={{ width: '100%', maxWidth: { sx: '100%', md: '65%' }, mx: 'auto', mb: 3 }}>
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
